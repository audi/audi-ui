/**
 * Check if value is either `undefined` or `null`.
 * @param {*} value to check.
 * @returns {boolean} true if value is `undefined` or `null`.
 */
export default function isNone(value) {
  return (value === undefined || value === null);
}
