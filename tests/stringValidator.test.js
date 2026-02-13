/**
 * Comprehensive unit tests for String Validation Utility Module
 */

const {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
} = require('../src/stringValidator');

describe('isEmail', () => {
  describe('valid email inputs', () => {
    test('should return true for standard email format', () => {
      expect(isEmail('user@example.com')).toBe(true);
    });

    test('should return true for email with subdomain', () => {
      expect(isEmail('user@mail.example.com')).toBe(true);
    });

    test('should return true for email with numbers', () => {
      expect(isEmail('user123@example.com')).toBe(true);
    });

    test('should return true for email with dots in local part', () => {
      expect(isEmail('first.last@example.com')).toBe(true);
    });

    test('should return true for email with plus sign', () => {
      expect(isEmail('user+tag@example.com')).toBe(true);
    });

    test('should return true for email with underscore', () => {
      expect(isEmail('user_name@example.com')).toBe(true);
    });

    test('should return true for email with hyphen in domain', () => {
      expect(isEmail('user@my-domain.com')).toBe(true);
    });

    test('should return true for email with percentage', () => {
      expect(isEmail('user%test@example.com')).toBe(true);
    });

    test('should return true for email with longer TLD', () => {
      expect(isEmail('user@example.museum')).toBe(true);
    });
  });

  describe('invalid email inputs', () => {
    test('should return false for email without @', () => {
      expect(isEmail('userexample.com')).toBe(false);
    });

    test('should return false for email without domain', () => {
      expect(isEmail('user@')).toBe(false);
    });

    test('should return false for email without local part', () => {
      expect(isEmail('@example.com')).toBe(false);
    });

    test('should return false for email without TLD', () => {
      expect(isEmail('user@example')).toBe(false);
    });

    test('should return false for email with spaces', () => {
      expect(isEmail('user name@example.com')).toBe(false);
    });

    test('should return false for email with multiple @', () => {
      expect(isEmail('user@@example.com')).toBe(false);
    });

    test('should return false for email with invalid characters', () => {
      expect(isEmail('user#name@example.com')).toBe(false);
    });

    test('should return false for email with single character TLD', () => {
      expect(isEmail('user@example.c')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should return false for empty string', () => {
      expect(isEmail('')).toBe(false);
    });

    test('should return false for whitespace only', () => {
      expect(isEmail('   ')).toBe(false);
    });

    test('should return false for null', () => {
      expect(isEmail(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isEmail(undefined)).toBe(false);
    });

    test('should return false for number', () => {
      expect(isEmail(123)).toBe(false);
    });

    test('should return false for object', () => {
      expect(isEmail({})).toBe(false);
    });

    test('should return false for array', () => {
      expect(isEmail([])).toBe(false);
    });

    test('should return false for boolean', () => {
      expect(isEmail(true)).toBe(false);
    });
  });
});

describe('isURL', () => {
  describe('valid URL inputs', () => {
    test('should return true for http URL', () => {
      expect(isURL('http://example.com')).toBe(true);
    });

    test('should return true for https URL', () => {
      expect(isURL('https://example.com')).toBe(true);
    });

    test('should return true for ftp URL', () => {
      expect(isURL('ftp://example.com')).toBe(true);
    });

    test('should return true for URL with path', () => {
      expect(isURL('https://example.com/path/to/resource')).toBe(true);
    });

    test('should return true for URL with query string', () => {
      expect(isURL('https://example.com?query=value')).toBe(true);
    });

    test('should return true for URL with port', () => {
      expect(isURL('https://example.com:8080')).toBe(true);
    });

    test('should return true for URL with fragment', () => {
      expect(isURL('https://example.com#section')).toBe(true);
    });

    test('should return true for URL with subdomain', () => {
      expect(isURL('https://sub.example.com')).toBe(true);
    });

    test('should return true for URL with IP address', () => {
      expect(isURL('http://192.168.1.1')).toBe(true);
    });

    test('should return true for URL with all components', () => {
      expect(isURL('https://user:pass@sub.example.com:8080/path?query=value#section')).toBe(true);
    });
  });

  describe('invalid URL inputs', () => {
    test('should return false for URL without protocol', () => {
      expect(isURL('example.com')).toBe(false);
    });

    test('should return false for URL with invalid protocol', () => {
      expect(isURL('htp://example.com')).toBe(false);
    });

    test('should return false for URL with spaces', () => {
      expect(isURL('http://example .com')).toBe(false);
    });

    test('should return false for malformed URL', () => {
      expect(isURL('http:/example.com')).toBe(false);
    });

    test('should return false for protocol only', () => {
      expect(isURL('http://')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should return false for empty string', () => {
      expect(isURL('')).toBe(false);
    });

    test('should return false for whitespace only', () => {
      expect(isURL('   ')).toBe(false);
    });

    test('should return false for null', () => {
      expect(isURL(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isURL(undefined)).toBe(false);
    });

    test('should return false for number', () => {
      expect(isURL(123)).toBe(false);
    });

    test('should return false for object', () => {
      expect(isURL({})).toBe(false);
    });

    test('should return false for array', () => {
      expect(isURL([])).toBe(false);
    });

    test('should return false for boolean', () => {
      expect(isURL(false)).toBe(false);
    });
  });
});

describe('isAlphanumeric', () => {
  describe('valid alphanumeric inputs', () => {
    test('should return true for string with only letters', () => {
      expect(isAlphanumeric('abcdef')).toBe(true);
    });

    test('should return true for string with only numbers', () => {
      expect(isAlphanumeric('123456')).toBe(true);
    });

    test('should return true for mixed letters and numbers', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
    });

    test('should return true for uppercase letters', () => {
      expect(isAlphanumeric('ABCDEF')).toBe(true);
    });

    test('should return true for mixed case letters and numbers', () => {
      expect(isAlphanumeric('AbC123XyZ')).toBe(true);
    });

    test('should return true for single character', () => {
      expect(isAlphanumeric('a')).toBe(true);
    });

    test('should return true for single digit', () => {
      expect(isAlphanumeric('5')).toBe(true);
    });
  });

  describe('invalid alphanumeric inputs', () => {
    test('should return false for string with spaces', () => {
      expect(isAlphanumeric('abc 123')).toBe(false);
    });

    test('should return false for string with special characters', () => {
      expect(isAlphanumeric('abc@123')).toBe(false);
    });

    test('should return false for string with hyphens', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
    });

    test('should return false for string with underscores', () => {
      expect(isAlphanumeric('abc_123')).toBe(false);
    });

    test('should return false for string with dots', () => {
      expect(isAlphanumeric('abc.123')).toBe(false);
    });

    test('should return false for string with punctuation', () => {
      expect(isAlphanumeric('abc!')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should return false for empty string', () => {
      expect(isAlphanumeric('')).toBe(false);
    });

    test('should return false for whitespace only', () => {
      expect(isAlphanumeric('   ')).toBe(false);
    });

    test('should return false for null', () => {
      expect(isAlphanumeric(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isAlphanumeric(undefined)).toBe(false);
    });

    test('should return false for number', () => {
      expect(isAlphanumeric(123)).toBe(false);
    });

    test('should return false for object', () => {
      expect(isAlphanumeric({})).toBe(false);
    });

    test('should return false for array', () => {
      expect(isAlphanumeric([])).toBe(false);
    });

    test('should return false for boolean', () => {
      expect(isAlphanumeric(true)).toBe(false);
    });
  });
});

describe('minLength', () => {
  describe('valid minimum length checks', () => {
    test('should return true when string length equals minimum', () => {
      expect(minLength('hello', 5)).toBe(true);
    });

    test('should return true when string length exceeds minimum', () => {
      expect(minLength('hello world', 5)).toBe(true);
    });

    test('should return true when minimum is 0 and string is not empty', () => {
      expect(minLength('test', 0)).toBe(true);
    });

    test('should return true when minimum is 0 and string is empty', () => {
      expect(minLength('', 0)).toBe(true);
    });

    test('should return true for single character with min 1', () => {
      expect(minLength('a', 1)).toBe(true);
    });

    test('should return true for long string with small minimum', () => {
      expect(minLength('this is a very long string', 5)).toBe(true);
    });
  });

  describe('invalid minimum length checks', () => {
    test('should return false when string length is less than minimum', () => {
      expect(minLength('hi', 5)).toBe(false);
    });

    test('should return false when string is empty and minimum is greater than 0', () => {
      expect(minLength('', 1)).toBe(false);
    });

    test('should return false when minimum is negative', () => {
      expect(minLength('test', -1)).toBe(false);
    });

    test('should return false when minimum is not a number', () => {
      expect(minLength('test', 'five')).toBe(false);
    });

    test('should return false when minimum is Infinity', () => {
      expect(minLength('test', Infinity)).toBe(false);
    });

    test('should return false when minimum is NaN', () => {
      expect(minLength('test', NaN)).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should return false for null string', () => {
      expect(minLength(null, 5)).toBe(false);
    });

    test('should return false for undefined string', () => {
      expect(minLength(undefined, 5)).toBe(false);
    });

    test('should return false for number instead of string', () => {
      expect(minLength(123, 5)).toBe(false);
    });

    test('should return false for object instead of string', () => {
      expect(minLength({}, 5)).toBe(false);
    });

    test('should return false for array instead of string', () => {
      expect(minLength([], 5)).toBe(false);
    });

    test('should return false for boolean instead of string', () => {
      expect(minLength(true, 5)).toBe(false);
    });

    test('should return false when both parameters are invalid', () => {
      expect(minLength(null, null)).toBe(false);
    });

    test('should return false when minimum parameter is missing', () => {
      expect(minLength('test', undefined)).toBe(false);
    });
  });
});

describe('maxLength', () => {
  describe('valid maximum length checks', () => {
    test('should return true when string length equals maximum', () => {
      expect(maxLength('hello', 5)).toBe(true);
    });

    test('should return true when string length is less than maximum', () => {
      expect(maxLength('hi', 5)).toBe(true);
    });

    test('should return true when string is empty and maximum is 0', () => {
      expect(maxLength('', 0)).toBe(true);
    });

    test('should return true when string is empty and maximum is greater than 0', () => {
      expect(maxLength('', 5)).toBe(true);
    });

    test('should return true for single character with max 1', () => {
      expect(maxLength('a', 1)).toBe(true);
    });

    test('should return true for short string with large maximum', () => {
      expect(maxLength('test', 100)).toBe(true);
    });
  });

  describe('invalid maximum length checks', () => {
    test('should return false when string length exceeds maximum', () => {
      expect(maxLength('hello world', 5)).toBe(false);
    });

    test('should return false when string is not empty and maximum is 0', () => {
      expect(maxLength('a', 0)).toBe(false);
    });

    test('should return false when maximum is negative', () => {
      expect(maxLength('test', -1)).toBe(false);
    });

    test('should return false when maximum is not a number', () => {
      expect(maxLength('test', 'five')).toBe(false);
    });

    test('should return false when maximum is Infinity', () => {
      expect(maxLength('test', Infinity)).toBe(false);
    });

    test('should return false when maximum is NaN', () => {
      expect(maxLength('test', NaN)).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should return false for null string', () => {
      expect(maxLength(null, 5)).toBe(false);
    });

    test('should return false for undefined string', () => {
      expect(maxLength(undefined, 5)).toBe(false);
    });

    test('should return false for number instead of string', () => {
      expect(maxLength(123, 5)).toBe(false);
    });

    test('should return false for object instead of string', () => {
      expect(maxLength({}, 5)).toBe(false);
    });

    test('should return false for array instead of string', () => {
      expect(maxLength([], 5)).toBe(false);
    });

    test('should return false for boolean instead of string', () => {
      expect(maxLength(false, 5)).toBe(false);
    });

    test('should return false when both parameters are invalid', () => {
      expect(maxLength(null, null)).toBe(false);
    });

    test('should return false when maximum parameter is missing', () => {
      expect(maxLength('test', undefined)).toBe(false);
    });
  });
});

describe('Integration tests', () => {
  test('should handle multiple validations on the same string', () => {
    const str = 'test123';
    expect(isAlphanumeric(str)).toBe(true);
    expect(minLength(str, 5)).toBe(true);
    expect(maxLength(str, 10)).toBe(true);
  });

  test('should validate email and check length constraints', () => {
    const email = 'user@example.com';
    expect(isEmail(email)).toBe(true);
    expect(minLength(email, 5)).toBe(true);
    expect(maxLength(email, 50)).toBe(true);
  });

  test('should validate URL and check length constraints', () => {
    const url = 'https://example.com';
    expect(isURL(url)).toBe(true);
    expect(minLength(url, 10)).toBe(true);
    expect(maxLength(url, 100)).toBe(true);
  });

  test('should consistently handle null across all functions', () => {
    expect(isEmail(null)).toBe(false);
    expect(isURL(null)).toBe(false);
    expect(isAlphanumeric(null)).toBe(false);
    expect(minLength(null, 5)).toBe(false);
    expect(maxLength(null, 5)).toBe(false);
  });

  test('should consistently handle undefined across all functions', () => {
    expect(isEmail(undefined)).toBe(false);
    expect(isURL(undefined)).toBe(false);
    expect(isAlphanumeric(undefined)).toBe(false);
    expect(minLength(undefined, 5)).toBe(false);
    expect(maxLength(undefined, 5)).toBe(false);
  });

  test('should consistently handle empty strings across all functions', () => {
    expect(isEmail('')).toBe(false);
    expect(isURL('')).toBe(false);
    expect(isAlphanumeric('')).toBe(false);
    expect(minLength('', 1)).toBe(false);
    expect(maxLength('', 0)).toBe(true); // Empty string has length 0
  });
});
