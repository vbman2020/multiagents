# multiagents

A TypeScript utility library providing essential mathematical functions for multi-agent systems and general computational needs.

## Overview

This library currently provides core math utility functions that are commonly needed in multi-agent systems, game development, animations, and general computational tasks. The library is designed with a focus on:

- **Numeric precision**: Proper handling of edge cases including NaN, Infinity, and floating-point precision
- **Type safety**: Full TypeScript support with comprehensive type definitions
- **Reliability**: Extensive test coverage ensuring correct behavior across boundary conditions
- **Performance**: Efficient implementations suitable for real-time applications

## Installation

```bash
npm install multiagents
```

## API Reference

### Math Utilities

#### `clamp(value: number, min: number, max: number): number`

Constrains a value between minimum and maximum bounds.

**Parameters:**
- `value`: The value to constrain
- `min`: The minimum bound
- `max`: The maximum bound

**Returns:** The constrained value within [min, max]

**Throws:** Error if `min > max`

**Examples:**
```typescript
import { clamp } from 'multiagents';

clamp(5, 0, 10);    // Returns: 5
clamp(-5, 0, 10);   // Returns: 0
clamp(15, 0, 10);   // Returns: 10
clamp(7.5, 0, 10);  // Returns: 7.5
```

**Edge Cases:**
- Returns `NaN` if any parameter is `NaN`
- Handles `Infinity` values appropriately
- Throws error when `min > max` to prevent invalid usage

---

#### `lerp(a: number, b: number, t: number): number`

Performs linear interpolation between two values.

**Parameters:**
- `a`: The start value (returned when `t = 0`)
- `b`: The end value (returned when `t = 1`)
- `t`: The interpolation parameter (typically in range [0, 1], but extrapolation is supported)

**Returns:** The interpolated value: `a + (b - a) * t`

**Examples:**
```typescript
import { lerp } from 'multiagents';

lerp(0, 10, 0);     // Returns: 0
lerp(0, 10, 1);     // Returns: 10
lerp(0, 10, 0.5);   // Returns: 5
lerp(0, 10, 0.25);  // Returns: 2.5

// Extrapolation (t outside [0, 1])
lerp(0, 10, 1.5);   // Returns: 15
lerp(0, 10, -0.5);  // Returns: -5
```

**Use Cases:**
- Animations and smooth transitions
- Color blending
- Position interpolation in games and simulations
- Agent movement in multi-agent systems

**Edge Cases:**
- Returns `NaN` if any parameter is `NaN`
- Handles `Infinity` values with appropriate boundary behavior
- Supports extrapolation when `t < 0` or `t > 1`

---

#### `roundTo(value: number, decimals: number): number`

Rounds a number to a specified number of decimal places.

**Parameters:**
- `value`: The value to round
- `decimals`: The number of decimal places (must be a non-negative integer)

**Returns:** The rounded value

**Throws:** Error if `decimals` is negative or not an integer

**Examples:**
```typescript
import { roundTo } from 'multiagents';

roundTo(3.14159, 2);   // Returns: 3.14
roundTo(3.14159, 0);   // Returns: 3
roundTo(3.14159, 4);   // Returns: 3.1416
roundTo(2.5, 0);       // Returns: 3 (rounds half up)
roundTo(-2.5, 0);      // Returns: -2 (rounds half to even for negatives)
```

**Edge Cases:**
- Returns `NaN` if value or decimals is `NaN`
- Returns `Infinity` if value is `Infinity`
- Handles precision limits (>15 decimals may return original value)
- Throws error for negative or non-integer `decimals` parameter

---

## Development

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Project Structure

```
multiagents/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── index.test.ts               # Entry point tests
│   └── utils/
│       ├── math-utils.ts           # Math utility functions
│       └── math-utils.test.ts      # Math utility tests
├── dist/                           # Compiled output (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Roadmap

This library is designed to grow with additional utilities for multi-agent systems:

### Planned Features
- **Agent coordination utilities**: Functions for agent communication and coordination
- **Spatial utilities**: Distance calculations, collision detection, spatial partitioning
- **Behavior utilities**: Steering behaviors, flocking algorithms, state machines
- **Statistical utilities**: Random distributions, sampling, statistical analysis
- **Vector operations**: 2D/3D vector math commonly needed in agent simulations

## Requirements & Constraints

All functions in this library:
- Maintain numeric precision and handle edge cases (NaN, Infinity, negative numbers)
- Handle invalid inputs gracefully with appropriate errors or return values
- Are fully type-safe with TypeScript
- Have comprehensive unit test coverage (>80%)
- Follow consistent naming and documentation patterns

## Contributing

This library follows strict quality standards:
- All functions must have comprehensive JSDoc documentation
- Test coverage must exceed 80% for branches, functions, lines, and statements
- All edge cases must be properly handled and tested
- Code must follow the established patterns and TypeScript strict mode

## License

ISC
