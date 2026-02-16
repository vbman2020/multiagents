/**
 * Array utility functions for common array operations
 */

/**
 * Returns an array with all duplicate elements removed, preserving the original order.
 * The first occurrence of each element is kept.
 * 
 * @param arr - The input array
 * @returns A new array with duplicates removed
 * 
 * @example
 * unique([1, 2, 2, 3, 1, 4]) // [1, 2, 3, 4]
 * unique([]) // []
 * unique(null) // []
 */
export function unique<T>(arr: T[] | null | undefined): T[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  
  return Array.from(new Set(arr));
}

/**
 * Recursively flattens a nested array structure into a single-level array.
 * Handles deeply nested arrays of any depth.
 * 
 * @param arr - The input array (can be nested)
 * @returns A flattened array
 * 
 * @example
 * flatten([1, [2, [3, 4], 5]]) // [1, 2, 3, 4, 5]
 * flatten([]) // []
 * flatten(null) // []
 */
export function flatten<T>(arr: any[] | null | undefined): T[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  
  const result: T[] = [];
  
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten<T>(item));
    } else {
      result.push(item as T);
    }
  }
  
  return result;
}

/**
 * Splits an array into chunks of the specified size.
 * If the array doesn't divide evenly, the last chunk will contain the remaining elements.
 * 
 * @param arr - The input array
 * @param size - The size of each chunk (must be positive integer)
 * @returns An array of chunks
 * 
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunk([1, 2, 3], 3) // [[1, 2, 3]]
 * chunk([], 2) // []
 */
export function chunk<T>(arr: T[] | null | undefined, size: number): T[][] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  
  if (!size || size < 1 || !Number.isInteger(size)) {
    throw new Error('Chunk size must be a positive integer');
  }
  
  if (arr.length === 0) {
    return [];
  }
  
  const result: T[][] = [];
  
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  
  return result;
}
