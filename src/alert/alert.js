import Component from '../component/component';
import ResizeObserver from '../util/resize-observer';

const SELECTOR_COMPONENT = '.aui-js-alert';
const CLASS_CONTENT = 'aui-alert__content';
const CLASS_CLOSE_BUTTON = 'aui-alert__close';
const CLASS_IS_CLOSED = 'is-closed';
const CLASS_IS_OPEN = 'is-open';
const ATTR_CLOSE = 'data-close';
const ATTR_OPENDELAY = 'data-opendelay';

/**
 * Class constructor for Alert AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Alert extends Component {

  /**
   * Upgrades all Alert AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Alert(element));
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
   * Initialize component
   */
  init() {
    super.init();

    this._content = this._element.querySelector(`.${CLASS_CONTENT}`);

    // Add close button
    this._closeButton = document.createElement('button');
    this._closeButton.setAttribute('type', 'button');
    this._closeButton.classList.add(CLASS_CLOSE_BUTTON);
    if (this._content) {
      this._content.appendChild(this._closeButton);
    }

    if (this._element.hasAttribute(ATTR_OPENDELAY)) {
      let delay = parseInt(this._element.getAttribute(ATTR_OPENDELAY));
      this._element.classList.add(CLASS_IS_CLOSED);
      this.openingTimeout = setTimeout(() => this.open(true), delay);
    } else {
      this.open();
    }

    this._resizeObserver = new ResizeObserver();
    this._resizeObserver.resized.add(this._resizedHandler = () => this.update());

    this.update();
  }

  /**
   * Open an Alert
   * @param {boolean} animate True, if the opening should be animated. Default: false
   */
  open(animate) {
    animate = animate || false;
    this._element.addEventListener('click', this._clickHandler = (event) => this._onClick(event));
    if (animate) {
      this._animateOpen();
    } else {
      this._element.classList.add(CLASS_IS_OPEN);
      this._element.classList.remove(CLASS_IS_CLOSED);
    }
  }

  /**
   * Animate opening of Alert
   */
  _animateOpen() {
    clearTimeout(this.openingTimeout);
    // Loop until start height is set and correctly rendered
    if (window.getComputedStyle(this._element).height && this._element.style.height) {
      this._element.classList.add(CLASS_IS_OPEN);
      this._element.classList.remove(CLASS_IS_CLOSED);
    } else {
      window.requestAnimationFrame(() => this._animateOpen());
    }
  }

  /**
   * Close this Alert
   */
  close() {
    this._element.removeEventListener('click', this._clickHandler);
    this._element.style.height = `${this._content.offsetHeight}px`;
    this._animateClose();
  }

  /**
   * Animate closing of Alert
   */
  _animateClose() {
    clearTimeout(this.openingTimeout);
    // Loop until start height is set and correctly rendered
    if (window.getComputedStyle(this._element).height && this._element.style.height) {
      this._element.classList.remove(CLASS_IS_OPEN);
      this._element.classList.add(CLASS_IS_CLOSED);
    } else {
      window.requestAnimationFrame(() => this._animateClose());
    }
  }

  /**
   * Update Alert.
   * Equalize element height with containing content.
   */
  update() {
    this._element.style.height = `${this._content.offsetHeight}px`;
  }

  /**
   * Handle click of element.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClick(event) {
    if (event.target.classList.contains(CLASS_CLOSE_BUTTON) || event.target.hasAttribute(ATTR_CLOSE)) {
      this.close();
    }
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();
    clearTimeout(this.openingTimeout);
    this._element.classList.remove(CLASS_IS_CLOSED);
    this._element.classList.remove(CLASS_IS_OPEN);
    this._element.removeEventListener('click', this._clickHandler);
    this._element.style.height = '';
    this.removeChild(this._closeButton);
    this.resizeObserver.resized.remove(this._resizedHandler);
  }
}
