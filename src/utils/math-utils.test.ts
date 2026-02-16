import { clamp, lerp, roundTo } from './math-utils';

describe('clamp', () => {
  describe('normal cases', () => {
    it('should return value when within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should return min when value is below min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, -50, 50)).toBe(-50);
    });

    it('should return max when value is above max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, -50, 50)).toBe(50);
    });

    it('should work with negative bounds', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    it('should work with decimal values', () => {
      expect(clamp(5.5, 0.1, 10.9)).toBe(5.5);
      expect(clamp(0.05, 0.1, 10.9)).toBe(0.1);
      expect(clamp(11.5, 0.1, 10.9)).toBe(10.9);
    });
  });

  describe('boundary conditions', () => {
    it('should handle min equals max', () => {
      expect(clamp(5, 10, 10)).toBe(10);
      expect(clamp(10, 10, 10)).toBe(10);
      expect(clamp(15, 10, 10)).toBe(10);
    });

    it('should handle zero bounds', () => {
      expect(clamp(0, 0, 0)).toBe(0);
      expect(clamp(5, 0, 0)).toBe(0);
      expect(clamp(-5, 0, 0)).toBe(0);
    });

    it('should handle very large numbers', () => {
      expect(clamp(1e308, 0, 1e309)).toBe(1e308);
      expect(clamp(1e310, 0, 1e309)).toBe(1e309);
    });

    it('should handle very small numbers', () => {
      expect(clamp(1e-10, 0, 1)).toBe(1e-10);
      expect(clamp(-1e-10, 0, 1)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should return NaN when value is NaN', () => {
      expect(clamp(NaN, 0, 10)).toBe(NaN);
    });

    it('should return NaN when min is NaN', () => {
      expect(clamp(5, NaN, 10)).toBe(NaN);
    });

    it('should return NaN when max is NaN', () => {
      expect(clamp(5, 0, NaN)).toBe(NaN);
    });

    it('should handle Infinity value', () => {
      expect(clamp(Infinity, 0, 10)).toBe(10);
      expect(clamp(-Infinity, 0, 10)).toBe(0);
    });

    it('should handle Infinity bounds', () => {
      expect(clamp(5, -Infinity, Infinity)).toBe(5);
      expect(clamp(100, -Infinity, 10)).toBe(10);
      expect(clamp(-100, 0, Infinity)).toBe(0);
    });

    it('should throw error when min > max', () => {
      expect(() => clamp(5, 10, 0)).toThrow('Invalid bounds: min must be less than or equal to max');
      expect(() => clamp(5, 100, -100)).toThrow('Invalid bounds: min must be less than or equal to max');
    });
  });
});

describe('lerp', () => {
  describe('normal cases', () => {
    it('should return a when t=0', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(-5, 5, 0)).toBe(-5);
      expect(lerp(100, 200, 0)).toBe(100);
    });

    it('should return b when t=1', () => {
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(-5, 5, 1)).toBe(5);
      expect(lerp(100, 200, 1)).toBe(200);
    });

    it('should interpolate correctly for 0 < t < 1', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 100, 0.25)).toBe(25);
      expect(lerp(0, 100, 0.75)).toBe(75);
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it('should work with negative values', () => {
      expect(lerp(-10, -5, 0.5)).toBe(-7.5);
      expect(lerp(-100, -50, 0.5)).toBe(-75);
    });

    it('should work with decimal values', () => {
      expect(lerp(0.1, 0.9, 0.5)).toBeCloseTo(0.5, 10);
      expect(lerp(1.5, 2.5, 0.3)).toBeCloseTo(1.8, 10);
    });

    it('should extrapolate when t < 0', () => {
      expect(lerp(0, 10, -0.5)).toBe(-5);
      expect(lerp(10, 20, -1)).toBe(0);
    });

    it('should extrapolate when t > 1', () => {
      expect(lerp(0, 10, 1.5)).toBe(15);
      expect(lerp(10, 20, 2)).toBe(30);
    });
  });

  describe('boundary conditions', () => {
    it('should handle a equals b', () => {
      expect(lerp(5, 5, 0)).toBe(5);
      expect(lerp(5, 5, 0.5)).toBe(5);
      expect(lerp(5, 5, 1)).toBe(5);
    });

    it('should handle zero values', () => {
      expect(lerp(0, 0, 0.5)).toBe(0);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('should handle very large differences', () => {
      expect(lerp(0, 1e10, 0.5)).toBeCloseTo(5e9, 0);
      expect(lerp(-1e10, 1e10, 0.5)).toBeCloseTo(0, 0);
    });

    it('should handle very small t values', () => {
      expect(lerp(0, 100, 1e-10)).toBeCloseTo(1e-8, 15);
    });
  });

  describe('edge cases', () => {
    it('should return NaN when a is NaN', () => {
      expect(lerp(NaN, 10, 0.5)).toBe(NaN);
    });

    it('should return NaN when b is NaN', () => {
      expect(lerp(0, NaN, 0.5)).toBe(NaN);
    });

    it('should return NaN when t is NaN', () => {
      expect(lerp(0, 10, NaN)).toBe(NaN);
    });

    it('should handle Infinity in a', () => {
      expect(lerp(Infinity, 10, 0)).toBe(Infinity);
      expect(lerp(Infinity, 10, 0.5)).toBe(Infinity);
      expect(lerp(Infinity, 10, 1)).toBe(10);
      expect(lerp(-Infinity, 10, 0)).toBe(-Infinity);
      expect(lerp(-Infinity, 10, 0.5)).toBe(-Infinity);
    });

    it('should handle Infinity in b', () => {
      expect(lerp(0, Infinity, 0)).toBe(0);
      expect(lerp(0, Infinity, 0.5)).toBe(Infinity);
      expect(lerp(0, Infinity, 1)).toBe(Infinity);
      expect(lerp(0, -Infinity, 0.5)).toBe(-Infinity);
    });

    it('should handle both values as same Infinity', () => {
      expect(lerp(Infinity, Infinity, 0.5)).toBe(Infinity);
      expect(lerp(-Infinity, -Infinity, 0.5)).toBe(-Infinity);
    });
  });
});

describe('roundTo', () => {
  describe('normal cases', () => {
    it('should round to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 3)).toBe(3.142);
      expect(roundTo(3.14159, 4)).toBe(3.1416);
    });

    it('should round to integer when decimals=0', () => {
      expect(roundTo(3.14159, 0)).toBe(3);
      expect(roundTo(3.7, 0)).toBe(4);
      expect(roundTo(2.5, 0)).toBe(3);
      expect(roundTo(3.5, 0)).toBe(4);
    });

    it('should handle negative numbers', () => {
      expect(roundTo(-3.14159, 2)).toBe(-3.14);
      expect(roundTo(-2.5, 0)).toBe(-2);
      expect(roundTo(-3.5, 0)).toBe(-3);
    });

    it('should handle numbers that don\'t need rounding', () => {
      expect(roundTo(3.14, 2)).toBe(3.14);
      expect(roundTo(5, 2)).toBe(5);
      expect(roundTo(0, 5)).toBe(0);
    });

    it('should work with various decimal places', () => {
      expect(roundTo(1.23456789, 0)).toBe(1);
      expect(roundTo(1.23456789, 1)).toBe(1.2);
      expect(roundTo(1.23456789, 5)).toBe(1.23457);
    });
  });

  describe('boundary conditions', () => {
    it('should handle zero', () => {
      expect(roundTo(0, 0)).toBe(0);
      expect(roundTo(0, 5)).toBe(0);
      expect(roundTo(0, 10)).toBe(0);
    });

    it('should handle very small numbers', () => {
      expect(roundTo(1e-10, 5)).toBe(0);
      expect(roundTo(1e-10, 15)).toBeCloseTo(1e-10, 15);
    });

    it('should handle very large numbers', () => {
      expect(roundTo(1e10, 2)).toBe(1e10);
      expect(roundTo(123456789.123456, 2)).toBe(123456789.12);
    });

    it('should handle maximum reasonable decimal places', () => {
      expect(roundTo(3.14159265359, 10)).toBeCloseTo(3.1415926536, 10);
    });

    it('should handle decimals beyond precision limit', () => {
      // Beyond ~15 decimals, should return original value
      expect(roundTo(3.14159, 20)).toBe(3.14159);
    });
  });

  describe('edge cases', () => {
    it('should return NaN when value is NaN', () => {
      expect(roundTo(NaN, 2)).toBe(NaN);
    });

    it('should return NaN when decimals is NaN', () => {
      expect(roundTo(3.14, NaN)).toBe(NaN);
    });

    it('should return Infinity when value is Infinity', () => {
      expect(roundTo(Infinity, 2)).toBe(Infinity);
      expect(roundTo(-Infinity, 2)).toBe(-Infinity);
    });

    it('should throw error for negative decimals', () => {
      expect(() => roundTo(3.14, -1)).toThrow('decimals must be a non-negative integer');
      expect(() => roundTo(3.14, -5)).toThrow('decimals must be a non-negative integer');
    });

    it('should throw error for non-integer decimals', () => {
      expect(() => roundTo(3.14, 2.5)).toThrow('decimals must be a non-negative integer');
      expect(() => roundTo(3.14, 1.1)).toThrow('decimals must be a non-negative integer');
    });

    it('should handle rounding edge cases (0.5 rounds up)', () => {
      expect(roundTo(1.5, 0)).toBe(2);
      expect(roundTo(2.5, 0)).toBe(3);
      expect(roundTo(1.25, 1)).toBe(1.3);
      expect(roundTo(1.35, 1)).toBe(1.4);
    });

    it('should handle potential overflow in multiplier', () => {
      const veryLarge = 1e308;
      expect(roundTo(veryLarge, 100)).toBe(veryLarge);
    });
  });
});
