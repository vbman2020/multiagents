/**
 * Main entry point for the string validation utility module
 */

const {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
} = require('./stringValidation');

module.exports = {
  isEmail,
  isURL,
  isAlphanumeric,
  minLength,
  maxLength
};
