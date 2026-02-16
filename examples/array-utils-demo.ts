/**
 * Demo file showing usage of array utility functions
 * This file is for documentation purposes and is not included in the build
 */

import { unique, flatten, chunk } from '../src/utils/array-utils';

console.log('=== Array Utilities Demo ===\n');

// unique() examples
console.log('--- unique() ---');
console.log('unique([1, 2, 2, 3, 1, 4]):', unique([1, 2, 2, 3, 1, 4]));
console.log('unique(["a", "b", "a", "c"]):', unique(['a', 'b', 'a', 'c']));
console.log('unique([]):', unique([]));

// flatten() examples
console.log('\n--- flatten() ---');
console.log('flatten([1, [2, 3], 4]):', flatten([1, [2, 3], 4]));
console.log('flatten([1, [2, [3, 4], 5]]):', flatten([1, [2, [3, 4], 5]]));
console.log('flatten([1, [2, [3, [4, [5]]]]]):', flatten([1, [2, [3, [4, [5]]]]]));

// chunk() examples
console.log('\n--- chunk() ---');
console.log('chunk([1, 2, 3, 4, 5], 2):', chunk([1, 2, 3, 4, 5], 2));
console.log('chunk([1, 2, 3, 4, 5, 6], 2):', chunk([1, 2, 3, 4, 5, 6], 2));
console.log('chunk([1, 2, 3], 5):', chunk([1, 2, 3], 5));

// Real-world use case examples
console.log('\n--- Real-world Examples ---');

// 1. Remove duplicate user IDs
const userIds = [101, 102, 101, 103, 102, 104];
console.log('Remove duplicate user IDs:', unique(userIds));

// 2. Flatten nested categories
const categories = ['Electronics', ['Computers', ['Laptops', 'Desktops'], 'Phones'], 'Books'];
console.log('Flatten categories:', flatten(categories));

// 3. Paginate results
const searchResults = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pages = chunk(searchResults, 3);
console.log('Paginate results (3 per page):', pages);

console.log('\n=== Demo Complete ===');
