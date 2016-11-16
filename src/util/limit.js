/**
 * Limits a value to x >= min and x <= max.
 * @param {number} x The value to limit.
 * @param {number} min The value to limit.
 * @param {number} max The value to limit.
 * @returns {number} The limited value.
 */
export default function limit(x, min, max) {
  if (x > max) x = max;
  if (x < min) x = min;
  return x;
}
