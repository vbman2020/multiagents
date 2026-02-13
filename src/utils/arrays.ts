/**
 * Removes duplicate values from an array while preserving the original order.
 * The first occurrence of each value is kept.
 * 
 * @param arr - The input array with potential duplicates
 * @returns A new array with duplicates removed, maintaining original order
 * 
 * @example
 * ```typescript
 * unique([1, 2, 2, 3, 1, 4]) // [1, 2, 3, 4]
 * unique(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];
  
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  
  return result;
}

/**
 * Flattens nested arrays to a single level.
 * Only flattens one level deep - nested arrays within nested arrays remain nested.
 * 
 * @param arr - The input array that may contain nested arrays
 * @returns A new array flattened to a single level
 * 
 * @example
 * ```typescript
 * flatten([1, [2, 3], 4]) // [1, 2, 3, 4]
 * flatten([[1, 2], [3, 4]]) // [1, 2, 3, 4]
 * flatten([1, [2, [3, 4]]]) // [1, 2, [3, 4]]
 * ```
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  const result: T[] = [];
  
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
  }
  
  return result;
}
