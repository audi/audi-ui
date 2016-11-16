import Component from '../component/component';
import limit from '../util/limit';

const SELECTOR_COMPONENT = '.aui-js-nav';
const CLASS_ACTION = 'aui-nav__action';
const CLASS_IS_ACTIVE = 'is-active';

/**
 * Class constructor for NavList AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class NavList extends Component {

  /**
   * Upgrades all NavList AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new NavList(element));
      }
    });
    return components;
  };

  /**
   * Constructor
   * @constructor
   * @param {HTMLElement} element The element of the AUI component.
   */
  constructor(element) {
    super(element);
  }

  /**
   * Initialize component.
   */
  init() {
    super.init();

    // Refer elements
    this._actionElements = Array.from(this._element.querySelectorAll(`.${CLASS_ACTION}`));

    // Add event handler
    this._element.addEventListener('click', this._clickHandler = (event) => this._onClick(event));

    // Set initial action element active
    this.setActive(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));
  }

  /**
   * Dispose component.
   */
  dispose() {
    super.dispose();
    this._element.removeEventListener('click', this._clickHandler);
  }

  /**
   * Updates inidcator position and visibility of paddles.
   */
  update() {
    this.setActive(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));
  }

  /**
   * Set an action element at given index active.
   * @param {index} index The index of action element to set active.
   */
  setActiveByIndex(index) {
    const i = limit(index, 0, this._actionElements.length);
    this.setActive(this._actionElements[i]);
  }

  /**
   * Set an action element active.
   * @param {HTMLElement} activeTarget The action element to set active.
   */
  setActive(activeTarget) {
    this._actionElements.forEach((item, index) => {
      const active = (item === activeTarget);
      item.classList.toggle(CLASS_IS_ACTIVE, active);
      if (active) {
        this._index = index;
      }
    });
  }


  /**
   * Handle click of element.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClick(event) {
    // Find closest action element
    let currentElement = event.target;
    while (currentElement !== event.currentTarget) {
      if (currentElement.classList.contains(CLASS_ACTION)) {
        if (!currentElement.disabled) {
          this.setActive(currentElement);
        }
        break;
      }
      currentElement = currentElement.parentNode;
    }
  }

  /**
   * Returns index.
   * @returns {number} the index of current active action element.
   */
  get index() {
    return this._index;
  }

  /**
   * Returns length.
   * @returns {number} the number of action elements.
   */
  get length() {
    return this._actionElements.length;
  }
}
