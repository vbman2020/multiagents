import { describe, it, expect } from 'vitest';
import { unique, flatten } from './arrays';

describe('unique', () => {
  it('should remove duplicate numbers from an array', () => {
    expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4]);
  });

  it('should remove duplicate strings from an array', () => {
    expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });

  it('should preserve the order of first occurrence', () => {
    expect(unique([3, 1, 2, 1, 3, 2])).toEqual([3, 1, 2]);
  });

  it('should handle an empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('should handle an array with no duplicates', () => {
    expect(unique([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it('should handle an array with all duplicates', () => {
    expect(unique([5, 5, 5, 5])).toEqual([5]);
  });

  it('should handle arrays with mixed types', () => {
    expect(unique([1, '1', 2, '2', 1, '1'])).toEqual([1, '1', 2, '2']);
  });

  it('should handle arrays with boolean values', () => {
    expect(unique([true, false, true, false])).toEqual([true, false]);
  });

  it('should handle arrays with null and undefined', () => {
    expect(unique([null, undefined, null, undefined, 1])).toEqual([null, undefined, 1]);
  });

  it('should handle single element array', () => {
    expect(unique([42])).toEqual([42]);
  });

  it('should not mutate the original array', () => {
    const original = [1, 2, 2, 3];
    const result = unique(original);
    expect(original).toEqual([1, 2, 2, 3]);
    expect(result).not.toBe(original);
  });
});

describe('flatten', () => {
  it('should flatten an array with nested arrays', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  });

  it('should flatten an array of arrays', () => {
    expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
  });

  it('should only flatten one level deep', () => {
    expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, [3, 4]]);
  });

  it('should handle an empty array', () => {
    expect(flatten([])).toEqual([]);
  });

  it('should handle an array with no nested arrays', () => {
    expect(flatten([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it('should handle an array with empty nested arrays', () => {
    expect(flatten([1, [], 2, [], 3])).toEqual([1, 2, 3]);
  });

  it('should handle an array of only nested arrays', () => {
    expect(flatten([[1], [2], [3]])).toEqual([1, 2, 3]);
  });

  it('should handle strings in nested arrays', () => {
    expect(flatten(['a', ['b', 'c'], 'd'])).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should handle mixed types', () => {
    expect(flatten([1, ['a', 2], true, [false]])).toEqual([1, 'a', 2, true, false]);
  });

  it('should preserve order', () => {
    expect(flatten([[3, 1], [2, 4]])).toEqual([3, 1, 2, 4]);
  });

  it('should handle deeply nested arrays (only flattening first level)', () => {
    expect(flatten([[1, [2, [3]]], [4, [5]]])).toEqual([1, [2, [3]], 4, [5]]);
  });

  it('should not mutate the original array', () => {
    const original = [1, [2, 3], 4];
    const result = flatten(original);
    expect(original).toEqual([1, [2, 3], 4]);
    expect(result).not.toBe(original);
  });

  it('should handle arrays with null and undefined', () => {
    expect(flatten([null, [undefined, 1], 2])).toEqual([null, undefined, 1, 2]);
  });
});
