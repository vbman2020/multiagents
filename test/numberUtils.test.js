import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, roundTo, isEven, isOdd, sum, average } from '../src/numberUtils.js';

describe('numberUtils', () => {
  describe('clamp', () => {
    it('should return value when within range', () => {
      assert.strictEqual(clamp(5, 0, 10), 5);
      assert.strictEqual(clamp(0, 0, 10), 0);
      assert.strictEqual(clamp(10, 0, 10), 10);
    });

    it('should clamp to min when value is below range', () => {
      assert.strictEqual(clamp(-5, 0, 10), 0);
      assert.strictEqual(clamp(-100, -50, 50), -50);
    });

    it('should clamp to max when value is above range', () => {
      assert.strictEqual(clamp(15, 0, 10), 10);
      assert.strictEqual(clamp(100, -50, 50), 50);
    });

    it('should handle negative ranges', () => {
      assert.strictEqual(clamp(-5, -10, -1), -5);
      assert.strictEqual(clamp(-15, -10, -1), -10);
      assert.strictEqual(clamp(0, -10, -1), -1);
    });

    it('should handle decimal values', () => {
      assert.strictEqual(clamp(5.5, 0, 10), 5.5);
      assert.strictEqual(clamp(10.5, 0, 10), 10);
      assert.strictEqual(clamp(-0.5, 0, 10), 0);
    });

    it('should handle edge case where min equals max', () => {
      assert.strictEqual(clamp(5, 10, 10), 10);
      assert.strictEqual(clamp(10, 10, 10), 10);
      assert.strictEqual(clamp(15, 10, 10), 10);
    });

    it('should return NaN for invalid inputs', () => {
      assert.ok(isNaN(clamp(null, 0, 10)));
      assert.ok(isNaN(clamp(undefined, 0, 10)));
      assert.ok(isNaN(clamp(5, null, 10)));
      assert.ok(isNaN(clamp(5, 0, null)));
      assert.ok(isNaN(clamp(NaN, 0, 10)));
      assert.ok(isNaN(clamp(5, NaN, 10)));
      assert.ok(isNaN(clamp(5, 0, NaN)));
      assert.ok(isNaN(clamp('5', 0, 10)));
    });

    it('should return NaN when min > max', () => {
      assert.ok(isNaN(clamp(5, 10, 0)));
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimal places', () => {
      assert.strictEqual(roundTo(3.14159, 2), 3.14);
      assert.strictEqual(roundTo(3.14159, 3), 3.142);
      assert.strictEqual(roundTo(3.14159, 0), 3);
    });

    it('should handle rounding up', () => {
      assert.strictEqual(roundTo(3.14159, 1), 3.1);
      assert.strictEqual(roundTo(3.16, 1), 3.2);
      assert.strictEqual(roundTo(3.5, 0), 4);
    });

    it('should handle rounding down', () => {
      assert.strictEqual(roundTo(3.14, 1), 3.1);
      assert.strictEqual(roundTo(3.44, 0), 3);
    });

    it('should handle negative numbers', () => {
      assert.strictEqual(roundTo(-3.14159, 2), -3.14);
      assert.strictEqual(roundTo(-3.16, 1), -3.2);
      // Note: Math.round() in JavaScript uses "round half toward positive infinity"
      // so -3.5 rounds to -3, not -4
      assert.strictEqual(roundTo(-3.5, 0), -3);
      assert.strictEqual(roundTo(-3.6, 0), -4);
    });

    it('should handle zero decimal places', () => {
      assert.strictEqual(roundTo(3.7, 0), 4);
      assert.strictEqual(roundTo(3.2, 0), 3);
    });

    it('should handle large decimal places', () => {
      assert.strictEqual(roundTo(3.14159, 5), 3.14159);
      assert.strictEqual(roundTo(3.14159, 10), 3.14159);
    });

    it('should handle whole numbers', () => {
      assert.strictEqual(roundTo(5, 2), 5);
      assert.strictEqual(roundTo(10, 0), 10);
    });

    it('should return NaN for invalid inputs', () => {
      assert.ok(isNaN(roundTo(null, 2)));
      assert.ok(isNaN(roundTo(undefined, 2)));
      assert.ok(isNaN(roundTo(3.14, null)));
      assert.ok(isNaN(roundTo(3.14, undefined)));
      assert.ok(isNaN(roundTo(NaN, 2)));
      assert.ok(isNaN(roundTo(3.14, NaN)));
      assert.ok(isNaN(roundTo('3.14', 2)));
    });

    it('should return NaN for negative decimal places', () => {
      assert.ok(isNaN(roundTo(3.14, -1)));
      assert.ok(isNaN(roundTo(3.14, -5)));
    });

    it('should floor decimal places to integer', () => {
      assert.strictEqual(roundTo(3.14159, 2.7), 3.14);
      assert.strictEqual(roundTo(3.14159, 2.1), 3.14);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      assert.strictEqual(isEven(0), true);
      assert.strictEqual(isEven(2), true);
      assert.strictEqual(isEven(4), true);
      assert.strictEqual(isEven(100), true);
    });

    it('should return false for odd numbers', () => {
      assert.strictEqual(isEven(1), false);
      assert.strictEqual(isEven(3), false);
      assert.strictEqual(isEven(5), false);
      assert.strictEqual(isEven(99), false);
    });

    it('should handle negative even numbers', () => {
      assert.strictEqual(isEven(-2), true);
      assert.strictEqual(isEven(-4), true);
      assert.strictEqual(isEven(-100), true);
    });

    it('should handle negative odd numbers', () => {
      assert.strictEqual(isEven(-1), false);
      assert.strictEqual(isEven(-3), false);
      assert.strictEqual(isEven(-99), false);
    });

    it('should return false for non-integer numbers', () => {
      assert.strictEqual(isEven(2.5), false);
      assert.strictEqual(isEven(3.7), false);
      assert.strictEqual(isEven(1.1), false);
    });

    it('should return false for invalid inputs', () => {
      assert.strictEqual(isEven(null), false);
      assert.strictEqual(isEven(undefined), false);
      assert.strictEqual(isEven(NaN), false);
      assert.strictEqual(isEven('2'), false);
      assert.strictEqual(isEven({}), false);
      assert.strictEqual(isEven([]), false);
    });
  });

  describe('isOdd', () => {
    it('should return true for odd numbers', () => {
      assert.strictEqual(isOdd(1), true);
      assert.strictEqual(isOdd(3), true);
      assert.strictEqual(isOdd(5), true);
      assert.strictEqual(isOdd(99), true);
    });

    it('should return false for even numbers', () => {
      assert.strictEqual(isOdd(0), false);
      assert.strictEqual(isOdd(2), false);
      assert.strictEqual(isOdd(4), false);
      assert.strictEqual(isOdd(100), false);
    });

    it('should handle negative odd numbers', () => {
      assert.strictEqual(isOdd(-1), true);
      assert.strictEqual(isOdd(-3), true);
      assert.strictEqual(isOdd(-99), true);
    });

    it('should handle negative even numbers', () => {
      assert.strictEqual(isOdd(-2), false);
      assert.strictEqual(isOdd(-4), false);
      assert.strictEqual(isOdd(-100), false);
    });

    it('should return false for non-integer numbers', () => {
      assert.strictEqual(isOdd(2.5), false);
      assert.strictEqual(isOdd(3.7), false);
      assert.strictEqual(isOdd(1.1), false);
    });

    it('should return false for invalid inputs', () => {
      assert.strictEqual(isOdd(null), false);
      assert.strictEqual(isOdd(undefined), false);
      assert.strictEqual(isOdd(NaN), false);
      assert.strictEqual(isOdd('3'), false);
      assert.strictEqual(isOdd({}), false);
      assert.strictEqual(isOdd([]), false);
    });
  });

  describe('sum', () => {
    it('should return sum of positive numbers', () => {
      assert.strictEqual(sum([1, 2, 3, 4, 5]), 15);
      assert.strictEqual(sum([10, 20, 30]), 60);
    });

    it('should return sum of negative numbers', () => {
      assert.strictEqual(sum([-1, -2, -3]), -6);
      assert.strictEqual(sum([-10, -20]), -30);
    });

    it('should return sum of mixed positive and negative numbers', () => {
      assert.strictEqual(sum([1, -2, 3, -4, 5]), 3);
      assert.strictEqual(sum([10, -5, 3, -8]), 0);
    });

    it('should handle decimal numbers', () => {
      assert.strictEqual(sum([1.5, 2.5, 3]), 7);
      // Use approximate comparison for floating point arithmetic
      const result = sum([0.1, 0.2, 0.3]);
      assert.ok(Math.abs(result - 0.6) < 1e-10);
    });

    it('should return 0 for empty array', () => {
      assert.strictEqual(sum([]), 0);
    });

    it('should handle single element array', () => {
      assert.strictEqual(sum([5]), 5);
      assert.strictEqual(sum([-3]), -3);
    });

    it('should handle array with zero', () => {
      assert.strictEqual(sum([0, 0, 0]), 0);
      assert.strictEqual(sum([1, 0, 2]), 3);
    });

    it('should return NaN for invalid inputs', () => {
      assert.ok(isNaN(sum(null)));
      assert.ok(isNaN(sum(undefined)));
      assert.ok(isNaN(sum('123')));
      assert.ok(isNaN(sum(123)));
      assert.ok(isNaN(sum({})));
    });

    it('should return NaN for arrays with invalid elements', () => {
      assert.ok(isNaN(sum([1, 2, null, 4])));
      assert.ok(isNaN(sum([1, 2, undefined, 4])));
      assert.ok(isNaN(sum([1, 2, NaN, 4])));
      assert.ok(isNaN(sum([1, 2, '3', 4])));
      assert.ok(isNaN(sum([1, 2, {}, 4])));
    });
  });

  describe('average', () => {
    it('should return average of positive numbers', () => {
      assert.strictEqual(average([1, 2, 3, 4, 5]), 3);
      assert.strictEqual(average([10, 20, 30]), 20);
    });

    it('should return average of negative numbers', () => {
      assert.strictEqual(average([-1, -2, -3]), -2);
      assert.strictEqual(average([-10, -20]), -15);
    });

    it('should return average of mixed positive and negative numbers', () => {
      assert.strictEqual(average([1, -2, 3, -4, 5]), 0.6);
      assert.strictEqual(average([10, -5, 3, -8]), 0);
    });

    it('should handle decimal numbers', () => {
      assert.strictEqual(average([1.5, 2.5]), 2);
      assert.strictEqual(average([1, 2, 3]), 2);
    });

    it('should handle single element array', () => {
      assert.strictEqual(average([5]), 5);
      assert.strictEqual(average([-3]), -3);
    });

    it('should handle array with zeros', () => {
      assert.strictEqual(average([0, 0, 0]), 0);
      assert.strictEqual(average([1, 0, 2]), 1);
    });

    it('should return NaN for empty array', () => {
      assert.ok(isNaN(average([])));
    });

    it('should return NaN for invalid inputs', () => {
      assert.ok(isNaN(average(null)));
      assert.ok(isNaN(average(undefined)));
      assert.ok(isNaN(average('123')));
      assert.ok(isNaN(average(123)));
      assert.ok(isNaN(average({})));
    });

    it('should return NaN for arrays with invalid elements', () => {
      assert.ok(isNaN(average([1, 2, null, 4])));
      assert.ok(isNaN(average([1, 2, undefined, 4])));
      assert.ok(isNaN(average([1, 2, NaN, 4])));
      assert.ok(isNaN(average([1, 2, '3', 4])));
      assert.ok(isNaN(average([1, 2, {}, 4])));
    });

    it('should calculate correct average for large arrays', () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => i + 1);
      assert.strictEqual(average(largeArray), 50.5);
    });
  });
});
