"""
XML to JSON conversion utility module.

This module provides functions to convert between XML and JSON formats,
using only the standard library xml.etree.ElementTree for XML parsing.
"""

import json
import xml.etree.ElementTree as ET
from typing import Any, Dict, Union
from pathlib import Path


def xml_to_json(xml_string: str) -> Dict[str, Any]:
    """
    Parse an XML string and return a JSON-compatible dictionary.
    
    The conversion follows these rules:
    - XML attributes are stored in an '@attributes' key
    - Text content is stored in a '#text' key
    - Child elements are stored by their tag name
    - Multiple children with the same tag name are stored as a list
    
    Args:
        xml_string: A string containing valid XML
        
    Returns:
        A dictionary representing the XML structure in JSON-compatible format
        
    Raises:
        ET.ParseError: If the XML string is invalid
        ValueError: If the XML string is empty
        
    Examples:
        >>> xml = '<root><item>value</item></root>'
        >>> xml_to_json(xml)
        {'root': {'item': 'value'}}
        
        >>> xml = '<root attr="test"><item>value</item></root>'
        >>> xml_to_json(xml)
        {'root': {'@attributes': {'attr': 'test'}, 'item': 'value'}}
    """
    if not xml_string or not xml_string.strip():
        raise ValueError("XML string cannot be empty")
    
    try:
        root = ET.fromstring(xml_string)
    except ET.ParseError as e:
        raise ET.ParseError(f"Invalid XML: {e}")
    
    return {root.tag: _element_to_dict(root)}


def _element_to_dict(element: ET.Element) -> Union[Dict[str, Any], str]:
    """
    Convert an XML Element to a dictionary.
    
    Args:
        element: An xml.etree.ElementTree.Element object
        
    Returns:
        A dictionary or string representing the element
    """
    result: Dict[str, Any] = {}
    
    # Add attributes if present
    if element.attrib:
        result['@attributes'] = dict(element.attrib)
    
    # Process children
    children = list(element)
    if children:
        # Group children by tag name
        child_dict: Dict[str, list] = {}
        for child in children:
            child_data = _element_to_dict(child)
            if child.tag not in child_dict:
                child_dict[child.tag] = []
            child_dict[child.tag].append(child_data)
        
        # Add children to result
        for tag, items in child_dict.items():
            if len(items) == 1:
                result[tag] = items[0]
            else:
                result[tag] = items
    
    # Add text content if present
    if element.text and element.text.strip():
        text = element.text.strip()
        if not result:
            # If no attributes or children, return just the text
            return text
        else:
            # If there are attributes or children, add text as a field
            result['#text'] = text
    
    # Handle tail text (text after the closing tag, before next sibling)
    # This is typically not needed in most XML structures but included for completeness
    if element.tail and element.tail.strip():
        # Tail is usually handled by the parent, so we don't include it here
        pass
    
    # Return empty dict if no content, attributes, or children
    return result if result else ''


def json_to_xml(data: Dict[str, Any], root_tag: str = 'root') -> str:
    """
    Convert a dictionary to an XML string with a specified root tag.
    
    The conversion follows these rules:
    - The '@attributes' key is converted to XML attributes
    - The '#text' key is converted to element text content
    - Other keys are converted to child elements
    - Lists are converted to multiple elements with the same tag name
    
    Args:
        data: A dictionary to convert to XML
        root_tag: The tag name for the root element (default: 'root')
        
    Returns:
        A string containing the XML representation
        
    Raises:
        ValueError: If data is not a dictionary or is empty
        
    Examples:
        >>> data = {'item': 'value'}
        >>> json_to_xml(data, 'root')
        '<root><item>value</item></root>'
        
        >>> data = {'@attributes': {'attr': 'test'}, 'item': 'value'}
        >>> json_to_xml(data, 'root')
        '<root attr="test"><item>value</item></root>'
    """
    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary")
    
    if not data:
        # Return empty root element
        return f'<{root_tag} />'
    
    # If data has a single key that's not a special key, use it as root
    if len(data) == 1 and not any(k.startswith('@') or k.startswith('#') for k in data.keys()):
        root_tag = list(data.keys())[0]
        root_data = data[root_tag]
    else:
        root_data = data
    
    root = ET.Element(root_tag)
    _dict_to_element(root, root_data)
    
    return ET.tostring(root, encoding='unicode', method='xml')


def _dict_to_element(element: ET.Element, data: Union[Dict[str, Any], str, list]) -> None:
    """
    Populate an XML Element from a dictionary.
    
    Args:
        element: An xml.etree.ElementTree.Element to populate
        data: Dictionary, string, or list data to convert
    """
    if isinstance(data, str):
        element.text = data
        return
    
    if isinstance(data, (int, float, bool)):
        element.text = str(data)
        return
    
    if isinstance(data, list):
        # This shouldn't happen at the root level but handle it gracefully
        # Lists should only appear as values for specific tags
        return
    
    if not isinstance(data, dict):
        return
    
    # Process attributes first
    if '@attributes' in data:
        attrs = data['@attributes']
        if isinstance(attrs, dict):
            for key, value in attrs.items():
                element.set(key, str(value))
    
    # Process text content
    if '#text' in data:
        element.text = str(data['#text'])
    
    # Process child elements
    for key, value in data.items():
        if key in ('@attributes', '#text'):
            continue
        
        if isinstance(value, list):
            # Multiple elements with the same tag
            for item in value:
                child = ET.SubElement(element, key)
                _dict_to_element(child, item)
        else:
            # Single element
            child = ET.SubElement(element, key)
            _dict_to_element(child, value)


def convert_file(input_path: str, output_path: str) -> None:
    """
    Read an XML or JSON file and write the converted output.
    
    The function automatically detects the input file type based on its extension
    and performs the appropriate conversion:
    - .xml files are converted to JSON
    - .json files are converted to XML
    
    Args:
        input_path: Path to the input file (XML or JSON)
        output_path: Path where the converted output will be written
        
    Raises:
        FileNotFoundError: If the input file does not exist
        ValueError: If the input file type is not supported or content is invalid
        IOError: If there's an error reading or writing files
        
    Examples:
        >>> convert_file('data.xml', 'data.json')  # XML to JSON
        >>> convert_file('data.json', 'data.xml')  # JSON to XML
    """
    input_file = Path(input_path)
    output_file = Path(output_path)
    
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")
    
    if not input_file.is_file():
        raise ValueError(f"Input path is not a file: {input_path}")
    
    # Read input file
    try:
        content = input_file.read_text(encoding='utf-8')
    except Exception as e:
        raise IOError(f"Error reading input file: {e}")
    
    # Determine conversion direction based on file extension
    input_ext = input_file.suffix.lower()
    output_ext = output_file.suffix.lower()
    
    try:
        if input_ext == '.xml':
            # XML to JSON conversion
            result = xml_to_json(content)
            output_content = json.dumps(result, indent=2, ensure_ascii=False)
        elif input_ext == '.json':
            # JSON to XML conversion
            data = json.loads(content)
            if not isinstance(data, dict):
                raise ValueError("JSON file must contain an object/dictionary")
            
            # Determine root tag from output filename or use default
            root_tag = output_file.stem if output_file.stem else 'root'
            
            # If JSON has a single top-level key, use it as root
            if len(data) == 1:
                root_tag = list(data.keys())[0]
                output_content = json_to_xml(data, root_tag)
            else:
                # Multiple top-level keys, wrap in a root element
                output_content = json_to_xml(data, root_tag)
        else:
            raise ValueError(
                f"Unsupported input file type: {input_ext}. "
                "Supported types are: .xml, .json"
            )
    except ET.ParseError as e:
        raise ValueError(f"Invalid XML content: {e}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON content: {e}")
    
    # Write output file
    try:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(output_content, encoding='utf-8')
    except Exception as e:
        raise IOError(f"Error writing output file: {e}")


if __name__ == '__main__':
    # Example usage
    xml_example = '''<?xml version="1.0"?>
    <root>
        <person id="1">
            <name>John</name>
            <age>30</age>
        </person>
        <person id="2">
            <name>Jane</name>
            <age>25</age>
        </person>
    </root>'''
    
    print("XML to JSON:")
    result = xml_to_json(xml_example)
    print(json.dumps(result, indent=2))
    
    print("\nJSON back to XML:")
    xml_result = json_to_xml(result, 'root')
    print(xml_result)
