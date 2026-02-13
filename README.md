# multiagents

A collection of utility modules for JavaScript applications.

## Features

### Date Formatting Utilities

Comprehensive date formatting and manipulation utilities including:

- **formatDate()** - Format dates with customizable patterns (YYYY-MM-DD, MM/DD/YYYY, etc.)
- **timeAgo()** - Human-readable relative time strings ('2 hours ago', '3 days ago')
- **isValidDate()** - Validate Date objects
- **daysBetween()** - Calculate days between two dates

See [Date Formatter Documentation](src/utils/README.md) for detailed API reference and examples.

## Installation

```bash
npm install
```

## Usage

```javascript
const { formatDate, timeAgo, isValidDate, daysBetween } = require('./src');

// Format a date
const date = new Date('2024-03-15T14:30:45');
console.log(formatDate(date, 'YYYY-MM-DD'));        // '2024-03-15'
console.log(formatDate(date, 'MM/DD/YYYY HH:mm'));  // '03/15/2024 14:30'

// Get relative time
console.log(timeAgo(new Date(Date.now() - 3600000))); // '1 hour ago'

// Validate dates
console.log(isValidDate(new Date()));               // true
console.log(isValidDate('2024-03-15'));             // false

// Calculate days between dates
console.log(daysBetween('2024-03-15', '2024-03-20')); // 5
```

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
multiagents/
├── src/
│   ├── utils/
│   │   ├── dateFormatter.js      # Date utility functions
│   │   ├── dateFormatter.test.js # Comprehensive test suite
│   │   └── README.md             # Detailed API documentation
│   └── index.js                  # Main entry point
├── package.json
├── jest.config.js
├── .gitignore
└── README.md
```

## License

ISC
