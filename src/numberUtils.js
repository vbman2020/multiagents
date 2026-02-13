/**
 * Number utility functions
 */

/**
 * Restricts a number to be within a specified range
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} The clamped value
 */
export function clamp(value, min, max) {
  // Handle edge cases
  if (value == null || typeof value !== 'number' || isNaN(value)) {
    return NaN;
  }
  if (min == null || typeof min !== 'number' || isNaN(min)) {
    return NaN;
  }
  if (max == null || typeof max !== 'number' || isNaN(max)) {
    return NaN;
  }
  
  // Ensure min is not greater than max
  if (min > max) {
    return NaN;
  }
  
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a specified number of decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - The number of decimal places
 * @returns {number} The rounded value
 */
export function roundTo(value, decimals) {
  // Handle edge cases
  if (value == null || typeof value !== 'number' || isNaN(value)) {
    return NaN;
  }
  if (decimals == null || typeof decimals !== 'number' || isNaN(decimals)) {
    return NaN;
  }
  
  // Ensure decimals is non-negative
  if (decimals < 0) {
    return NaN;
  }
  
  // Round decimals to integer
  decimals = Math.floor(decimals);
  
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Checks if a number is even
 * @param {number} n - The number to check
 * @returns {boolean} True if the number is even, false otherwise
 */
export function isEven(n) {
  // Handle edge cases
  if (n == null || typeof n !== 'number' || isNaN(n)) {
    return false;
  }
  
  // For non-integers, return false
  if (!Number.isInteger(n)) {
    return false;
  }
  
  return n % 2 === 0;
}

/**
 * Checks if a number is odd
 * @param {number} n - The number to check
 * @returns {boolean} True if the number is odd, false otherwise
 */
export function isOdd(n) {
  // Handle edge cases
  if (n == null || typeof n !== 'number' || isNaN(n)) {
    return false;
  }
  
  // For non-integers, return false
  if (!Number.isInteger(n)) {
    return false;
  }
  
  return n % 2 !== 0;
}

/**
 * Calculates the sum of an array of numbers
 * @param {number[]} numbers - The array of numbers
 * @returns {number} The sum of all numbers
 */
export function sum(numbers) {
  // Handle edge cases
  if (numbers == null || !Array.isArray(numbers)) {
    return NaN;
  }
  
  // Handle empty array
  if (numbers.length === 0) {
    return 0;
  }
  
  // Calculate sum, validating each number
  let total = 0;
  for (const num of numbers) {
    if (num == null || typeof num !== 'number' || isNaN(num)) {
      return NaN;
    }
    total += num;
  }
  
  return total;
}

/**
 * Calculates the average (mean) of an array of numbers
 * @param {number[]} numbers - The array of numbers
 * @returns {number} The average of all numbers
 */
export function average(numbers) {
  // Handle edge cases
  if (numbers == null || !Array.isArray(numbers)) {
    return NaN;
  }
  
  // Handle empty array
  if (numbers.length === 0) {
    return NaN;
  }
  
  const total = sum(numbers);
  
  // If sum returned NaN, propagate it
  if (isNaN(total)) {
    return NaN;
  }
  
  return total / numbers.length;
}
