import Component from '../component/component';
import Sticky from '../sticky/sticky';
import limit from '../util/limit';
import isNone from '../util/is-none';

const SELECTOR_COMPONENT = '.aui-js-nav';
const CLASS_PANEL = 'aui-nav__panel';
const CLASS_UNDERLINE = 'aui-nav__underline';
const CLASS_ITEM = 'aui-nav__item';
const CLASS_ACTION = 'aui-nav__action';
const CLASS_TOGGLE = 'aui-nav__toggle';
const CLASS_TOGGLE_LABEL = 'aui-nav__toggle-label';
const CLASS_STICKY = 'aui-nav--sticky';
const CLASS_IS_ACTIVE = 'is-active';

/**
 * Class constructor for NavDropdown AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class NavDropdown extends Component {

  /**
   * Upgrades all NavDropdown AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new NavDropdown(element));
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

    this._index = 0;

    // Refer elements
    this._panel = this._element.querySelector(`.${CLASS_PANEL}`);
    this._actions = Array.from(this._element.querySelectorAll(`.${CLASS_ACTION}`));

    // Set transition delays for item elements
    Array.from(this._element.querySelectorAll(`.${CLASS_ITEM}`)).forEach((element, index) => {
      element.style.transitionDelay = element.style.webkitTransitionDelay = `${0.1 + 0.05 * index}s`;
    });

    // Add toggle element
    this._toggle = this.createElement('button', [CLASS_TOGGLE], {
      type: 'button'
    });
    this._element.appendChild(this._toggle);
    this._toggleLabel = this.createElement('span', [CLASS_TOGGLE_LABEL]);
    this._toggle.appendChild(this._toggleLabel);

    // Add underline element
    this._underline = this.createElement('div', [CLASS_UNDERLINE]);
    this._element.appendChild(this._underline);

    // Check if component is sticky
    if (this._element.classList.contains(CLASS_STICKY)) {
      this._stickyHandler = new Sticky(this._element);
    }

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
    this._actions.forEach((element, index) => {
      element.style.transitionDelay = '';
    });
    this.removeChild(this._toggle);
    this.removeChild(this._underline);
    this._element.removeEventListener('click', this._clickHandler);
  }

  /**
   * Updates inidcator position and visibility of paddles.
   */
  update() {
    this.setActive(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));
  }

  /**
   * Toggle active state.
   * @param {boolean} force If is true, open panel, and if it is false, close it.
   */
  toggle(force) {
    this._element.classList.toggle(CLASS_IS_ACTIVE, force);
  }

  /**
   * Set an action element at given index active.
   * @param {index} index The index of action element to set active.
   */
  setActiveByIndex(index) {
    let i = limit(index, 0, this._actions.length);
    this.setActive(this._actions[i]);
  }

  /**
   * Set an action element active.
   * @param {HTMLElement} activeTarget The action element to set active.
   */
  setActive(activeTarget) {
    // TODO: Optimize like in nav-list

    // Remove active class from all action elements
    this._actions.forEach(item => {
      item.classList.remove(CLASS_IS_ACTIVE);
    });

    // If no action element is active, pick the first one
    if (isNone(activeTarget)) {
      activeTarget = this._actions[0];
    }

    // Apply active class to action element and mirror innerHTML to toggle
    activeTarget.classList.add(CLASS_IS_ACTIVE);
    this._toggleLabel.innerHTML = activeTarget.innerHTML;

    // Update active index
    this._index = null;
    for (var i = 0; i < this._actions.length; i++) {
      if (this._actions[i] === activeTarget) {
        this._index = i;
        break;
      }
    }
  }

  /**
   * Handle click of element.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClick(event) {
    if (event.target === this._toggle) {
      this.toggle();
    } else {
      // Find closest action element
      let currentElement = event.target;
      while (currentElement !== event.currentTarget) {
        if (currentElement.classList.contains(CLASS_ACTION)) {
          this.setActive(currentElement);
          this.toggle();
          break;
        }
        currentElement = currentElement.parentNode;
      }
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
    return this._actions.length;
  }
}
