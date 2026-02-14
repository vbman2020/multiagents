import { capitalize, truncate, slugify } from '../src/utils/string-utils';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a single word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should capitalize the first letter of each word', () => {
      expect(capitalize('hello world')).toBe('Hello World');
    });

    it('should handle multiple words', () => {
      expect(capitalize('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should lowercase other letters in each word', () => {
      expect(capitalize('hELLO wORLD')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle null input', () => {
      expect(capitalize(null)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(capitalize(undefined)).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle string with multiple spaces', () => {
      expect(capitalize('hello  world')).toBe('Hello  World');
    });

    it('should handle string with leading/trailing spaces', () => {
      expect(capitalize(' hello world ')).toBe(' Hello World ');
    });

    it('should handle string with numbers', () => {
      expect(capitalize('hello 123 world')).toBe('Hello 123 World');
    });

    it('should handle string with special characters', () => {
      expect(capitalize('hello-world')).toBe('Hello-world');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello World')).toBe('Hello World');
    });

    it('should handle all uppercase string', () => {
      expect(capitalize('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('truncate', () => {
    it('should truncate string longer than maxLen', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate string shorter than maxLen', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should not truncate string equal to maxLen', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });

    it('should handle null input', () => {
      expect(truncate(null, 5)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(truncate(undefined, 5)).toBe('');
    });

    it('should handle maxLen of 0', () => {
      expect(truncate('Hello', 0)).toBe('');
    });

    it('should handle negative maxLen', () => {
      expect(truncate('Hello', -1)).toBe('');
    });

    it('should truncate with maxLen of 1', () => {
      expect(truncate('Hello', 1)).toBe('H');
    });

    it('should truncate with maxLen of 2', () => {
      expect(truncate('Hello', 2)).toBe('He');
    });

    it('should truncate with maxLen of 3', () => {
      expect(truncate('Hello', 3)).toBe('...');
    });

    it('should truncate with maxLen of 4', () => {
      expect(truncate('Hello', 4)).toBe('H...');
    });

    it('should handle long string', () => {
      const longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
      expect(truncate(longString, 20)).toBe('Lorem ipsum dolor...');
    });

    it('should handle string with exact length', () => {
      expect(truncate('12345', 5)).toBe('12345');
    });

    it('should handle string one character longer', () => {
      expect(truncate('123456', 5)).toBe('12...');
    });

    it('should preserve content when not truncating', () => {
      const text = 'Short text';
      expect(truncate(text, 100)).toBe(text);
    });
  });

  describe('slugify', () => {
    it('should convert string to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    it('should replace multiple spaces with single hyphen', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });

    it('should replace special characters with hyphens', () => {
      expect(slugify('hello!@#$%world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle null input', () => {
      expect(slugify(null)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(slugify(undefined)).toBe('');
    });

    it('should remove leading hyphens', () => {
      expect(slugify('---hello')).toBe('hello');
    });

    it('should remove trailing hyphens', () => {
      expect(slugify('hello---')).toBe('hello');
    });

    it('should remove leading and trailing spaces', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });

    it('should handle string with numbers', () => {
      expect(slugify('hello 123 world')).toBe('hello-123-world');
    });

    it('should replace multiple consecutive hyphens with single hyphen', () => {
      expect(slugify('hello---world')).toBe('hello-world');
    });

    it('should handle already slugified string', () => {
      expect(slugify('hello-world')).toBe('hello-world');
    });

    it('should handle complex string', () => {
      expect(slugify('Hello, World! This is a Test.')).toBe('hello-world-this-is-a-test');
    });

    it('should handle string with parentheses', () => {
      expect(slugify('Hello (World)')).toBe('hello-world');
    });

    it('should handle string with brackets', () => {
      expect(slugify('Hello [World]')).toBe('hello-world');
    });

    it('should handle string with underscores', () => {
      expect(slugify('hello_world')).toBe('hello-world');
    });

    it('should handle string with apostrophes', () => {
      expect(slugify("it's a test")).toBe('it-s-a-test');
    });

    it('should handle string with ampersands', () => {
      expect(slugify('cats & dogs')).toBe('cats-dogs');
    });

    it('should handle string with forward slashes', () => {
      expect(slugify('hello/world')).toBe('hello-world');
    });

    it('should handle URL-like string', () => {
      expect(slugify('https://example.com')).toBe('https-example-com');
    });

    it('should handle mixed case with special characters', () => {
      expect(slugify('TypeScript & Node.js!')).toBe('typescript-node-js');
    });

    it('should handle string with only special characters', () => {
      expect(slugify('!@#$%^&*()')).toBe('');
    });
  });
});
