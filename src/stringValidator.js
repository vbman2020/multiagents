/**
 * String Validation Utility Module
 * Provides various validation functions for strings
 */

/**
 * Validates if a string is a valid email address
 * Follows RFC 5322 practical format conventions
 * @param {string} str - The string to validate
 * @returns {boolean} - True if valid email, false otherwise
 */
function isEmail(str) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }

  // Handle empty string
  if (str.trim() === '') {
    return false;
  }

  // Email regex pattern following practical RFC 5322 format
  // Pattern: local-part@domain
  // Local part: alphanumeric and special chars (._%+-)
  // Domain: alphanumeric with dots, ending with 2+ letter TLD
  const emailPattern = /^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailPattern.test(str);
}

/**
 * Validates if a string is a valid URL
 * Supports common URL schemes (http, https, ftp, etc.)
 * @param {string} str - The string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
function isURL(str) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }

  // Handle empty string
  if (str.trim() === '') {
    return false;
  }

  // URL regex pattern supporting common schemes
  // Supports: http, https, ftp, ftps, file, and more
  const urlPattern = /^(https?|ftp|ftps|file):\/\/[^\s/$.?#].[^\s]*$/i;
  
  // Additional validation using URL constructor for more robust checking
  try {
    const url = new URL(str);
    // Ensure the URL has a valid protocol
    return urlPattern.test(str) && url.protocol.length > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Checks if a string contains only letters and numbers (alphanumeric)
 * @param {string} str - The string to validate
 * @returns {boolean} - True if alphanumeric only, false otherwise
 */
function isAlphanumeric(str) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }

  // Empty string is not considered alphanumeric
  if (str === '') {
    return false;
  }

  // Pattern to match only letters (a-z, A-Z) and numbers (0-9)
  const alphanumericPattern = /^[a-zA-Z0-9]+$/;
  
  return alphanumericPattern.test(str);
}

/**
 * Checks if a string meets the minimum length requirement
 * @param {string} str - The string to validate
 * @param {number} min - The minimum length required
 * @returns {boolean} - True if length >= min, false otherwise
 */
function minLength(str, min) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }

  // Handle invalid min parameter
  if (typeof min !== 'number' || min < 0 || !Number.isFinite(min)) {
    return false;
  }

  return str.length >= min;
}

/**
 * Checks if a string meets the maximum length requirement
 * @param {string} str - The string to validate
 * @param {number} max - The maximum length allowed
 * @returns {boolean} - True if length <= max, false otherwise
 */
function maxLength(str, max) {
  // Handle null, undefined, and non-string values
  if (str == null || typeof str !== 'string') {
    return false;
  }

  // Handle invalid max parameter
  if (typeof max !== 'number' || max < 0 || !Number.isFinite(max)) {
    return false;
  }

  return str.length <= max;
}

module.exports = {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
};
