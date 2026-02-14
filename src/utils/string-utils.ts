/**
 * String utility functions for common string manipulations
 */

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The input string to capitalize
 * @returns The string with the first letter of each word capitalized
 */
export function capitalize(str: string | null | undefined): string {
  // Handle edge cases
  if (str === null || str === undefined) {
    return '';
  }
  
  if (typeof str !== 'string') {
    return '';
  }
  
  if (str.length === 0) {
    return '';
  }
  
  // Split by spaces, capitalize first letter of each word, then join back
  return str
    .split(' ')
    .map(word => {
      if (word.length === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Truncates a string to a maximum length and appends ellipsis if truncated
 * @param str - The input string to truncate
 * @param maxLen - The maximum length before truncation
 * @returns The truncated string with ellipsis if it exceeded maxLen
 */
export function truncate(str: string | null | undefined, maxLen: number): string {
  // Handle edge cases
  if (str === null || str === undefined) {
    return '';
  }
  
  if (typeof str !== 'string') {
    return '';
  }
  
  if (str.length === 0) {
    return '';
  }
  
  // Handle invalid maxLen
  if (maxLen < 0) {
    return '';
  }
  
  if (maxLen === 0) {
    return '';
  }
  
  // If string is shorter than or equal to maxLen, return as is
  if (str.length <= maxLen) {
    return str;
  }
  
  // Truncate and add ellipsis
  // If maxLen is less than 3, just return truncated string without ellipsis
  if (maxLen < 3) {
    return str.slice(0, maxLen);
  }
  
  return str.slice(0, maxLen - 3) + '...';
}

/**
 * Converts a string to a URL-friendly slug
 * @param str - The input string to slugify
 * @returns A lowercase string with spaces and special characters replaced by hyphens
 */
export function slugify(str: string | null | undefined): string {
  // Handle edge cases
  if (str === null || str === undefined) {
    return '';
  }
  
  if (typeof str !== 'string') {
    return '';
  }
  
  if (str.length === 0) {
    return '';
  }
  
  return str
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace special characters with hyphens
    .replace(/[^a-z0-9-]/g, '-')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}
