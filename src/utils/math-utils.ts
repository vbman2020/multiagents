/**
 * Math utility functions for common mathematical operations.
 */

/**
 * Constrains a value between minimum and maximum bounds.
 * 
 * @param value - The value to constrain
 * @param min - The minimum bound
 * @param max - The maximum bound
 * @returns The constrained value
 * 
 * @example
 * clamp(5, 0, 10)   // 5
 * clamp(-5, 0, 10)  // 0
 * clamp(15, 0, 10)  // 10
 */
export function clamp(value: number, min: number, max: number): number {
  // Handle NaN - if any input is NaN, return NaN
  if (Number.isNaN(value) || Number.isNaN(min) || Number.isNaN(max)) {
    return NaN;
  }

  // Handle invalid bounds (min > max)
  if (min > max) {
    throw new Error('Invalid bounds: min must be less than or equal to max');
  }

  // Handle Infinity cases
  if (value === -Infinity) return min;
  if (value === Infinity) return max;

  // Standard clamping logic
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Performs linear interpolation between two values.
 * 
 * @param a - The start value (when t=0)
 * @param b - The end value (when t=1)
 * @param t - The interpolation parameter (typically between 0 and 1)
 * @returns The interpolated value
 * 
 * @example
 * lerp(0, 10, 0)    // 0
 * lerp(0, 10, 1)    // 10
 * lerp(0, 10, 0.5)  // 5
 */
export function lerp(a: number, b: number, t: number): number {
  // Handle NaN - if any input is NaN, return NaN
  if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(t)) {
    return NaN;
  }

  // Handle Infinity cases
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    // If both are the same infinity, return that infinity
    if (a === b) return a;
    
    // If one is infinity and t is at the boundary, return the boundary value
    if (t === 0) return a;
    if (t === 1) return b;
    
    // Otherwise, interpolating between finite and infinite gives infinity
    if (!Number.isFinite(a)) return t > 0 ? (a > 0 ? Infinity : -Infinity) : a;
    if (!Number.isFinite(b)) return t < 1 ? (b > 0 ? Infinity : -Infinity) : b;
  }

  // Standard linear interpolation: a + (b - a) * t
  // Using this formula instead of a * (1 - t) + b * t for better numerical stability
  return a + (b - a) * t;
}

/**
 * Rounds a number to a specified number of decimal places.
 * 
 * @param value - The value to round
 * @param decimals - The number of decimal places (must be non-negative integer)
 * @returns The rounded value
 * 
 * @example
 * roundTo(3.14159, 2)   // 3.14
 * roundTo(3.14159, 0)   // 3
 * roundTo(2.5, 0)       // 3
 */
export function roundTo(value: number, decimals: number): number {
  // Handle NaN
  if (Number.isNaN(value) || Number.isNaN(decimals)) {
    return NaN;
  }

  // Handle Infinity
  if (!Number.isFinite(value)) {
    return value;
  }

  // Validate decimals parameter
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('decimals must be a non-negative integer');
  }

  // Handle very large decimal counts that would cause precision issues
  if (decimals > 15) {
    // JavaScript numbers have ~15-17 digits of precision
    return value;
  }

  // Use the shift-round-unshift method for precision
  const multiplier = Math.pow(10, decimals);
  
  // Handle potential overflow
  const shifted = value * multiplier;
  if (!Number.isFinite(shifted)) {
    return value;
  }

  return Math.round(shifted) / multiplier;
}
