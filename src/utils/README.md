# Array Utilities

A collection of utility functions for common array operations.

## Functions

### `unique<T>(arr: T[] | null | undefined): T[]`

Returns an array with all duplicate elements removed, preserving the original order. The first occurrence of each element is kept.

**Examples:**
```typescript
unique([1, 2, 2, 3, 1, 4]) // [1, 2, 3, 4]
unique(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']
unique([]) // []
unique(null) // []
```

**Edge Cases:**
- Handles `null` and `undefined` inputs by returning an empty array
- Works with any data type (numbers, strings, objects, etc.)
- Uses reference equality for objects

### `flatten<T>(arr: any[] | null | undefined): T[]`

Recursively flattens a nested array structure into a single-level array. Handles deeply nested arrays of any depth.

**Examples:**
```typescript
flatten([1, [2, [3, 4], 5]]) // [1, 2, 3, 4, 5]
flatten([1, [2, [3, [4, [5, [6]]]]]]) // [1, 2, 3, 4, 5, 6]
flatten([]) // []
flatten(null) // []
```

**Edge Cases:**
- Handles `null` and `undefined` inputs by returning an empty array
- Handles empty nested arrays
- Works with arrays of any nesting depth

### `chunk<T>(arr: T[] | null | undefined, size: number): T[][]`

Splits an array into chunks of the specified size. If the array doesn't divide evenly, the last chunk will contain the remaining elements.

**Examples:**
```typescript
chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
chunk([1, 2, 3], 3) // [[1, 2, 3]]
chunk([], 2) // []
```

**Edge Cases:**
- Handles `null` and `undefined` inputs by returning an empty array
- Throws an error if chunk size is not a positive integer
- Handles arrays that don't divide evenly by the chunk size
- Handles chunk sizes larger than the array length

**Errors:**
- Throws `Error('Chunk size must be a positive integer')` if size is:
  - Less than 1
  - Not an integer
  - `null` or `undefined`

## Usage

```typescript
import { unique, flatten, chunk } from './utils/array-utils';

// Remove duplicates
const uniqueNumbers = unique([1, 2, 2, 3, 1, 4]);

// Flatten nested arrays
const flatArray = flatten([1, [2, [3, 4], 5]]);

// Split into chunks
const chunks = chunk([1, 2, 3, 4, 5], 2);
```

## Type Safety

All functions are fully typed with TypeScript generics, providing type inference and compile-time safety:

```typescript
const numbers: number[] = unique([1, 2, 2, 3]); // Type: number[]
const strings: string[] = flatten([['a'], ['b', ['c']]]); // Type: string[]
const chunks: number[][] = chunk([1, 2, 3], 2); // Type: number[][]
```
