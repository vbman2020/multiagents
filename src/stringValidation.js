/**
 * String Validation Utility Module
 * 
 * Provides a set of validation functions for common string validation scenarios.
 * All functions return boolean values and handle null/undefined gracefully.
 */

/**
 * Validates if a string is a valid email format
 * @param {string} str - The string to validate
 * @returns {boolean} - True if valid email format, false otherwise
 */
function isEmail(str) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }
  
  // Empty string is not a valid email
  if (str.length === 0) {
    return false;
  }
  
  // Email regex pattern following standard email format
  // Pattern explanation:
  // - Local part: alphanumeric, dots, hyphens, underscores
  // - @ symbol required
  // - Domain: alphanumeric, dots, hyphens
  // - TLD: at least 2 characters
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailPattern.test(str);
}

/**
 * Validates if a string is a valid URL format
 * @param {string} str - The string to validate
 * @returns {boolean} - True if valid URL format, false otherwise
 */
function isURL(str) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }
  
  // Empty string is not a valid URL
  if (str.length === 0) {
    return false;
  }
  
  // URL regex pattern supporting common URL schemes
  // Supports: http, https, ftp, ftps
  const urlPattern = /^(https?|ftp|ftps):\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:[0-9]{1,5})?(\/.*)?$/;
  
  return urlPattern.test(str);
}

/**
 * Checks if a string contains only alphanumeric characters (letters and numbers)
 * @param {string} str - The string to validate
 * @returns {boolean} - True if string contains only letters and numbers, false otherwise
 */
function isAlphanumeric(str) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }
  
  // Empty string is not alphanumeric
  if (str.length === 0) {
    return false;
  }
  
  // Pattern to match only alphanumeric characters (a-z, A-Z, 0-9)
  const alphanumericPattern = /^[a-zA-Z0-9]+$/;
  
  return alphanumericPattern.test(str);
}

/**
 * Checks if a string meets minimum length requirement
 * @param {string} str - The string to validate
 * @param {number} min - The minimum length required
 * @returns {boolean} - True if string meets minimum length, false otherwise
 */
function minLength(str, min) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }
  
  // Handle invalid min parameter
  if (typeof min !== 'number' || min < 0) {
    return false;
  }
  
  // Check if string length is at least min
  return str.length >= min;
}

/**
 * Checks if a string does not exceed maximum length
 * @param {string} str - The string to validate
 * @param {number} max - The maximum length allowed
 * @returns {boolean} - True if string does not exceed maximum length, false otherwise
 */
function maxLength(str, max) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }
  
  // Handle invalid max parameter
  if (typeof max !== 'number' || max < 0) {
    return false;
  }
  
  // Check if string length is at most max
  return str.length <= max;
}

// Export all validation functions
module.exports = {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
};
