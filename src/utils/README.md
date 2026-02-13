# Date Formatter Utility

A comprehensive date formatting and manipulation utility module for JavaScript applications.

## Features

- **formatDate()** - Format dates using customizable patterns
- **timeAgo()** - Convert dates to human-readable relative time strings
- **isValidDate()** - Validate Date objects
- **daysBetween()** - Calculate days between two dates

## Installation

```javascript
const { formatDate, timeAgo, isValidDate, daysBetween } = require('./utils/dateFormatter');
```

## API Reference

### formatDate(date, format)

Formats a date according to the specified pattern.

**Parameters:**
- `date` (Date|string|number): The date to format
- `format` (string): The format pattern

**Returns:** `string|null` - The formatted date string, or null if invalid

**Supported Format Tokens:**
- `YYYY` - 4-digit year (e.g., 2024)
- `YY` - 2-digit year (e.g., 24)
- `MM` - 2-digit month with leading zero (01-12)
- `M` - Month without leading zero (1-12)
- `DD` - 2-digit day with leading zero (01-31)
- `D` - Day without leading zero (1-31)
- `HH` - 2-digit hours with leading zero (00-23)
- `H` - Hours without leading zero (0-23)
- `mm` - 2-digit minutes with leading zero (00-59)
- `m` - Minutes without leading zero (0-59)
- `ss` - 2-digit seconds with leading zero (00-59)
- `s` - Seconds without leading zero (0-59)

**Examples:**
```javascript
const date = new Date('2024-03-15T14:30:45');

formatDate(date, 'YYYY-MM-DD');           // '2024-03-15'
formatDate(date, 'MM/DD/YYYY');           // '03/15/2024'
formatDate(date, 'DD-MM-YYYY');           // '15-03-2024'
formatDate(date, 'YYYY-MM-DD HH:mm:ss');  // '2024-03-15 14:30:45'
formatDate(date, 'M/D/YYYY');             // '3/15/2024'
formatDate(date, 'HH:mm:ss');             // '14:30:45'

// Also accepts string dates and timestamps
formatDate('2024-03-15', 'YYYY-MM-DD');   // '2024-03-15'
formatDate(1710504645000, 'MM/DD/YYYY');  // Date from timestamp
```

### timeAgo(date)

Returns a human-readable relative time string.

**Parameters:**
- `date` (Date|string|number): The date to compare with current time

**Returns:** `string|null` - The relative time string (e.g., '2 hours ago'), or null if invalid

**Examples:**
```javascript
// For dates in the past
timeAgo(new Date(Date.now() - 5000));              // 'just now'
timeAgo(new Date(Date.now() - 30000));             // '30 seconds ago'
timeAgo(new Date(Date.now() - 1800000));           // '30 minutes ago'
timeAgo(new Date(Date.now() - 7200000));           // '2 hours ago'
timeAgo(new Date(Date.now() - 86400000));          // '1 day ago'
timeAgo(new Date(Date.now() - 604800000));         // '1 week ago'
timeAgo(new Date(Date.now() - 2592000000));        // '1 month ago'
timeAgo(new Date(Date.now() - 31536000000));       // '1 year ago'

// For future dates
timeAgo(new Date(Date.now() + 3600000));           // 'in 1 hour'
timeAgo(new Date(Date.now() + 172800000));         // 'in 2 days'

// Also accepts string dates and timestamps
timeAgo('2024-01-01T00:00:00');                    // e.g., '2 months ago'
timeAgo(1704067200000);                            // From timestamp
```

### isValidDate(value)

Validates whether a value is a valid Date object.

**Parameters:**
- `value` (any): The value to validate

**Returns:** `boolean` - True if value is a valid Date object, false otherwise

**Examples:**
```javascript
isValidDate(new Date());                  // true
isValidDate(new Date('2024-03-15'));      // true
isValidDate(new Date('invalid'));         // false
isValidDate('2024-03-15');                // false (string, not Date object)
isValidDate(1710504645000);               // false (number, not Date object)
isValidDate(null);                        // false
isValidDate(undefined);                   // false
```

### daysBetween(date1, date2)

Calculates the number of days between two dates.

**Parameters:**
- `date1` (Date|string|number): The first date
- `date2` (Date|string|number): The second date

**Returns:** `number|null` - The absolute number of days between the dates, or null if invalid

**Examples:**
```javascript
const date1 = new Date('2024-03-15');
const date2 = new Date('2024-03-20');

daysBetween(date1, date2);                // 5
daysBetween(date2, date1);                // 5 (order doesn't matter)

// Across month boundaries
daysBetween('2024-03-30', '2024-04-05');  // 6

// Across year boundaries
daysBetween('2023-12-28', '2024-01-03');  // 6

// Same date
daysBetween(date1, date1);                // 0

// Also accepts timestamps
const ts1 = new Date('2024-03-15').getTime();
const ts2 = new Date('2024-03-20').getTime();
daysBetween(ts1, ts2);                    // 5

// Mixed types
daysBetween(date1, '2024-03-20');         // 5
```

## Error Handling

All functions handle edge cases gracefully:

- **Null/Undefined inputs:** Return `null` (or `false` for `isValidDate`)
- **Invalid dates:** Return `null` (or `false` for `isValidDate`)
- **Invalid input types:** Return `null` (or `false` for `isValidDate`)
- **Invalid format strings:** May return unexpected results; always use documented format tokens

## Testing

Run the comprehensive test suite:

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

## Performance Considerations

- All functions are synchronous and execute quickly
- No external dependencies required
- Minimal memory footprint
- Safe for frequent operations in production environments

## Browser Compatibility

These utilities use standard JavaScript Date APIs and are compatible with all modern browsers and Node.js environments.

## License

ISC
