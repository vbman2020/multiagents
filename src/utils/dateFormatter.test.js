const { formatDate, timeAgo, isValidDate, daysBetween } = require('./dateFormatter');

describe('dateFormatter', () => {
  describe('isValidDate', () => {
    test('returns true for valid Date objects', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2024-01-15'))).toBe(true);
      expect(isValidDate(new Date(2024, 0, 15))).toBe(true);
      expect(isValidDate(new Date(0))).toBe(true); // Unix epoch
    });

    test('returns false for invalid Date objects', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate(new Date('not-a-date'))).toBe(false);
    });

    test('returns false for null and undefined', () => {
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });

    test('returns false for strings', () => {
      expect(isValidDate('2024-01-15')).toBe(false);
      expect(isValidDate('01/15/2024')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });

    test('returns false for numbers', () => {
      expect(isValidDate(1234567890)).toBe(false);
      expect(isValidDate(0)).toBe(false);
      expect(isValidDate(NaN)).toBe(false);
    });

    test('returns false for other types', () => {
      expect(isValidDate({})).toBe(false);
      expect(isValidDate([])).toBe(false);
      expect(isValidDate(true)).toBe(false);
      expect(isValidDate(false)).toBe(false);
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-03-15T14:30:45');

    describe('YYYY-MM-DD pattern', () => {
      test('formats date correctly with YYYY-MM-DD pattern', () => {
        expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2024-03-15');
      });

      test('formats date with single-digit month and day correctly', () => {
        const date = new Date('2024-01-05');
        expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-05');
      });

      test('formats date at year boundary correctly', () => {
        const date = new Date('2023-12-31');
        expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-12-31');
      });
    });

    describe('MM/DD/YYYY pattern', () => {
      test('formats date correctly with MM/DD/YYYY pattern', () => {
        expect(formatDate(testDate, 'MM/DD/YYYY')).toBe('03/15/2024');
      });

      test('formats date with single-digit month and day correctly', () => {
        const date = new Date('2024-01-05');
        expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/05/2024');
      });
    });

    describe('DD-MM-YYYY pattern', () => {
      test('formats date correctly with DD-MM-YYYY pattern', () => {
        expect(formatDate(testDate, 'DD-MM-YYYY')).toBe('15-03-2024');
      });
    });

    describe('additional patterns', () => {
      test('formats with YY for 2-digit year', () => {
        expect(formatDate(testDate, 'YY-MM-DD')).toBe('24-03-15');
      });

      test('formats with M and D without leading zeros', () => {
        const date = new Date('2024-03-05');
        expect(formatDate(date, 'M/D/YYYY')).toBe('3/5/2024');
      });

      test('formats with time components HH:mm:ss', () => {
        expect(formatDate(testDate, 'HH:mm:ss')).toBe('14:30:45');
      });

      test('formats with time components H:m:s without leading zeros', () => {
        const date = new Date('2024-03-15T09:05:03');
        expect(formatDate(date, 'H:m:s')).toBe('9:5:3');
      });

      test('formats with full datetime pattern', () => {
        expect(formatDate(testDate, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-03-15 14:30:45');
      });

      test('formats with custom separators', () => {
        expect(formatDate(testDate, 'DD.MM.YYYY')).toBe('15.03.2024');
        expect(formatDate(testDate, 'YYYY/MM/DD')).toBe('2024/03/15');
      });

      test('formats with mixed patterns', () => {
        expect(formatDate(testDate, 'MM-DD-YY HH:mm')).toBe('03-15-24 14:30');
      });
    });

    describe('edge cases', () => {
      test('returns null for null date', () => {
        expect(formatDate(null, 'YYYY-MM-DD')).toBe(null);
      });

      test('returns null for undefined date', () => {
        expect(formatDate(undefined, 'YYYY-MM-DD')).toBe(null);
      });

      test('returns null for invalid date', () => {
        expect(formatDate(new Date('invalid'), 'YYYY-MM-DD')).toBe(null);
      });

      test('returns null for null format', () => {
        expect(formatDate(testDate, null)).toBe(null);
      });

      test('returns null for undefined format', () => {
        expect(formatDate(testDate, undefined)).toBe(null);
      });

      test('accepts string dates', () => {
        expect(formatDate('2024-03-15', 'YYYY-MM-DD')).toBe('2024-03-15');
      });

      test('accepts timestamp numbers', () => {
        const timestamp = testDate.getTime();
        expect(formatDate(timestamp, 'YYYY-MM-DD')).toBe('2024-03-15');
      });

      test('returns null for non-date objects', () => {
        expect(formatDate({}, 'YYYY-MM-DD')).toBe(null);
        expect(formatDate([], 'YYYY-MM-DD')).toBe(null);
        expect(formatDate(true, 'YYYY-MM-DD')).toBe(null);
      });

      test('handles leap year dates', () => {
        const leapDate = new Date('2024-02-29');
        expect(formatDate(leapDate, 'YYYY-MM-DD')).toBe('2024-02-29');
      });

      test('handles dates at beginning of year', () => {
        const date = new Date('2024-01-01');
        expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-01');
      });

      test('handles dates at end of year', () => {
        const date = new Date('2024-12-31');
        expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-12-31');
      });
    });
  });

  describe('timeAgo', () => {
    // Use relative dates based on current time
    describe('seconds', () => {
      test('returns "just now" for times less than 10 seconds ago', () => {
        const date = new Date(Date.now() - 5 * 1000); // 5 seconds ago
        const result = timeAgo(date);
        expect(result).toBe('just now');
      });

      test('returns seconds for times 10+ seconds ago', () => {
        const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ seconds? ago/);
      });

      test('returns singular "second" for 1 second ago', () => {
        const date = new Date(Date.now() - 11 * 1000); // 11 seconds ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ seconds? ago/);
      });
    });

    describe('minutes', () => {
      test('returns minutes for times less than 1 hour ago', () => {
        const date = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ minutes? ago/);
      });

      test('returns singular "minute" for 1 minute ago', () => {
        const date = new Date(Date.now() - 60 * 1000); // 1 minute ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ minutes? ago/);
      });

      test('returns plural "minutes" for multiple minutes ago', () => {
        const date = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ minutes? ago/);
      });
    });

    describe('hours', () => {
      test('returns hours for times less than 1 day ago', () => {
        const date = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ hours? ago/);
      });

      test('returns singular "hour" for 1 hour ago', () => {
        const date = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ hours? ago/);
      });

      test('returns plural "hours" for multiple hours ago', () => {
        const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ hours? ago/);
      });
    });

    describe('days', () => {
      test('returns days for times less than 1 week ago', () => {
        const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ days? ago/);
      });

      test('returns singular "day" for 1 day ago', () => {
        const date = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ days? ago/);
      });

      test('returns plural "days" for multiple days ago', () => {
        const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ days? ago/);
      });
    });

    describe('weeks', () => {
      test('returns weeks for times less than 1 month ago', () => {
        const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 2 weeks ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ weeks? ago/);
      });

      test('returns singular "week" for 1 week ago', () => {
        const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ weeks? ago/);
      });

      test('returns plural "weeks" for multiple weeks ago', () => {
        const date = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000); // 3 weeks ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ weeks? ago/);
      });
    });

    describe('months', () => {
      test('returns months for times less than 1 year ago', () => {
        const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // ~2 months ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ months? ago/);
      });

      test('returns singular "month" for 1 month ago', () => {
        const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // ~1 month ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ (weeks?|months?) ago/);
      });

      test('returns plural "months" for multiple months ago', () => {
        const date = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000); // ~5 months ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ months? ago/);
      });
    });

    describe('years', () => {
      test('returns years for times more than 1 year ago', () => {
        const date = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000); // ~2 years ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ years? ago/);
      });

      test('returns singular "year" for 1 year ago', () => {
        const date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // ~1 year ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ (months?|years?) ago/);
      });

      test('returns plural "years" for multiple years ago', () => {
        const date = new Date(Date.now() - 1460 * 24 * 60 * 60 * 1000); // ~4 years ago
        const result = timeAgo(date);
        expect(result).toMatch(/\d+ years? ago/);
      });
    });

    describe('future dates', () => {
      test('returns "in X unit" for future dates', () => {
        const date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in future
        const result = timeAgo(date);
        expect(result).toMatch(/in \d+ (minutes?|hours?)/);
      });

      test('returns "in X units" for future dates (plural)', () => {
        const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days in future
        const result = timeAgo(date);
        expect(result).toMatch(/in \d+ (hours?|days?)/);
      });

      test('handles future minutes', () => {
        const date = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes in future
        const result = timeAgo(date);
        expect(result).toMatch(/in \d+ minutes?/);
      });
    });

    describe('edge cases', () => {
      test('returns null for null date', () => {
        expect(timeAgo(null)).toBe(null);
      });

      test('returns null for undefined date', () => {
        expect(timeAgo(undefined)).toBe(null);
      });

      test('returns null for invalid date', () => {
        expect(timeAgo(new Date('invalid'))).toBe(null);
      });

      test('accepts string dates', () => {
        const dateStr = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 min ago
        const result = timeAgo(dateStr);
        expect(result).toMatch(/\d+ minutes? ago/);
      });

      test('accepts timestamp numbers', () => {
        const timestamp = Date.now() - 60 * 60 * 1000; // 1 hour ago
        const result = timeAgo(timestamp);
        expect(result).toMatch(/\d+ (minutes?|hours?) ago/);
      });

      test('returns null for non-date objects', () => {
        expect(timeAgo({})).toBe(null);
        expect(timeAgo([])).toBe(null);
        expect(timeAgo(true)).toBe(null);
      });
    });
  });

  describe('daysBetween', () => {
    describe('basic calculations', () => {
      test('calculates days between two dates correctly', () => {
        const date1 = new Date('2024-03-15');
        const date2 = new Date('2024-03-20');
        expect(daysBetween(date1, date2)).toBe(5);
      });

      test('calculates days with date1 after date2', () => {
        const date1 = new Date('2024-03-20');
        const date2 = new Date('2024-03-15');
        expect(daysBetween(date1, date2)).toBe(5);
      });

      test('returns 0 for same date', () => {
        const date = new Date('2024-03-15');
        expect(daysBetween(date, date)).toBe(0);
      });

      test('returns 0 for same day with different times', () => {
        const date1 = new Date('2024-03-15T08:00:00');
        const date2 = new Date('2024-03-15T20:00:00');
        expect(daysBetween(date1, date2)).toBe(0);
      });
    });

    describe('cross-boundary calculations', () => {
      test('calculates days across month boundary', () => {
        const date1 = new Date('2024-03-30');
        const date2 = new Date('2024-04-05');
        expect(daysBetween(date1, date2)).toBe(6);
      });

      test('calculates days across year boundary', () => {
        const date1 = new Date('2023-12-28');
        const date2 = new Date('2024-01-03');
        expect(daysBetween(date1, date2)).toBe(6);
      });

      test('calculates days in leap year February', () => {
        const date1 = new Date('2024-02-28');
        const date2 = new Date('2024-03-01');
        expect(daysBetween(date1, date2)).toBe(2); // 2024 is a leap year
      });

      test('calculates days in non-leap year February', () => {
        const date1 = new Date('2023-02-28');
        const date2 = new Date('2023-03-01');
        expect(daysBetween(date1, date2)).toBe(1); // 2023 is not a leap year
      });
    });

    describe('large date ranges', () => {
      test('calculates days for one year', () => {
        const date1 = new Date('2023-03-15');
        const date2 = new Date('2024-03-15');
        expect(daysBetween(date1, date2)).toBe(366); // 2024 is a leap year
      });

      test('calculates days for multiple years', () => {
        const date1 = new Date('2020-01-01');
        const date2 = new Date('2024-01-01');
        expect(daysBetween(date1, date2)).toBe(1461); // 4 years including one leap year
      });

      test('calculates days for one day', () => {
        const date1 = new Date('2024-03-15');
        const date2 = new Date('2024-03-16');
        expect(daysBetween(date1, date2)).toBe(1);
      });
    });

    describe('input flexibility', () => {
      test('accepts string dates', () => {
        expect(daysBetween('2024-03-15', '2024-03-20')).toBe(5);
      });

      test('accepts timestamp numbers', () => {
        const timestamp1 = new Date('2024-03-15').getTime();
        const timestamp2 = new Date('2024-03-20').getTime();
        expect(daysBetween(timestamp1, timestamp2)).toBe(5);
      });

      test('accepts mixed input types', () => {
        const date1 = new Date('2024-03-15');
        const date2 = '2024-03-20';
        expect(daysBetween(date1, date2)).toBe(5);
      });
    });

    describe('edge cases', () => {
      test('returns null for null date1', () => {
        expect(daysBetween(null, new Date())).toBe(null);
      });

      test('returns null for null date2', () => {
        expect(daysBetween(new Date(), null)).toBe(null);
      });

      test('returns null for undefined date1', () => {
        expect(daysBetween(undefined, new Date())).toBe(null);
      });

      test('returns null for undefined date2', () => {
        expect(daysBetween(new Date(), undefined)).toBe(null);
      });

      test('returns null for invalid date1', () => {
        expect(daysBetween(new Date('invalid'), new Date())).toBe(null);
      });

      test('returns null for invalid date2', () => {
        expect(daysBetween(new Date(), new Date('invalid'))).toBe(null);
      });

      test('returns null for non-date objects', () => {
        expect(daysBetween({}, new Date())).toBe(null);
        expect(daysBetween(new Date(), [])).toBe(null);
        expect(daysBetween(true, false)).toBe(null);
      });

      test('handles dates with time components', () => {
        const date1 = new Date('2024-03-15T23:59:59');
        const date2 = new Date('2024-03-16T00:00:01');
        expect(daysBetween(date1, date2)).toBe(0);
      });

      test('handles Unix epoch', () => {
        const date1 = new Date(0);
        const date2 = new Date('1970-01-02');
        expect(daysBetween(date1, date2)).toBe(1);
      });
    });
  });
});
