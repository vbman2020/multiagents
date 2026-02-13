/**
 * Date Formatting Utility Module
 * Provides functions for date manipulation, formatting, and validation
 */

/**
 * Validates whether a value is a valid Date object
 * @param {*} value - The value to validate
 * @returns {boolean} - True if value is a valid Date object, false otherwise
 */
function isValidDate(value) {
  // Check if value is a Date instance and not Invalid Date
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Pads a number with leading zeros
 * @private
 * @param {number} num - The number to pad
 * @param {number} length - The desired length
 * @returns {string} - The padded number as a string
 */
function padZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * Formats a date according to the specified pattern
 * Supported patterns:
 * - YYYY: 4-digit year
 * - YY: 2-digit year
 * - MM: 2-digit month (01-12)
 * - M: month without leading zero (1-12)
 * - DD: 2-digit day (01-31)
 * - D: day without leading zero (1-31)
 * - HH: 2-digit hours (00-23)
 * - H: hours without leading zero (0-23)
 * - mm: 2-digit minutes (00-59)
 * - m: minutes without leading zero (0-59)
 * - ss: 2-digit seconds (00-59)
 * - s: seconds without leading zero (0-59)
 * 
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The format pattern
 * @returns {string|null} - The formatted date string, or null if invalid
 */
function formatDate(date, format) {
  // Handle null or undefined
  if (date == null || format == null) {
    return null;
  }

  // Convert to Date object if necessary
  let dateObj;
  if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return null;
  }

  // Validate the date
  if (!isValidDate(dateObj)) {
    return null;
  }

  // Extract date components
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // 0-indexed
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  // Replace format tokens
  let result = format;
  
  // Year
  result = result.replace(/YYYY/g, String(year));
  result = result.replace(/YY/g, String(year).slice(-2));
  
  // Month
  result = result.replace(/MM/g, padZero(month));
  result = result.replace(/M/g, String(month));
  
  // Day
  result = result.replace(/DD/g, padZero(day));
  result = result.replace(/D/g, String(day));
  
  // Hours
  result = result.replace(/HH/g, padZero(hours));
  result = result.replace(/H/g, String(hours));
  
  // Minutes
  result = result.replace(/mm/g, padZero(minutes));
  result = result.replace(/m/g, String(minutes));
  
  // Seconds
  result = result.replace(/ss/g, padZero(seconds));
  result = result.replace(/s/g, String(seconds));

  return result;
}

/**
 * Returns a human-readable relative time string
 * @param {Date|string|number} date - The date to compare with current time
 * @returns {string|null} - The relative time string (e.g., '2 hours ago'), or null if invalid
 */
function timeAgo(date) {
  // Handle null or undefined
  if (date == null) {
    return null;
  }

  // Convert to Date object if necessary
  let dateObj;
  if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return null;
  }

  // Validate the date
  if (!isValidDate(dateObj)) {
    return null;
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const isFuture = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  // Calculate time units
  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Determine the appropriate unit and value
  let value, unit;

  if (years > 0) {
    value = years;
    unit = years === 1 ? 'year' : 'years';
  } else if (months > 0) {
    value = months;
    unit = months === 1 ? 'month' : 'months';
  } else if (weeks > 0) {
    value = weeks;
    unit = weeks === 1 ? 'week' : 'weeks';
  } else if (days > 0) {
    value = days;
    unit = days === 1 ? 'day' : 'days';
  } else if (hours > 0) {
    value = hours;
    unit = hours === 1 ? 'hour' : 'hours';
  } else if (minutes > 0) {
    value = minutes;
    unit = minutes === 1 ? 'minute' : 'minutes';
  } else {
    value = seconds;
    unit = seconds === 1 ? 'second' : 'seconds';
  }

  // Handle edge case for just now
  if (seconds < 10 && !isFuture) {
    return 'just now';
  }

  // Format the result
  if (isFuture) {
    return `in ${value} ${unit}`;
  } else {
    return `${value} ${unit} ago`;
  }
}

/**
 * Calculates the number of days between two dates
 * @param {Date|string|number} date1 - The first date
 * @param {Date|string|number} date2 - The second date
 * @returns {number|null} - The absolute number of days between the dates, or null if invalid
 */
function daysBetween(date1, date2) {
  // Handle null or undefined
  if (date1 == null || date2 == null) {
    return null;
  }

  // Convert to Date objects if necessary
  let dateObj1, dateObj2;

  if (typeof date1 === 'string' || typeof date1 === 'number') {
    dateObj1 = new Date(date1);
  } else if (date1 instanceof Date) {
    dateObj1 = date1;
  } else {
    return null;
  }

  if (typeof date2 === 'string' || typeof date2 === 'number') {
    dateObj2 = new Date(date2);
  } else if (date2 instanceof Date) {
    dateObj2 = date2;
  } else {
    return null;
  }

  // Validate both dates
  if (!isValidDate(dateObj1) || !isValidDate(dateObj2)) {
    return null;
  }

  // Calculate the difference in milliseconds
  const diffMs = Math.abs(dateObj2.getTime() - dateObj1.getTime());

  // Convert to days
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

module.exports = {
  formatDate,
  timeAgo,
  isValidDate,
  daysBetween
};
