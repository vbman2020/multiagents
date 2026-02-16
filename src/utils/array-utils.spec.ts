import { unique, flatten, chunk } from './array-utils';

describe('array-utils', () => {
  describe('unique', () => {
    it('should remove duplicate numbers', () => {
      expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should remove duplicate strings', () => {
      expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('should preserve order of first occurrence', () => {
      expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      expect(unique([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle array with all duplicates', () => {
      expect(unique([1, 1, 1, 1])).toEqual([1]);
    });

    it('should handle null input', () => {
      expect(unique(null)).toEqual([]);
    });

    it('should handle undefined input', () => {
      expect(unique(undefined)).toEqual([]);
    });

    it('should handle array with mixed types', () => {
      expect(unique([1, '1', 2, '2', 1, '1'])).toEqual([1, '1', 2, '2']);
    });

    it('should handle array with objects (reference equality)', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 }; // Different reference but same content
      expect(unique([obj1, obj2, obj1, obj3])).toEqual([obj1, obj2, obj3]);
    });

    it('should handle array with boolean values', () => {
      expect(unique([true, false, true, true, false])).toEqual([true, false]);
    });

    it('should handle array with null and undefined values', () => {
      expect(unique([1, null, 2, undefined, null, undefined, 1])).toEqual([1, null, 2, undefined]);
    });

    it('should handle single element array', () => {
      expect(unique([42])).toEqual([42]);
    });
  });

  describe('flatten', () => {
    it('should flatten single-level nested array', () => {
      expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
    });

    it('should flatten multi-level nested array', () => {
      expect(flatten([1, [2, [3, 4], 5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should flatten deeply nested array', () => {
      expect(flatten([1, [2, [3, [4, [5, [6]]]]]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle empty array', () => {
      expect(flatten([])).toEqual([]);
    });

    it('should handle array with empty nested arrays', () => {
      expect(flatten([1, [], [2, []], 3])).toEqual([1, 2, 3]);
    });

    it('should handle already flat array', () => {
      expect(flatten([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle null input', () => {
      expect(flatten(null)).toEqual([]);
    });

    it('should handle undefined input', () => {
      expect(flatten(undefined)).toEqual([]);
    });

    it('should handle array with string values', () => {
      expect(flatten(['a', ['b', 'c'], ['d', ['e']]])).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should handle array with mixed types', () => {
      expect(flatten([1, ['a', [true, null]], undefined])).toEqual([1, 'a', true, null, undefined]);
    });

    it('should handle array with objects', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      expect(flatten([obj1, [obj2, [{ id: 3 }]]])).toEqual([obj1, obj2, { id: 3 }]);
    });

    it('should handle single element nested array', () => {
      expect(flatten([[[[42]]]])).toEqual([42]);
    });

    it('should handle array with only nested empty arrays', () => {
      expect(flatten([[], [[]], [[[]]]])).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle array that divides evenly', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it('should handle chunk size equal to array length', () => {
      expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size larger than array length', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle null input', () => {
      expect(chunk(null, 2)).toEqual([]);
    });

    it('should handle undefined input', () => {
      expect(chunk(undefined, 2)).toEqual([]);
    });

    it('should throw error for invalid chunk size (zero)', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for invalid chunk size (negative)', () => {
      expect(() => chunk([1, 2, 3], -1)).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for invalid chunk size (float)', () => {
      expect(() => chunk([1, 2, 3], 1.5)).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for invalid chunk size (null)', () => {
      expect(() => chunk([1, 2, 3], null as any)).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for invalid chunk size (undefined)', () => {
      expect(() => chunk([1, 2, 3], undefined as any)).toThrow('Chunk size must be a positive integer');
    });

    it('should handle array with string values', () => {
      expect(chunk(['a', 'b', 'c', 'd', 'e'], 2)).toEqual([['a', 'b'], ['c', 'd'], ['e']]);
    });

    it('should handle array with objects', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      expect(chunk([obj1, obj2, obj3], 2)).toEqual([[obj1, obj2], [obj3]]);
    });

    it('should handle array with mixed types', () => {
      expect(chunk([1, 'a', true, null, undefined], 2)).toEqual([[1, 'a'], [true, null], [undefined]]);
    });

    it('should handle single element array', () => {
      expect(chunk([42], 3)).toEqual([[42]]);
    });

    it('should handle large chunk sizes with various remainders', () => {
      expect(chunk([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
      expect(chunk([1, 2, 3, 4, 5, 6, 7, 8], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8]]);
      expect(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    });
  });
});
