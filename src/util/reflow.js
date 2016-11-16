/**
 * Trigger a reflow
 * @param {HTMLElement} element to trigger a reflow.
 */
export default function reflow(element) {
  new Function('bs', 'return bs')(element.offsetHeight);
}
