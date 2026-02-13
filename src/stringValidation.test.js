/**
 * Comprehensive unit tests for String Validation Utility Module
 * 
 * Tests cover:
 * - Valid inputs for all functions
 * - Invalid inputs for all functions
 * - Edge cases including empty strings
 * - Null and undefined values
 */

const {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
} = require('./stringValidation');

describe('String Validation Module', () => {
  
  // ========================================
  // isEmail() Tests
  // ========================================
  describe('isEmail()', () => {
    
    describe('Valid Inputs', () => {
      test('should return true for valid simple email', () => {
        expect(isEmail('user@example.com')).toBe(true);
      });
      
      test('should return true for email with subdomain', () => {
        expect(isEmail('user@mail.example.com')).toBe(true);
      });
      
      test('should return true for email with dots in local part', () => {
        expect(isEmail('first.last@example.com')).toBe(true);
      });
      
      test('should return true for email with hyphens', () => {
        expect(isEmail('user-name@example-domain.com')).toBe(true);
      });
      
      test('should return true for email with underscores', () => {
        expect(isEmail('user_name@example.com')).toBe(true);
      });
      
      test('should return true for email with numbers', () => {
        expect(isEmail('user123@example456.com')).toBe(true);
      });
      
      test('should return true for email with longer TLD', () => {
        expect(isEmail('user@example.travel')).toBe(true);
      });
    });
    
    describe('Invalid Inputs', () => {
      test('should return false for string without @ symbol', () => {
        expect(isEmail('userexample.com')).toBe(false);
      });
      
      test('should return false for string without domain', () => {
        expect(isEmail('user@')).toBe(false);
      });
      
      test('should return false for string without local part', () => {
        expect(isEmail('@example.com')).toBe(false);
      });
      
      test('should return false for string without TLD', () => {
        expect(isEmail('user@example')).toBe(false);
      });
      
      test('should return false for string with spaces', () => {
        expect(isEmail('user name@example.com')).toBe(false);
      });
      
      test('should return false for string with multiple @ symbols', () => {
        expect(isEmail('user@@example.com')).toBe(false);
      });
      
      test('should return false for string with invalid characters', () => {
        expect(isEmail('user!#$%@example.com')).toBe(false);
      });
      
      test('should return false for string with single character TLD', () => {
        expect(isEmail('user@example.c')).toBe(false);
      });
    });
    
    describe('Edge Cases', () => {
      test('should return false for empty string', () => {
        expect(isEmail('')).toBe(false);
      });
      
      test('should return false for null', () => {
        expect(isEmail(null)).toBe(false);
      });
      
      test('should return false for undefined', () => {
        expect(isEmail(undefined)).toBe(false);
      });
      
      test('should return false for non-string number', () => {
        expect(isEmail(123)).toBe(false);
      });
      
      test('should return false for non-string object', () => {
        expect(isEmail({})).toBe(false);
      });
      
      test('should return false for non-string array', () => {
        expect(isEmail([])).toBe(false);
      });
      
      test('should return false for boolean', () => {
        expect(isEmail(true)).toBe(false);
      });
    });
  });
  
  // ========================================
  // isURL() Tests
  // ========================================
  describe('isURL()', () => {
    
    describe('Valid Inputs', () => {
      test('should return true for valid HTTP URL', () => {
        expect(isURL('http://example.com')).toBe(true);
      });
      
      test('should return true for valid HTTPS URL', () => {
        expect(isURL('https://example.com')).toBe(true);
      });
      
      test('should return true for URL with www', () => {
        expect(isURL('https://www.example.com')).toBe(true);
      });
      
      test('should return true for URL with subdomain', () => {
        expect(isURL('https://api.example.com')).toBe(true);
      });
      
      test('should return true for URL with path', () => {
        expect(isURL('https://example.com/path/to/resource')).toBe(true);
      });
      
      test('should return true for URL with port', () => {
        expect(isURL('https://example.com:8080')).toBe(true);
      });
      
      test('should return true for URL with port and path', () => {
        expect(isURL('https://example.com:8080/api/v1')).toBe(true);
      });
      
      test('should return true for FTP URL', () => {
        expect(isURL('ftp://files.example.com')).toBe(true);
      });
      
      test('should return true for FTPS URL', () => {
        expect(isURL('ftps://secure.example.com')).toBe(true);
      });
      
      test('should return true for URL with query parameters', () => {
        expect(isURL('https://example.com/search?q=test')).toBe(true);
      });
      
      test('should return true for URL with hash', () => {
        expect(isURL('https://example.com/page#section')).toBe(true);
      });
    });
    
    describe('Invalid Inputs', () => {
      test('should return false for string without protocol', () => {
        expect(isURL('example.com')).toBe(false);
      });
      
      test('should return false for string with invalid protocol', () => {
        expect(isURL('htp://example.com')).toBe(false);
      });
      
      test('should return false for string without domain', () => {
        expect(isURL('https://')).toBe(false);
      });
      
      test('should return false for string with spaces', () => {
        expect(isURL('https://example .com')).toBe(false);
      });
      
      test('should return false for incomplete URL', () => {
        expect(isURL('https://example')).toBe(false);
      });
      
      test('should return false for URL with only protocol', () => {
        expect(isURL('https://')).toBe(false);
      });
    });
    
    describe('Edge Cases', () => {
      test('should return false for empty string', () => {
        expect(isURL('')).toBe(false);
      });
      
      test('should return false for null', () => {
        expect(isURL(null)).toBe(false);
      });
      
      test('should return false for undefined', () => {
        expect(isURL(undefined)).toBe(false);
      });
      
      test('should return false for non-string number', () => {
        expect(isURL(123)).toBe(false);
      });
      
      test('should return false for non-string object', () => {
        expect(isURL({})).toBe(false);
      });
      
      test('should return false for non-string array', () => {
        expect(isURL([])).toBe(false);
      });
      
      test('should return false for boolean', () => {
        expect(isURL(false)).toBe(false);
      });
    });
  });
  
  // ========================================
  // isAlphanumeric() Tests
  // ========================================
  describe('isAlphanumeric()', () => {
    
    describe('Valid Inputs', () => {
      test('should return true for string with only letters', () => {
        expect(isAlphanumeric('abcdefg')).toBe(true);
      });
      
      test('should return true for string with only uppercase letters', () => {
        expect(isAlphanumeric('ABCDEFG')).toBe(true);
      });
      
      test('should return true for string with mixed case letters', () => {
        expect(isAlphanumeric('AbCdEfG')).toBe(true);
      });
      
      test('should return true for string with only numbers', () => {
        expect(isAlphanumeric('1234567')).toBe(true);
      });
      
      test('should return true for string with letters and numbers', () => {
        expect(isAlphanumeric('abc123')).toBe(true);
      });
      
      test('should return true for string with mixed case and numbers', () => {
        expect(isAlphanumeric('Test123')).toBe(true);
      });
      
      test('should return true for long alphanumeric string', () => {
        expect(isAlphanumeric('abcdefghijklmnopqrstuvwxyz0123456789')).toBe(true);
      });
    });
    
    describe('Invalid Inputs', () => {
      test('should return false for string with spaces', () => {
        expect(isAlphanumeric('abc 123')).toBe(false);
      });
      
      test('should return false for string with special characters', () => {
        expect(isAlphanumeric('abc!123')).toBe(false);
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
      
      test('should return false for string with @ symbol', () => {
        expect(isAlphanumeric('user@123')).toBe(false);
      });
      
      test('should return false for string with newline', () => {
        expect(isAlphanumeric('abc\n123')).toBe(false);
      });
    });
    
    describe('Edge Cases', () => {
      test('should return false for empty string', () => {
        expect(isAlphanumeric('')).toBe(false);
      });
      
      test('should return false for null', () => {
        expect(isAlphanumeric(null)).toBe(false);
      });
      
      test('should return false for undefined', () => {
        expect(isAlphanumeric(undefined)).toBe(false);
      });
      
      test('should return false for non-string number', () => {
        expect(isAlphanumeric(123)).toBe(false);
      });
      
      test('should return false for non-string object', () => {
        expect(isAlphanumeric({})).toBe(false);
      });
      
      test('should return false for non-string array', () => {
        expect(isAlphanumeric([])).toBe(false);
      });
      
      test('should return false for boolean', () => {
        expect(isAlphanumeric(true)).toBe(false);
      });
    });
  });
  
  // ========================================
  // minLength() Tests
  // ========================================
  describe('minLength()', () => {
    
    describe('Valid Inputs', () => {
      test('should return true when string meets exact minimum length', () => {
        expect(minLength('abc', 3)).toBe(true);
      });
      
      test('should return true when string exceeds minimum length', () => {
        expect(minLength('abcdef', 3)).toBe(true);
      });
      
      test('should return true for empty string with min 0', () => {
        expect(minLength('', 0)).toBe(true);
      });
      
      test('should return true for string longer than min', () => {
        expect(minLength('hello world', 5)).toBe(true);
      });
      
      test('should return true for single character with min 1', () => {
        expect(minLength('a', 1)).toBe(true);
      });
      
      test('should return true for long string with small min', () => {
        expect(minLength('this is a very long string', 1)).toBe(true);
      });
    });
    
    describe('Invalid Inputs', () => {
      test('should return false when string is shorter than minimum', () => {
        expect(minLength('ab', 3)).toBe(false);
      });
      
      test('should return false for empty string with min 1', () => {
        expect(minLength('', 1)).toBe(false);
      });
      
      test('should return false when string is much shorter than minimum', () => {
        expect(minLength('a', 10)).toBe(false);
      });
      
      test('should return false for invalid min parameter (negative)', () => {
        expect(minLength('abc', -1)).toBe(false);
      });
      
      test('should return false for invalid min parameter (non-number)', () => {
        expect(minLength('abc', '3')).toBe(false);
      });
      
      test('should return false for invalid min parameter (null)', () => {
        expect(minLength('abc', null)).toBe(false);
      });
      
      test('should return false for invalid min parameter (undefined)', () => {
        expect(minLength('abc', undefined)).toBe(false);
      });
    });
    
    describe('Edge Cases', () => {
      test('should return false for null string', () => {
        expect(minLength(null, 3)).toBe(false);
      });
      
      test('should return false for undefined string', () => {
        expect(minLength(undefined, 3)).toBe(false);
      });
      
      test('should return false for non-string number', () => {
        expect(minLength(123, 3)).toBe(false);
      });
      
      test('should return false for non-string object', () => {
        expect(minLength({}, 3)).toBe(false);
      });
      
      test('should return false for non-string array', () => {
        expect(minLength([], 3)).toBe(false);
      });
      
      test('should return false for boolean', () => {
        expect(minLength(true, 3)).toBe(false);
      });
      
      test('should handle min of 0 correctly', () => {
        expect(minLength('any string', 0)).toBe(true);
      });
      
      test('should return false for null string and min 0', () => {
        expect(minLength(null, 0)).toBe(false);
      });
    });
  });
  
  // ========================================
  // maxLength() Tests
  // ========================================
  describe('maxLength()', () => {
    
    describe('Valid Inputs', () => {
      test('should return true when string is at exact maximum length', () => {
        expect(maxLength('abc', 3)).toBe(true);
      });
      
      test('should return true when string is shorter than maximum', () => {
        expect(maxLength('abc', 5)).toBe(true);
      });
      
      test('should return true for empty string with max 0', () => {
        expect(maxLength('', 0)).toBe(true);
      });
      
      test('should return true for empty string with positive max', () => {
        expect(maxLength('', 10)).toBe(true);
      });
      
      test('should return true for single character with max 1', () => {
        expect(maxLength('a', 1)).toBe(true);
      });
      
      test('should return true for short string with large max', () => {
        expect(maxLength('hello', 100)).toBe(true);
      });
    });
    
    describe('Invalid Inputs', () => {
      test('should return false when string exceeds maximum length', () => {
        expect(maxLength('abcd', 3)).toBe(false);
      });
      
      test('should return false for non-empty string with max 0', () => {
        expect(maxLength('a', 0)).toBe(false);
      });
      
      test('should return false when string is much longer than maximum', () => {
        expect(maxLength('hello world', 5)).toBe(false);
      });
      
      test('should return false for invalid max parameter (negative)', () => {
        expect(maxLength('abc', -1)).toBe(false);
      });
      
      test('should return false for invalid max parameter (non-number)', () => {
        expect(maxLength('abc', '3')).toBe(false);
      });
      
      test('should return false for invalid max parameter (null)', () => {
        expect(maxLength('abc', null)).toBe(false);
      });
      
      test('should return false for invalid max parameter (undefined)', () => {
        expect(maxLength('abc', undefined)).toBe(false);
      });
    });
    
    describe('Edge Cases', () => {
      test('should return false for null string', () => {
        expect(maxLength(null, 3)).toBe(false);
      });
      
      test('should return false for undefined string', () => {
        expect(maxLength(undefined, 3)).toBe(false);
      });
      
      test('should return false for non-string number', () => {
        expect(maxLength(123, 3)).toBe(false);
      });
      
      test('should return false for non-string object', () => {
        expect(maxLength({}, 3)).toBe(false);
      });
      
      test('should return false for non-string array', () => {
        expect(maxLength([], 3)).toBe(false);
      });
      
      test('should return false for boolean', () => {
        expect(maxLength(false, 3)).toBe(false);
      });
      
      test('should handle max of 0 correctly', () => {
        expect(maxLength('', 0)).toBe(true);
      });
      
      test('should return false for null string and max 0', () => {
        expect(maxLength(null, 0)).toBe(false);
      });
    });
  });
  
  // ========================================
  // Integration Tests
  // ========================================
  describe('Integration Tests', () => {
    test('all functions should work together', () => {
      const email = 'user@example.com';
      expect(isEmail(email)).toBe(true);
      expect(minLength(email, 5)).toBe(true);
      expect(maxLength(email, 50)).toBe(true);
      
      const url = 'https://example.com';
      expect(isURL(url)).toBe(true);
      expect(minLength(url, 10)).toBe(true);
      
      const alphanumeric = 'abc123';
      expect(isAlphanumeric(alphanumeric)).toBe(true);
      expect(minLength(alphanumeric, 3)).toBe(true);
      expect(maxLength(alphanumeric, 10)).toBe(true);
    });
    
    test('all functions should handle null consistently', () => {
      expect(isEmail(null)).toBe(false);
      expect(isURL(null)).toBe(false);
      expect(isAlphanumeric(null)).toBe(false);
      expect(minLength(null, 1)).toBe(false);
      expect(maxLength(null, 10)).toBe(false);
    });
    
    test('all functions should handle undefined consistently', () => {
      expect(isEmail(undefined)).toBe(false);
      expect(isURL(undefined)).toBe(false);
      expect(isAlphanumeric(undefined)).toBe(false);
      expect(minLength(undefined, 1)).toBe(false);
      expect(maxLength(undefined, 10)).toBe(false);
    });
    
    test('all functions should handle empty strings consistently', () => {
      expect(isEmail('')).toBe(false);
      expect(isURL('')).toBe(false);
      expect(isAlphanumeric('')).toBe(false);
      expect(minLength('', 1)).toBe(false);
      expect(minLength('', 0)).toBe(true);
      expect(maxLength('', 0)).toBe(true);
      expect(maxLength('', 1)).toBe(true);
    });
  });
});
