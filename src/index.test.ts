import * as mainExports from './index';
import { clamp, lerp, roundTo } from './index';

describe('index exports', () => {
  it('should export clamp function', () => {
    expect(typeof mainExports.clamp).toBe('function');
    expect(typeof clamp).toBe('function');
  });

  it('should export lerp function', () => {
    expect(typeof mainExports.lerp).toBe('function');
    expect(typeof lerp).toBe('function');
  });

  it('should export roundTo function', () => {
    expect(typeof mainExports.roundTo).toBe('function');
    expect(typeof roundTo).toBe('function');
  });

  it('should have working exports', () => {
    // Quick smoke test to ensure exports work correctly
    expect(clamp(5, 0, 10)).toBe(5);
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });
});
