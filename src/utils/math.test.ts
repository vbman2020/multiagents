import { describe, it, expect } from 'vitest';
import { add, multiply, factorial } from './math';

describe('Math Utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add positive and negative numbers', () => {
      expect(add(10, -5)).toBe(5);
    });

    it('should add two negative numbers', () => {
      expect(add(-3, -7)).toBe(-10);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });

    it('should handle decimal numbers', () => {
      expect(add(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(4, 5)).toBe(20);
    });

    it('should multiply positive and negative numbers', () => {
      expect(multiply(6, -3)).toBe(-18);
    });

    it('should multiply two negative numbers', () => {
      expect(multiply(-4, -5)).toBe(20);
    });

    it('should handle zero', () => {
      expect(multiply(0, 5)).toBe(0);
      expect(multiply(5, 0)).toBe(0);
    });

    it('should handle decimal numbers', () => {
      expect(multiply(2.5, 4)).toBe(10);
    });

    it('should handle multiplication by 1', () => {
      expect(multiply(7, 1)).toBe(7);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of 5', () => {
      expect(factorial(5)).toBe(120);
    });

    it('should return 1 for factorial of 0', () => {
      expect(factorial(0)).toBe(1);
    });

    it('should return 1 for factorial of 1', () => {
      expect(factorial(1)).toBe(1);
    });

    it('should calculate factorial of 3', () => {
      expect(factorial(3)).toBe(6);
    });

    it('should calculate factorial of 10', () => {
      expect(factorial(10)).toBe(3628800);
    });

    it('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });

    it('should throw error for negative numbers (multiple cases)', () => {
      expect(() => factorial(-5)).toThrow();
      expect(() => factorial(-100)).toThrow();
    });
  });
});
