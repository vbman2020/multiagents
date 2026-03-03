import { parseXml, stringifyXml, validateXml, XmlElement } from './xml-utils';

describe('parseXml', () => {
  describe('normal cases', () => {
    it('should parse simple self-closing tag', () => {
      const result = parseXml('<root />');
      expect(result).toEqual({ name: 'root' });
    });

    it('should parse simple element with text content', () => {
      const result = parseXml('<root>Hello World</root>');
      expect(result).toEqual({
        name: 'root',
        text: 'Hello World'
      });
    });

    it('should parse element with attributes', () => {
      const result = parseXml('<root id="123" class="test" />');
      expect(result).toEqual({
        name: 'root',
        attributes: { id: '123', class: 'test' }
      });
    });

    it('should parse nested elements', () => {
      const result = parseXml('<root><child>value</child></root>');
      expect(result).toEqual({
        name: 'root',
        children: [
          { name: 'child', text: 'value' }
        ]
      });
    });

    it('should parse multiple children', () => {
      const result = parseXml('<root><child1>val1</child1><child2>val2</child2></root>');
      expect(result).toEqual({
        name: 'root',
        children: [
          { name: 'child1', text: 'val1' },
          { name: 'child2', text: 'val2' }
        ]
      });
    });

    it('should parse deeply nested elements', () => {
      const result = parseXml('<root><level1><level2><level3>deep</level3></level2></level1></root>');
      expect(result).toEqual({
        name: 'root',
        children: [
          {
            name: 'level1',
            children: [
              {
                name: 'level2',
                children: [
                  { name: 'level3', text: 'deep' }
                ]
              }
            ]
          }
        ]
      });
    });

    it('should parse mixed content (text and elements)', () => {
      const result = parseXml('<root>text1<child>value</child>text2</root>');
      expect(result.name).toBe('root');
      expect(result.children).toBeDefined();
      expect(result.children?.length).toBe(3);
    });

    it('should parse empty element', () => {
      const result = parseXml('<root></root>');
      expect(result).toEqual({ name: 'root' });
    });

    it('should parse element with attributes and text', () => {
      const result = parseXml('<root id="1">content</root>');
      expect(result).toEqual({
        name: 'root',
        attributes: { id: '1' },
        text: 'content'
      });
    });

    it('should handle tag names with hyphens and underscores', () => {
      const result = parseXml('<root_element><child-node>value</child-node></root_element>');
      expect(result).toEqual({
        name: 'root_element',
        children: [
          { name: 'child-node', text: 'value' }
        ]
      });
    });
  });

  describe('XML entities', () => {
    it('should decode basic XML entities in text', () => {
      const result = parseXml('<root>&lt;&gt;&amp;&quot;&apos;</root>');
      expect(result.text).toBe('<>&"\'');
    });

    it('should decode basic XML entities in attributes', () => {
      const result = parseXml('<root attr="&lt;&gt;&amp;" />');
      expect(result.attributes?.attr).toBe('<>&');
    });

    it('should decode numeric character references', () => {
      const result = parseXml('<root>&#65;&#66;&#67;</root>');
      expect(result.text).toBe('ABC');
    });

    it('should decode hexadecimal character references', () => {
      const result = parseXml('<root>&#x41;&#x42;&#x43;</root>');
      expect(result.text).toBe('ABC');
    });
  });

  describe('whitespace handling', () => {
    it('should handle leading/trailing whitespace in XML', () => {
      const result = parseXml('  <root>value</root>  ');
      expect(result).toEqual({
        name: 'root',
        text: 'value'
      });
    });

    it('should handle whitespace in element content', () => {
      const result = parseXml('<root>  value  </root>');
      expect(result.text).toBe('value');
    });

    it('should handle newlines and tabs', () => {
      const result = parseXml('<root>\n\t<child>value</child>\n</root>');
      expect(result.children).toBeDefined();
      expect(result.children?.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should throw error for empty string', () => {
      expect(() => parseXml('')).toThrow('XML string cannot be empty');
    });

    it('should throw error for non-string input', () => {
      expect(() => parseXml(123 as any)).toThrow('Input must be a string');
      expect(() => parseXml(null as any)).toThrow('Input must be a string');
      expect(() => parseXml(undefined as any)).toThrow('Input must be a string');
    });

    it('should throw error for unclosed tags', () => {
      expect(() => parseXml('<root><child></root>')).toThrow('Invalid XML');
    });

    it('should throw error for mismatched tags', () => {
      expect(() => parseXml('<root></wrong>')).toThrow('Invalid XML');
    });

    it('should throw error for invalid XML structure', () => {
      expect(() => parseXml('not xml')).toThrow('Invalid XML');
    });

    it('should handle self-closing tags with spaces', () => {
      const result = parseXml('<root / >');
      expect(result).toEqual({ name: 'root' });
    });

    it('should parse elements with duplicate sibling tags', () => {
      const result = parseXml('<root><item>1</item><item>2</item><item>3</item></root>');
      expect(result.children?.length).toBe(3);
    });

    it('should handle attributes with single quotes', () => {
      const result = parseXml("<root attr='value' />");
      expect(result.attributes?.attr).toBe('value');
    });

    it('should handle attributes with mixed quotes', () => {
      const result = parseXml('<root attr1="val1" attr2=\'val2\' />');
      expect(result.attributes?.attr1).toBe('val1');
      expect(result.attributes?.attr2).toBe('val2');
    });
  });
});

describe('stringifyXml', () => {
  describe('normal cases', () => {
    it('should stringify simple self-closing element', () => {
      const obj: XmlElement = { name: 'root' };
      const result = stringifyXml(obj);
      expect(result).toBe('<root />');
    });

    it('should stringify element with text content', () => {
      const obj: XmlElement = { name: 'root', text: 'Hello World' };
      const result = stringifyXml(obj);
      expect(result).toBe('<root>Hello World</root>');
    });

    it('should stringify element with attributes', () => {
      const obj: XmlElement = {
        name: 'root',
        attributes: { id: '123', class: 'test' }
      };
      const result = stringifyXml(obj);
      expect(result).toContain('id="123"');
      expect(result).toContain('class="test"');
      expect(result).toContain('<root');
      expect(result).toContain('/>');
    });

    it('should stringify nested elements', () => {
      const obj: XmlElement = {
        name: 'root',
        children: [
          { name: 'child', text: 'value' }
        ]
      };
      const result = stringifyXml(obj);
      expect(result).toBe('<root><child>value</child></root>');
    });

    it('should stringify multiple children', () => {
      const obj: XmlElement = {
        name: 'root',
        children: [
          { name: 'child1', text: 'val1' },
          { name: 'child2', text: 'val2' }
        ]
      };
      const result = stringifyXml(obj);
      expect(result).toBe('<root><child1>val1</child1><child2>val2</child2></root>');
    });

    it('should stringify deeply nested elements', () => {
      const obj: XmlElement = {
        name: 'root',
        children: [
          {
            name: 'level1',
            children: [
              {
                name: 'level2',
                children: [
                  { name: 'level3', text: 'deep' }
                ]
              }
            ]
          }
        ]
      };
      const result = stringifyXml(obj);
      expect(result).toBe('<root><level1><level2><level3>deep</level3></level2></level1></root>');
    });

    it('should stringify mixed content', () => {
      const obj: XmlElement = {
        name: 'root',
        children: [
          'text1',
          { name: 'child', text: 'value' },
          'text2'
        ]
      };
      const result = stringifyXml(obj);
      expect(result).toBe('<root>text1<child>value</child>text2</root>');
    });

    it('should stringify element with attributes and text', () => {
      const obj: XmlElement = {
        name: 'root',
        attributes: { id: '1' },
        text: 'content'
      };
      const result = stringifyXml(obj);
      expect(result).toBe('<root id="1">content</root>');
    });

    it('should handle tag names with hyphens and underscores', () => {
      const obj: XmlElement = {
        name: 'root_element',
        children: [
          { name: 'child-node', text: 'value' }
        ]
      };
      const result = stringifyXml(obj);
      expect(result).toBe('<root_element><child-node>value</child-node></root_element>');
    });
  });

  describe('XML entity encoding', () => {
    it('should encode special characters in text', () => {
      const obj: XmlElement = { name: 'root', text: '<>&"\'' };
      const result = stringifyXml(obj);
      expect(result).toBe('<root>&lt;&gt;&amp;&quot;&apos;</root>');
    });

    it('should encode special characters in attributes', () => {
      const obj: XmlElement = {
        name: 'root',
        attributes: { attr: '<>&' }
      };
      const result = stringifyXml(obj);
      expect(result).toContain('attr="&lt;&gt;&amp;"');
    });

    it('should encode ampersand correctly', () => {
      const obj: XmlElement = { name: 'root', text: 'A & B' };
      const result = stringifyXml(obj);
      expect(result).toBe('<root>A &amp; B</root>');
    });
  });

  describe('edge cases', () => {
    it('should throw error for null/undefined input', () => {
      expect(() => stringifyXml(null as any)).toThrow('Input must be an XmlElement object');
      expect(() => stringifyXml(undefined as any)).toThrow('Input must be an XmlElement object');
    });

    it('should throw error for non-object input', () => {
      expect(() => stringifyXml('string' as any)).toThrow('Input must be an XmlElement object');
      expect(() => stringifyXml(123 as any)).toThrow('Input must be an XmlElement object');
    });

    it('should throw error for missing name', () => {
      expect(() => stringifyXml({} as any)).toThrow('XmlElement must have a valid name property');
    });

    it('should throw error for invalid name', () => {
      expect(() => stringifyXml({ name: '' })).toThrow('Invalid element name');
      expect(() => stringifyXml({ name: '123' })).toThrow('Invalid element name');
      expect(() => stringifyXml({ name: 'hello world' })).toThrow('Invalid element name');
    });

    it('should throw error for invalid attribute name', () => {
      const obj: XmlElement = {
        name: 'root',
        attributes: { '123': 'value' }
      };
      expect(() => stringifyXml(obj)).toThrow('Invalid attribute name');
    });

    it('should handle empty text', () => {
      const obj: XmlElement = { name: 'root', text: '' };
      const result = stringifyXml(obj);
      expect(result).toBe('<root></root>');
    });

    it('should handle empty children array', () => {
      const obj: XmlElement = { name: 'root', children: [] };
      const result = stringifyXml(obj);
      expect(result).toBe('<root></root>');
    });

    it('should handle numeric text content', () => {
      const obj: XmlElement = { name: 'root', text: '123' };
      const result = stringifyXml(obj);
      expect(result).toBe('<root>123</root>');
    });

    it('should handle both text and children', () => {
      const obj: XmlElement = {
        name: 'root',
        text: 'some text',
        children: [{ name: 'child', text: 'value' }]
      };
      const result = stringifyXml(obj);
      expect(result).toContain('some text');
      expect(result).toContain('<child>value</child>');
    });
  });
});

describe('validateXml', () => {
  describe('valid XML', () => {
    it('should validate simple self-closing tag', () => {
      const result = validateXml('<root />');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate element with text content', () => {
      const result = validateXml('<root>Hello World</root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate element with attributes', () => {
      const result = validateXml('<root id="123" class="test" />');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate nested elements', () => {
      const result = validateXml('<root><child>value</child></root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate multiple children', () => {
      const result = validateXml('<root><child1 /><child2 /><child3 /></root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate deeply nested elements', () => {
      const result = validateXml('<root><a><b><c><d>value</d></c></b></a></root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate empty element', () => {
      const result = validateXml('<root></root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate XML with declaration', () => {
      const result = validateXml('<?xml version="1.0"?><root />');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate XML with comments', () => {
      const result = validateXml('<root><!-- comment --><child /></root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate XML with CDATA', () => {
      const result = validateXml('<root><![CDATA[some data]]></root>');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('invalid XML', () => {
    it('should identify empty string as invalid', () => {
      const result = validateXml('');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XML string cannot be empty');
    });

    it('should identify non-string input as invalid', () => {
      const result = validateXml(123 as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Input must be a string');
    });

    it('should identify unclosed tags', () => {
      const result = validateXml('<root><child>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Unclosed');
    });

    it('should identify mismatched tags', () => {
      const result = validateXml('<root></wrong>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Mismatched closing tag');
    });

    it('should identify missing opening bracket', () => {
      const result = validateXml('root>content</root>');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XML must start with < and end with >');
    });

    it('should identify missing closing bracket', () => {
      const result = validateXml('<root>content</root');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XML must start with < and end with >');
    });

    it('should identify unexpected closing tag', () => {
      const result = validateXml('</root>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Unexpected closing tag');
    });

    it('should identify unclosed XML declaration', () => {
      const result = validateXml('<?xml version="1.0"<root />');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XML declaration not properly closed');
    });

    it('should identify invalid tag names', () => {
      const result = validateXml('<123invalid />');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should identify unclosed comment', () => {
      const result = validateXml('<root><!-- unclosed comment</root>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Unclosed comment');
    });

    it('should identify unclosed CDATA', () => {
      const result = validateXml('<root><![CDATA[unclosed</root>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Unclosed CDATA');
    });

    it('should identify nested tag mismatch', () => {
      const result = validateXml('<root><child></wrong></root>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Mismatched');
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only string', () => {
      const result = validateXml('   ');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XML string cannot be empty');
    });

    it('should validate XML with whitespace', () => {
      const result = validateXml('  <root />  ');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should handle multiple root elements (invalid)', () => {
      const result = validateXml('<root1 /><root2 />');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('one root element');
    });

    it('should provide meaningful error messages', () => {
      const result = validateXml('<root><child></root>');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('child');
      expect(result.errors[0]).toContain('root');
    });

    it('should handle self-closing tags with attributes', () => {
      const result = validateXml('<root id="1" class="test" />');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should handle complex nested mismatches', () => {
      const result = validateXml('<root><a><b></a></b></root>');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('round-trip conversion', () => {
  it('should handle simple element round-trip', () => {
    const original = '<root />';
    const parsed = parseXml(original);
    const stringified = stringifyXml(parsed);
    const reparsed = parseXml(stringified);
    expect(reparsed).toEqual(parsed);
  });

  it('should handle element with text round-trip', () => {
    const original = '<root>Hello</root>';
    const parsed = parseXml(original);
    const stringified = stringifyXml(parsed);
    const reparsed = parseXml(stringified);
    expect(reparsed).toEqual(parsed);
  });

  it('should handle element with attributes round-trip', () => {
    const original = '<root id="123" />';
    const parsed = parseXml(original);
    const stringified = stringifyXml(parsed);
    const reparsed = parseXml(stringified);
    expect(reparsed).toEqual(parsed);
  });

  it('should handle nested elements round-trip', () => {
    const original = '<root><child><grandchild>value</grandchild></child></root>';
    const parsed = parseXml(original);
    const stringified = stringifyXml(parsed);
    const reparsed = parseXml(stringified);
    expect(reparsed).toEqual(parsed);
  });

  it('should handle special characters round-trip', () => {
    const obj: XmlElement = { name: 'root', text: '<>&"\'' };
    const stringified = stringifyXml(obj);
    const parsed = parseXml(stringified);
    expect(parsed.text).toBe('<>&"\'');
  });

  it('should handle complex structure round-trip', () => {
    const obj: XmlElement = {
      name: 'root',
      attributes: { id: '1', type: 'test' },
      children: [
        { name: 'child1', text: 'value1' },
        {
          name: 'child2',
          attributes: { attr: 'val' },
          children: [
            { name: 'grandchild', text: 'deep value' }
          ]
        }
      ]
    };
    const stringified = stringifyXml(obj);
    const parsed = parseXml(stringified);
    expect(parsed).toEqual(obj);
  });

  it('should handle multiple siblings round-trip', () => {
    const original = '<root><a>1</a><b>2</b><c>3</c></root>';
    const parsed = parseXml(original);
    const stringified = stringifyXml(parsed);
    const reparsed = parseXml(stringified);
    expect(reparsed.children?.length).toBe(parsed.children?.length);
  });

  it('should handle empty element round-trip', () => {
    const original = '<root></root>';
    const parsed = parseXml(original);
    const stringified = stringifyXml(parsed);
    const reparsed = parseXml(stringified);
    expect(reparsed).toEqual(parsed);
  });
});
