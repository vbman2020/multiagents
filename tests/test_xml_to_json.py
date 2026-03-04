"""
Comprehensive unit tests for the xml_to_json module.

Tests cover all functionality including edge cases for attributes,
nested elements, and text content.
"""

import pytest
import json
import xml.etree.ElementTree as ET
from pathlib import Path
import tempfile
import os

# Import the module to test
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from src.utils.xml_to_json import xml_to_json, json_to_xml, convert_file


class TestXmlToJson:
    """Tests for xml_to_json function."""
    
    def test_simple_element(self):
        """Test conversion of a simple XML element."""
        xml = '<root>test</root>'
        result = xml_to_json(xml)
        assert result == {'root': 'test'}
    
    def test_nested_elements(self):
        """Test conversion of nested XML elements."""
        xml = '<root><child>value</child></root>'
        result = xml_to_json(xml)
        assert result == {'root': {'child': 'value'}}
    
    def test_multiple_nested_levels(self):
        """Test conversion of deeply nested XML elements."""
        xml = '<root><level1><level2><level3>deep</level3></level2></level1></root>'
        result = xml_to_json(xml)
        expected = {
            'root': {
                'level1': {
                    'level2': {
                        'level3': 'deep'
                    }
                }
            }
        }
        assert result == expected
    
    def test_element_with_attributes(self):
        """Test conversion of XML element with attributes."""
        xml = '<root id="123" type="test">content</root>'
        result = xml_to_json(xml)
        assert result == {
            'root': {
                '@attributes': {'id': '123', 'type': 'test'},
                '#text': 'content'
            }
        }
    
    def test_element_with_attributes_no_text(self):
        """Test conversion of XML element with attributes but no text."""
        xml = '<root id="123"><child>value</child></root>'
        result = xml_to_json(xml)
        assert result == {
            'root': {
                '@attributes': {'id': '123'},
                'child': 'value'
            }
        }
    
    def test_multiple_children_same_tag(self):
        """Test conversion of multiple child elements with the same tag."""
        xml = '''<root>
            <item>first</item>
            <item>second</item>
            <item>third</item>
        </root>'''
        result = xml_to_json(xml)
        assert result == {
            'root': {
                'item': ['first', 'second', 'third']
            }
        }
    
    def test_multiple_children_different_tags(self):
        """Test conversion of multiple child elements with different tags."""
        xml = '''<root>
            <name>John</name>
            <age>30</age>
            <city>NYC</city>
        </root>'''
        result = xml_to_json(xml)
        assert result == {
            'root': {
                'name': 'John',
                'age': '30',
                'city': 'NYC'
            }
        }
    
    def test_complex_nested_structure(self):
        """Test conversion of complex nested structure with mixed content."""
        xml = '''<root>
            <person id="1">
                <name>Alice</name>
                <age>28</age>
            </person>
            <person id="2">
                <name>Bob</name>
                <age>32</age>
            </person>
        </root>'''
        result = xml_to_json(xml)
        expected = {
            'root': {
                'person': [
                    {
                        '@attributes': {'id': '1'},
                        'name': 'Alice',
                        'age': '28'
                    },
                    {
                        '@attributes': {'id': '2'},
                        'name': 'Bob',
                        'age': '32'
                    }
                ]
            }
        }
        assert result == expected
    
    def test_empty_element(self):
        """Test conversion of empty XML element."""
        xml = '<root></root>'
        result = xml_to_json(xml)
        assert result == {'root': ''}
    
    def test_self_closing_element(self):
        """Test conversion of self-closing XML element."""
        xml = '<root />'
        result = xml_to_json(xml)
        assert result == {'root': ''}
    
    def test_element_with_whitespace_text(self):
        """Test that whitespace-only text is ignored."""
        xml = '<root>   </root>'
        result = xml_to_json(xml)
        assert result == {'root': ''}
    
    def test_element_with_mixed_content_and_attributes(self):
        """Test element with both text, attributes, and children."""
        xml = '''<root type="mixed">
            <child>value</child>
        </root>'''
        result = xml_to_json(xml)
        # Note: Mixed content (text + children) is complex; we handle children
        assert '@attributes' in result['root']
        assert result['root']['@attributes'] == {'type': 'mixed'}
        assert 'child' in result['root']
    
    def test_xml_with_declaration(self):
        """Test XML with declaration is handled correctly."""
        xml = '<?xml version="1.0" encoding="UTF-8"?><root>test</root>'
        result = xml_to_json(xml)
        assert result == {'root': 'test'}
    
    def test_special_characters_in_text(self):
        """Test handling of special characters in text content."""
        xml = '<root>&lt;tag&gt; &amp; "quotes"</root>'
        result = xml_to_json(xml)
        assert result == {'root': '<tag> & "quotes"'}
    
    def test_unicode_content(self):
        """Test handling of Unicode characters."""
        xml = '<root>Hello 世界 🌍</root>'
        result = xml_to_json(xml)
        assert result == {'root': 'Hello 世界 🌍'}
    
    def test_invalid_xml_raises_error(self):
        """Test that invalid XML raises ParseError."""
        xml = '<root><unclosed>'
        with pytest.raises(ET.ParseError):
            xml_to_json(xml)
    
    def test_empty_string_raises_error(self):
        """Test that empty string raises ValueError."""
        with pytest.raises(ValueError, match="XML string cannot be empty"):
            xml_to_json('')
    
    def test_whitespace_only_string_raises_error(self):
        """Test that whitespace-only string raises ValueError."""
        with pytest.raises(ValueError, match="XML string cannot be empty"):
            xml_to_json('   \n\t   ')
    
    def test_numeric_tag_names(self):
        """Test elements with numeric-looking tag names."""
        xml = '<root><item1>value1</item1><item2>value2</item2></root>'
        result = xml_to_json(xml)
        assert result == {'root': {'item1': 'value1', 'item2': 'value2'}}
    
    def test_attributes_with_special_characters(self):
        """Test attributes containing special characters."""
        xml = '<root attr="value&lt;&gt;" />'
        result = xml_to_json(xml)
        assert result == {'root': {'@attributes': {'attr': 'value<>'}}}


class TestJsonToXml:
    """Tests for json_to_xml function."""
    
    def test_simple_dict(self):
        """Test conversion of simple dictionary to XML."""
        data = {'item': 'value'}
        result = json_to_xml(data, 'root')
        # Parse it back to verify structure
        root = ET.fromstring(result)
        assert root.tag == 'item'
        assert root.text == 'value'
    
    def test_nested_dict(self):
        """Test conversion of nested dictionary to XML."""
        data = {'root': {'child': 'value'}}
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        assert root.tag == 'root'
        child = root.find('child')
        assert child is not None
        assert child.text == 'value'
    
    def test_dict_with_attributes(self):
        """Test conversion of dictionary with attributes."""
        data = {
            '@attributes': {'id': '123', 'type': 'test'},
            '#text': 'content'
        }
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        assert root.get('id') == '123'
        assert root.get('type') == 'test'
        assert root.text == 'content'
    
    def test_dict_with_list_values(self):
        """Test conversion of dictionary with list values."""
        data = {
            'item': ['first', 'second', 'third']
        }
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        items = root.findall('item')
        assert len(items) == 3
        assert [item.text for item in items] == ['first', 'second', 'third']
    
    def test_complex_structure(self):
        """Test conversion of complex nested structure."""
        data = {
            'root': {
                'person': [
                    {
                        '@attributes': {'id': '1'},
                        'name': 'Alice',
                        'age': '28'
                    },
                    {
                        '@attributes': {'id': '2'},
                        'name': 'Bob',
                        'age': '32'
                    }
                ]
            }
        }
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        persons = root.findall('person')
        assert len(persons) == 2
        assert persons[0].get('id') == '1'
        assert persons[0].find('name').text == 'Alice'
    
    def test_empty_dict(self):
        """Test conversion of empty dictionary."""
        data = {}
        result = json_to_xml(data, 'root')
        assert '<root />' in result or '<root/>' in result
    
    def test_numeric_values(self):
        """Test conversion of numeric values."""
        data = {'number': 42, 'float': 3.14, 'bool': True}
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        assert root.find('number').text == '42'
        assert root.find('float').text == '3.14'
        assert root.find('bool').text == 'True'
    
    def test_unicode_content_in_json(self):
        """Test handling of Unicode in JSON data."""
        data = {'message': 'Hello 世界 🌍'}
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        assert root.find('message').text == 'Hello 世界 🌍'
    
    def test_special_characters_in_values(self):
        """Test handling of special XML characters in values."""
        data = {'content': '<tag> & "quotes"'}
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        assert root.find('content').text == '<tag> & "quotes"'
    
    def test_non_dict_input_raises_error(self):
        """Test that non-dictionary input raises ValueError."""
        with pytest.raises(ValueError, match="Data must be a dictionary"):
            json_to_xml("not a dict", 'root')
        
        with pytest.raises(ValueError, match="Data must be a dictionary"):
            json_to_xml(['list'], 'root')
    
    def test_custom_root_tag(self):
        """Test using custom root tag."""
        data = {'child': 'value'}
        result = json_to_xml(data, 'custom')
        root = ET.fromstring(result)
        assert root.tag == 'child'  # Single key becomes root
    
    def test_multiple_top_level_keys(self):
        """Test dictionary with multiple top-level keys."""
        data = {'key1': 'value1', 'key2': 'value2'}
        result = json_to_xml(data, 'root')
        root = ET.fromstring(result)
        assert root.tag == 'root'
        assert root.find('key1').text == 'value1'
        assert root.find('key2').text == 'value2'


class TestRoundTripConversion:
    """Tests for round-trip conversions (XML -> JSON -> XML)."""
    
    def test_simple_round_trip(self):
        """Test simple XML survives round-trip conversion."""
        original_xml = '<root><item>value</item></root>'
        json_data = xml_to_json(original_xml)
        xml_result = json_to_xml(json_data, 'root')
        
        # Parse both and compare structure
        original_root = ET.fromstring(original_xml)
        result_root = ET.fromstring(xml_result)
        
        assert original_root.tag == result_root.tag
        assert original_root.find('item').text == result_root.find('item').text
    
    def test_round_trip_with_attributes(self):
        """Test XML with attributes survives round-trip."""
        original_xml = '<root id="123"><item>value</item></root>'
        json_data = xml_to_json(original_xml)
        xml_result = json_to_xml(json_data, 'root')
        
        result_root = ET.fromstring(xml_result)
        assert result_root.get('id') == '123'
        assert result_root.find('item').text == 'value'
    
    def test_round_trip_complex_structure(self):
        """Test complex structure survives round-trip."""
        original_xml = '''<root>
            <person id="1">
                <name>Alice</name>
                <age>28</age>
            </person>
            <person id="2">
                <name>Bob</name>
                <age>32</age>
            </person>
        </root>'''
        
        json_data = xml_to_json(original_xml)
        xml_result = json_to_xml(json_data, 'root')
        
        result_root = ET.fromstring(xml_result)
        persons = result_root.findall('person')
        assert len(persons) == 2
        assert persons[0].get('id') == '1'
        assert persons[0].find('name').text == 'Alice'
        assert persons[1].get('id') == '2'
        assert persons[1].find('name').text == 'Bob'


class TestConvertFile:
    """Tests for convert_file function."""
    
    def test_xml_to_json_file_conversion(self):
        """Test converting XML file to JSON file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create input XML file
            xml_path = Path(tmpdir) / 'input.xml'
            xml_content = '<root><item>value</item></root>'
            xml_path.write_text(xml_content, encoding='utf-8')
            
            # Convert to JSON
            json_path = Path(tmpdir) / 'output.json'
            convert_file(str(xml_path), str(json_path))
            
            # Verify output
            assert json_path.exists()
            result = json.loads(json_path.read_text(encoding='utf-8'))
            assert result == {'root': {'item': 'value'}}
    
    def test_json_to_xml_file_conversion(self):
        """Test converting JSON file to XML file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create input JSON file
            json_path = Path(tmpdir) / 'input.json'
            json_content = {'root': {'item': 'value'}}
            json_path.write_text(json.dumps(json_content), encoding='utf-8')
            
            # Convert to XML
            xml_path = Path(tmpdir) / 'output.xml'
            convert_file(str(json_path), str(xml_path))
            
            # Verify output
            assert xml_path.exists()
            root = ET.fromstring(xml_path.read_text(encoding='utf-8'))
            assert root.tag == 'root'
            assert root.find('item').text == 'value'
    
    def test_convert_file_creates_output_directory(self):
        """Test that convert_file creates output directory if needed."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create input XML file
            xml_path = Path(tmpdir) / 'input.xml'
            xml_path.write_text('<root>test</root>', encoding='utf-8')
            
            # Convert to JSON in nested directory
            json_path = Path(tmpdir) / 'nested' / 'dir' / 'output.json'
            convert_file(str(xml_path), str(json_path))
            
            assert json_path.exists()
            assert json_path.parent.exists()
    
    def test_convert_file_with_complex_xml(self):
        """Test converting complex XML file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            xml_path = Path(tmpdir) / 'complex.xml'
            xml_content = '''<?xml version="1.0"?>
            <root>
                <person id="1">
                    <name>Alice</name>
                    <age>28</age>
                </person>
                <person id="2">
                    <name>Bob</name>
                    <age>32</age>
                </person>
            </root>'''
            xml_path.write_text(xml_content, encoding='utf-8')
            
            json_path = Path(tmpdir) / 'output.json'
            convert_file(str(xml_path), str(json_path))
            
            result = json.loads(json_path.read_text(encoding='utf-8'))
            assert 'root' in result
            assert 'person' in result['root']
            assert len(result['root']['person']) == 2
    
    def test_convert_file_nonexistent_input(self):
        """Test that nonexistent input file raises FileNotFoundError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            xml_path = Path(tmpdir) / 'nonexistent.xml'
            json_path = Path(tmpdir) / 'output.json'
            
            with pytest.raises(FileNotFoundError):
                convert_file(str(xml_path), str(json_path))
    
    def test_convert_file_invalid_xml(self):
        """Test that invalid XML content raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            xml_path = Path(tmpdir) / 'invalid.xml'
            xml_path.write_text('<root><unclosed>', encoding='utf-8')
            json_path = Path(tmpdir) / 'output.json'
            
            with pytest.raises(ValueError, match="Invalid XML"):
                convert_file(str(xml_path), str(json_path))
    
    def test_convert_file_invalid_json(self):
        """Test that invalid JSON content raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            json_path = Path(tmpdir) / 'invalid.json'
            json_path.write_text('{invalid json}', encoding='utf-8')
            xml_path = Path(tmpdir) / 'output.xml'
            
            with pytest.raises(ValueError, match="Invalid JSON"):
                convert_file(str(json_path), str(xml_path))
    
    def test_convert_file_unsupported_extension(self):
        """Test that unsupported file extension raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            txt_path = Path(tmpdir) / 'file.txt'
            txt_path.write_text('some content', encoding='utf-8')
            output_path = Path(tmpdir) / 'output.json'
            
            with pytest.raises(ValueError, match="Unsupported input file type"):
                convert_file(str(txt_path), str(output_path))
    
    def test_convert_file_directory_input(self):
        """Test that directory as input raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            dir_path = Path(tmpdir) / 'somedir'
            dir_path.mkdir()
            output_path = Path(tmpdir) / 'output.json'
            
            with pytest.raises(ValueError, match="not a file"):
                convert_file(str(dir_path), str(output_path))
    
    def test_convert_file_preserves_unicode(self):
        """Test that file conversion preserves Unicode characters."""
        with tempfile.TemporaryDirectory() as tmpdir:
            xml_path = Path(tmpdir) / 'unicode.xml'
            xml_content = '<root>Hello 世界 🌍</root>'
            xml_path.write_text(xml_content, encoding='utf-8')
            
            json_path = Path(tmpdir) / 'output.json'
            convert_file(str(xml_path), str(json_path))
            
            result = json.loads(json_path.read_text(encoding='utf-8'))
            assert result['root'] == 'Hello 世界 🌍'
    
    def test_json_file_non_dict_raises_error(self):
        """Test that JSON file with non-dict content raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            json_path = Path(tmpdir) / 'array.json'
            json_path.write_text('["array", "content"]', encoding='utf-8')
            xml_path = Path(tmpdir) / 'output.xml'
            
            with pytest.raises(ValueError, match="must contain an object"):
                convert_file(str(json_path), str(xml_path))


class TestEdgeCases:
    """Tests for edge cases and boundary conditions."""
    
    def test_deeply_nested_structure(self):
        """Test very deeply nested XML structure."""
        # Create 10 levels of nesting
        xml = '<l0><l1><l2><l3><l4><l5><l6><l7><l8><l9>deep</l9></l8></l7></l6></l5></l4></l3></l2></l1></l0>'
        result = xml_to_json(xml)
        
        # Navigate through the structure
        current = result['l0']
        for i in range(1, 10):
            current = current[f'l{i}']
        assert current == 'deep'
    
    def test_many_siblings(self):
        """Test element with many sibling children."""
        items = ''.join([f'<item>{i}</item>' for i in range(100)])
        xml = f'<root>{items}</root>'
        result = xml_to_json(xml)
        
        assert len(result['root']['item']) == 100
        assert result['root']['item'][0] == '0'
        assert result['root']['item'][99] == '99'
    
    def test_many_attributes(self):
        """Test element with many attributes."""
        attrs = ' '.join([f'attr{i}="value{i}"' for i in range(50)])
        xml = f'<root {attrs}>content</root>'
        result = xml_to_json(xml)
        
        assert len(result['root']['@attributes']) == 50
        assert result['root']['@attributes']['attr0'] == 'value0'
        assert result['root']['@attributes']['attr49'] == 'value49'
    
    def test_empty_string_values(self):
        """Test handling of empty string values."""
        xml = '<root><empty></empty><blank/></root>'
        result = xml_to_json(xml)
        assert result == {'root': {'empty': ['', '']}}
    
    def test_numeric_string_values(self):
        """Test that numeric strings are preserved as strings."""
        xml = '<root><number>123</number><float>45.67</float></root>'
        result = xml_to_json(xml)
        assert result == {'root': {'number': '123', 'float': '45.67'}}
        # Verify they are strings, not numbers
        assert isinstance(result['root']['number'], str)
        assert isinstance(result['root']['float'], str)
    
    def test_boolean_string_values(self):
        """Test that boolean strings are preserved as strings."""
        xml = '<root><bool1>true</bool1><bool2>false</bool2></root>'
        result = xml_to_json(xml)
        assert result == {'root': {'bool1': 'true', 'bool2': 'false'}}
        assert isinstance(result['root']['bool1'], str)
    
    def test_whitespace_preservation_in_text(self):
        """Test that significant whitespace in text is preserved."""
        xml = '<root>  spaces  around  </root>'
        result = xml_to_json(xml)
        # Leading/trailing whitespace is stripped, but internal is preserved
        assert 'spaces  around' in result['root']
    
    def test_cdata_sections(self):
        """Test handling of CDATA sections."""
        xml = '<root><![CDATA[<special>characters</special>]]></root>'
        result = xml_to_json(xml)
        assert '<special>characters</special>' in result['root']
    
    def test_xml_comments_ignored(self):
        """Test that XML comments are ignored."""
        xml = '<root><!-- comment --><item>value</item></root>'
        result = xml_to_json(xml)
        assert result == {'root': {'item': 'value'}}
    
    def test_processing_instructions_ignored(self):
        """Test that processing instructions are ignored."""
        xml = '<?xml version="1.0"?><?custom instruction?><root>test</root>'
        result = xml_to_json(xml)
        assert result == {'root': 'test'}


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
