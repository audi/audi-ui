const CLASS_IS_UPGRADED = 'is-upgraded';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Class constructor for abstract AUI Component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Component {

  /**
   * Check if an element is upgraded.
   * @param {HTMLElement} element The element to test if its already be upgraded.
   * @returns {boolean} Returns true if element is already upgraded
   */
  static isElementUpgraded(element) {
    return element.classList.contains(CLASS_IS_UPGRADED);
  }

  /**
   * Constructor
   * @constructor
   * @param {HTMLElement} element The element of the AUI component.
   */
  constructor(element) {
    this._element = element;

    if (this._element) {
      this.init();
    }
  }

  /**
   * Initialize component
   */
  init() {
    this._element.classList.add(CLASS_IS_UPGRADED);
  }

  /**
   * Dispose component
   */
  dispose() {
    this._element.classList.remove(CLASS_IS_UPGRADED);
  }

  /**
   * Remove a child element from its parent.
   * @param {HTMLElement} childNode The element to remove.
   */
  removeChild(childNode) {
    if (childNode && childNode.parentNode) {
      childNode.remove();
    }
  }

  /**
   * Creates an HTML element and sets the given CSS classes and attributes.
   * @param {string} tagName is a string that specifies the type of element to be created.
   * @param {Array} classes is an array of class names to set, e.g. ['aui-class-1', 'aui-class-2'].
   * @param {Object} attributes is an object with attributes to set, e.g. {width: 100}.
   * @returns {HTMLElement} The created element.
   */
  createElement(tagName, classes, attributes) {
    let element = document.createElement(tagName);
    if (classes && classes.length) {
      element.classList.add.apply(element.classList, classes);
    }
    for (var attr in attributes) {
      element.setAttribute(attr, attributes[attr]);
    }
    return element;
  }

  /**
   * Creates an SVG element and sets the given attributes.
   * @param {string} qualifiedName is a string that specifies the type of element to be created.
   * @param {Object} attributes is an object with attributes to set, e.g. {width: 100}.
   * @returns {SVGElement} The created element.
   */
  createSvgNode(qualifiedName, attributes) {
    let element = document.createElementNS(SVG_NS, qualifiedName);
    for (var attr in attributes) {
      element.setAttributeNS(
        null,
        // Replaces viewBox with view-box
        // attr.replace(/[A-Z]/g, function(match) {
        //   return '-' + match.toLowerCase();
        // }),
        attr,
        attributes[attr]
      );
    }
    return element;
  }

  /**
   * Returns the HTMLElement of component.
   */
  get element() {
    return this._element;
  }
}
