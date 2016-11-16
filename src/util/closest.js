/**
 * Get the first element that matches the selector by testing the element itself
 * and traversing up through its ancestors in the DOM tree.
 * @param {HTMLElement} element to search wherefrom
 * @param {string} selector A string containing a selector expression to match elements against.
 * @param {HTMLElement} context A DOM element within which a matching element may be found.
 * @returns {HTMLElement} found element or null
 */
export default function closest(element, selector, context) {
  let matchesFn;

  ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
    if (typeof document.body[fn] === 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  });

  let parent;

  // traverse parents
  parent = element;
  while (parent) {
    if (parent && parent[matchesFn](selector)) {
      return parent;
    }
    if (parent === context) {
      return null;
    }
    parent = parent.parentElement;
  }

  return null;
}
