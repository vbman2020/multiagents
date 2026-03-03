/**
 * XML utility functions for parsing, stringifying, and validating XML.
 */

/**
 * Interface representing a parsed XML element
 */
export interface XmlElement {
  name: string;
  attributes?: { [key: string]: string };
  children?: (XmlElement | string)[];
  text?: string;
}

/**
 * Interface representing validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Parses an XML string into a JavaScript object representation.
 * 
 * @param xmlString - The XML string to parse
 * @returns The parsed XML as a JavaScript object
 * 
 * @example
 * parseXml('<root><item>value</item></root>')
 * // Returns: { name: 'root', children: [{ name: 'item', text: 'value' }] }
 */
export function parseXml(xmlString: string): XmlElement {
  // Handle edge cases
  if (typeof xmlString !== 'string') {
    throw new Error('Input must be a string');
  }

  const trimmed = xmlString.trim();
  
  if (trimmed === '') {
    throw new Error('XML string cannot be empty');
  }

  // Validate basic XML structure
  const validation = validateXml(xmlString);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.errors.join(', ')}`);
  }

  // Parse the XML
  return parseElement(trimmed);
}

/**
 * Helper function to parse a single XML element
 */
function parseElement(xml: string): XmlElement {
  xml = xml.trim();

  // Handle self-closing tags (with optional space before />)
  const selfClosingMatch = xml.match(/^<([a-zA-Z_][\w\-\.]*)([^>]*?)\/\s*>$/);
  if (selfClosingMatch) {
    const name = selfClosingMatch[1];
    const attributesStr = selfClosingMatch[2].trim();
    const attributes = parseAttributes(attributesStr);
    
    const element: XmlElement = { name };
    if (Object.keys(attributes).length > 0) {
      element.attributes = attributes;
    }
    return element;
  }

  // Match opening tag
  const openTagMatch = xml.match(/^<([a-zA-Z_][\w\-\.]*)([^>]*?)>/);
  if (!openTagMatch) {
    throw new Error('Invalid XML element structure');
  }

  const name = openTagMatch[1];
  const attributesStr = openTagMatch[2].trim();
  const attributes = parseAttributes(attributesStr);

  // Find the matching closing tag
  const closingTag = `</${name}>`;
  const closingIndex = findClosingTagIndex(xml, name);

  if (closingIndex === -1) {
    throw new Error(`No closing tag found for <${name}>`);
  }

  const contentStart = openTagMatch[0].length;
  const content = xml.substring(contentStart, closingIndex).trim();

  const element: XmlElement = { name };
  
  if (Object.keys(attributes).length > 0) {
    element.attributes = attributes;
  }

  // Parse content
  if (content === '') {
    // Empty element
    return element;
  }

  // Check if content contains child elements or is just text
  if (content.includes('<')) {
    const children = parseChildren(content);
    if (children.length > 0) {
      element.children = children;
    }
  } else {
    // Pure text content
    element.text = decodeXmlEntities(content);
  }

  return element;
}

/**
 * Helper function to find the index of the closing tag
 */
function findClosingTagIndex(xml: string, tagName: string): number {
  let depth = 0;
  let pos = 0;
  const openTag = new RegExp(`<${tagName}(?:\\s|>|/)`, 'g');
  const closeTag = new RegExp(`</${tagName}>`, 'g');
  
  // Skip the first opening tag
  const firstOpen = xml.match(openTag);
  if (!firstOpen) return -1;
  pos = firstOpen[0].length;

  while (pos < xml.length) {
    const restXml = xml.substring(pos);
    
    openTag.lastIndex = 0;
    closeTag.lastIndex = 0;
    
    const nextOpen = openTag.exec(restXml);
    const nextClose = closeTag.exec(restXml);

    if (!nextClose) return -1;

    const openIndex = nextOpen ? nextOpen.index : Infinity;
    const closeIndex = nextClose.index;

    if (closeIndex < openIndex) {
      if (depth === 0) {
        return pos + closeIndex;
      }
      depth--;
      pos += closeIndex + nextClose[0].length;
    } else {
      depth++;
      pos += openIndex + nextOpen![0].length;
    }
  }

  return -1;
}

/**
 * Helper function to parse attributes from an attributes string
 */
function parseAttributes(attributesStr: string): { [key: string]: string } {
  const attributes: { [key: string]: string } = {};
  
  if (!attributesStr) return attributes;

  // Match attribute patterns: name="value" or name='value'
  const attrRegex = /([a-zA-Z_][\w\-\.]*)\s*=\s*["']([^"']*)["']/g;
  let match;

  while ((match = attrRegex.exec(attributesStr)) !== null) {
    const attrName = match[1];
    const attrValue = decodeXmlEntities(match[2]);
    attributes[attrName] = attrValue;
  }

  return attributes;
}

/**
 * Helper function to parse child elements from content
 */
function parseChildren(content: string): (XmlElement | string)[] {
  const children: (XmlElement | string)[] = [];
  let pos = 0;

  while (pos < content.length) {
    const rest = content.substring(pos).trim();
    if (!rest) break;

    if (rest.startsWith('<')) {
      // Parse element
      const tagMatch = rest.match(/^<([a-zA-Z_][\w\-\.]*)/);
      if (!tagMatch) {
        pos++;
        continue;
      }

      const tagName = tagMatch[1];
      
      // Check for self-closing tag
      const selfClosingMatch = rest.match(/^<[^>]+\/\s*>/);
      if (selfClosingMatch) {
        const elementXml = selfClosingMatch[0];
        children.push(parseElement(elementXml));
        pos += content.substring(pos).indexOf(elementXml) + elementXml.length;
        continue;
      }

      // Find closing tag for this element
      const openTagMatch = rest.match(/^<[^>]+>/);
      if (!openTagMatch) {
        pos++;
        continue;
      }

      const closingIndex = findClosingTagIndex(rest, tagName);
      if (closingIndex === -1) {
        throw new Error(`No closing tag found for <${tagName}>`);
      }

      const elementXml = rest.substring(0, closingIndex + `</${tagName}>`.length);
      children.push(parseElement(elementXml));
      pos += content.substring(pos).indexOf(elementXml) + elementXml.length;
    } else {
      // Parse text content until next tag
      const nextTag = rest.indexOf('<');
      const textContent = nextTag === -1 ? rest : rest.substring(0, nextTag);
      const decoded = decodeXmlEntities(textContent.trim());
      if (decoded) {
        children.push(decoded);
      }
      pos += content.substring(pos).indexOf(textContent) + textContent.length;
    }
  }

  return children;
}

/**
 * Decodes XML entities to their character equivalents
 */
function decodeXmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Encodes special characters to XML entities
 */
function encodeXmlEntities(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts a JavaScript object back to an XML string.
 * 
 * @param obj - The JavaScript object to convert
 * @returns The XML string representation
 * 
 * @example
 * stringifyXml({ name: 'root', children: [{ name: 'item', text: 'value' }] })
 * // Returns: '<root><item>value</item></root>'
 */
export function stringifyXml(obj: XmlElement): string {
  // Handle edge cases
  if (!obj || typeof obj !== 'object') {
    throw new Error('Input must be an XmlElement object');
  }

  if (typeof obj.name !== 'string' || obj.name === undefined || obj.name === null) {
    throw new Error('XmlElement must have a valid name property');
  }

  // Validate element name
  if (!/^[a-zA-Z_][\w\-\.]*$/.test(obj.name)) {
    throw new Error(`Invalid element name: ${obj.name}`);
  }

  let xml = `<${obj.name}`;

  // Add attributes
  if (obj.attributes) {
    for (const [key, value] of Object.entries(obj.attributes)) {
      if (!/^[a-zA-Z_][\w\-\.]*$/.test(key)) {
        throw new Error(`Invalid attribute name: ${key}`);
      }
      xml += ` ${key}="${encodeXmlEntities(String(value))}"`;
    }
  }

  // Check if we should create a self-closing tag
  // Only if there are no children, no text, or text is undefined (not empty string)
  if (!obj.children && obj.text === undefined) {
    xml += ' />';
    return xml;
  }

  xml += '>';

  // Add text content
  if (obj.text !== undefined) {
    xml += encodeXmlEntities(String(obj.text));
  }

  // Add children
  if (obj.children) {
    for (const child of obj.children) {
      if (typeof child === 'string') {
        xml += encodeXmlEntities(child);
      } else {
        xml += stringifyXml(child);
      }
    }
  }

  xml += `</${obj.name}>`;

  return xml;
}

/**
 * Validates XML string for well-formedness and returns any errors.
 * 
 * @param xmlString - The XML string to validate
 * @returns An object with valid flag and array of error messages
 * 
 * @example
 * validateXml('<root><item>value</item></root>')
 * // Returns: { valid: true, errors: [] }
 * 
 * validateXml('<root><item>value</root>')
 * // Returns: { valid: false, errors: ['Mismatched closing tag: expected </item>, found </root>'] }
 */
export function validateXml(xmlString: string): ValidationResult {
  const errors: string[] = [];

  // Type check
  if (typeof xmlString !== 'string') {
    errors.push('Input must be a string');
    return { valid: false, errors };
  }

  const trimmed = xmlString.trim();

  // Check for empty string
  if (trimmed === '') {
    errors.push('XML string cannot be empty');
    return { valid: false, errors };
  }

  // Check if it starts with < and ends with >
  if (!trimmed.startsWith('<') || !trimmed.endsWith('>')) {
    errors.push('XML must start with < and end with >');
    return { valid: false, errors };
  }

  // Check for XML declaration (optional, but if present must be first)
  if (trimmed.startsWith('<?xml')) {
    const declEnd = trimmed.indexOf('?>');
    if (declEnd === -1) {
      errors.push('XML declaration not properly closed');
      return { valid: false, errors };
    }
  }

  // Extract just the root element (skip declaration if present)
  let rootXml = trimmed;
  if (trimmed.startsWith('<?xml')) {
    const declEnd = trimmed.indexOf('?>');
    rootXml = trimmed.substring(declEnd + 2).trim();
  }

  // Must have at least one root element
  if (!rootXml) {
    errors.push('XML must contain at least one root element');
    return { valid: false, errors };
  }

  // Validate tag structure
  try {
    validateTagStructure(rootXml);
  } catch (error) {
    errors.push((error as Error).message);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Helper function to validate tag structure
 */
function validateTagStructure(xml: string): void {
  const tagStack: string[] = [];
  let pos = 0;
  let rootElementCount = 0;

  while (pos < xml.length) {
    const nextOpen = xml.indexOf('<', pos);
    
    if (nextOpen === -1) {
      // No more tags
      break;
    }

    const nextClose = xml.indexOf('>', nextOpen);
    if (nextClose === -1) {
      throw new Error('Unclosed tag found');
    }

    const tagContent = xml.substring(nextOpen + 1, nextClose);

    // Handle comments
    if (tagContent.startsWith('!--')) {
      const commentEnd = xml.indexOf('-->', nextOpen);
      if (commentEnd === -1) {
        throw new Error('Unclosed comment');
      }
      pos = commentEnd + 3;
      continue;
    }

    // Handle CDATA
    if (tagContent.startsWith('![CDATA[')) {
      const cdataEnd = xml.indexOf(']]>', nextOpen);
      if (cdataEnd === -1) {
        throw new Error('Unclosed CDATA section');
      }
      pos = cdataEnd + 3;
      continue;
    }

    // Handle processing instructions
    if (tagContent.startsWith('?')) {
      pos = nextClose + 1;
      continue;
    }

    // Handle closing tags
    if (tagContent.startsWith('/')) {
      const tagName = tagContent.substring(1).trim();
      
      if (tagStack.length === 0) {
        throw new Error(`Unexpected closing tag: </${tagName}>`);
      }

      const expectedTag = tagStack.pop();
      if (tagName !== expectedTag) {
        throw new Error(`Mismatched closing tag: expected </${expectedTag}>, found </${tagName}>`);
      }

      pos = nextClose + 1;
      continue;
    }

    // Handle self-closing tags (with optional space before />)
    if (tagContent.endsWith('/') || tagContent.match(/\/\s*$/)) {
      const tagName = tagContent.replace(/\/\s*$/, '').trim().split(/\s/)[0];
      
      if (!tagName || !/^[a-zA-Z_][\w\-\.]*$/.test(tagName)) {
        throw new Error(`Invalid tag name: ${tagName}`);
      }

      // Count as a root element if stack is empty
      if (tagStack.length === 0) {
        rootElementCount++;
        if (rootElementCount > 1) {
          throw new Error('XML document can only have one root element');
        }
      }

      pos = nextClose + 1;
      continue;
    }

    // Handle opening tags
    const tagName = tagContent.trim().split(/\s/)[0];
    
    if (!tagName || !/^[a-zA-Z_][\w\-\.]*$/.test(tagName)) {
      throw new Error(`Invalid tag name: ${tagName}`);
    }

    tagStack.push(tagName);
    
    // Track root elements
    if (tagStack.length === 1) {
      rootElementCount++;
      if (rootElementCount > 1) {
        throw new Error('XML document can only have one root element');
      }
    }
    
    pos = nextClose + 1;
  }

  // Check if all tags were closed
  if (tagStack.length > 0) {
    throw new Error(`Unclosed tags: ${tagStack.join(', ')}`);
  }
}
