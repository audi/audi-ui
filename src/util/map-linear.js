/**
 * Linear mapping from range <a1, a2> to range <b1, b2>
 * @param {number} x The value to map
 * @param {number} a1 First endpoint of the range <a1, a2>
 * @param {number} a2 Final endpoint of the range <a1, a2>
 * @param {number} b1 First endpoint of the range <b1, b2>
 * @param {number} b2 Final endpoint of the range  <b1, b2>
 * @returns {number} The mapped value.
 */
export default function mapLinear(x, a1, a2, b1, b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}
