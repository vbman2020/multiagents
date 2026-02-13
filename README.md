# multiagents

## String Validation Utility Module

A comprehensive JavaScript utility module for validating strings with various validation functions.

### Features

- **Email Validation**: Validates email addresses according to RFC 5322 practical format
- **URL Validation**: Validates URLs with support for common schemes (http, https, ftp, ftps, file)
- **Alphanumeric Check**: Validates strings containing only letters and numbers
- **Length Validation**: Checks minimum and maximum string lengths
- **Safe Error Handling**: All functions handle null and undefined values without throwing exceptions

### Installation

```bash
npm install
```

### Usage

```javascript
const {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
} = require('./src/stringValidator');

// Email validation
console.log(isEmail('user@example.com')); // true
console.log(isEmail('invalid-email')); // false

// URL validation
console.log(isURL('https://example.com')); // true
console.log(isURL('not a url')); // false

// Alphanumeric validation
console.log(isAlphanumeric('abc123')); // true
console.log(isAlphanumeric('abc-123')); // false

// Length validation
console.log(minLength('hello', 3)); // true
console.log(maxLength('hello', 10)); // true
```

### API Reference

#### `isEmail(str)`

Validates if a string is a valid email address.

- **Parameters**: `str` (string) - The string to validate
- **Returns**: `boolean` - True if valid email, false otherwise
- **Example**: `isEmail('user@example.com')` returns `true`

#### `isURL(str)`

Validates if a string is a valid URL with common schemes.

- **Parameters**: `str` (string) - The string to validate
- **Returns**: `boolean` - True if valid URL, false otherwise
- **Supported Schemes**: http, https, ftp, ftps, file
- **Example**: `isURL('https://example.com')` returns `true`

#### `isAlphanumeric(str)`

Checks if a string contains only letters and numbers.

- **Parameters**: `str` (string) - The string to validate
- **Returns**: `boolean` - True if alphanumeric only, false otherwise
- **Example**: `isAlphanumeric('abc123')` returns `true`

#### `minLength(str, min)`

Checks if a string meets the minimum length requirement.

- **Parameters**: 
  - `str` (string) - The string to validate
  - `min` (number) - The minimum length required
- **Returns**: `boolean` - True if length >= min, false otherwise
- **Example**: `minLength('hello', 3)` returns `true`

#### `maxLength(str, max)`

Checks if a string meets the maximum length requirement.

- **Parameters**: 
  - `str` (string) - The string to validate
  - `max` (number) - The maximum length allowed
- **Returns**: `boolean` - True if length <= max, false otherwise
- **Example**: `maxLength('hello', 10)` returns `true`

### Error Handling

All validation functions safely handle:
- `null` values - Returns `false`
- `undefined` values - Returns `false`
- Non-string types - Returns `false`
- Empty strings - Returns `false` (except for length functions with appropriate min/max values)
- Invalid parameters - Returns `false`

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Test Coverage

The module has 100% code coverage including:
- Valid input tests
- Invalid input tests
- Edge case tests (null, undefined, empty strings)
- Non-string type tests
- Integration tests

### License

MIT
