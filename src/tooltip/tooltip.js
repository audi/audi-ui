import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-tooltip';
const CLASS_TRIANGLE = 'aui-tooltip__triangle';
const CLASS_IS_UPGRADED = 'is-upgraded';
const CLASS_IS_ACTIVE = 'is-active';
const CLASS_IS_TOP = 'is-top';
const OFFSET_VIEWPORT_X = 10;
const OFFSET_TARGET_TOP = 12;
const OFFSET_TARGET_BOTTOM = 12;
const OPEN_DELAY = 400;

/**
 * Class constructor for Tooltip AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Tooltip extends Component {

  /**
   * Upgrades all Tooltip AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Tooltip(element));
      }
    });
    return components;
  };

  /**
   * Initialize component
   */
  init() {
    super.init();

    let forId = this._element.getAttribute('for');

    if (forId) {
      this._trigger = document.getElementById(forId);
    }

    if (this._trigger) {
      // Add triangle shape
      this._triangle = document.createElement('span');
      this._triangle.classList.add(CLASS_TRIANGLE);
      this._element.appendChild(this._triangle);

      // Prevent accidental text selection on Android
      if (!this._trigger.hasAttribute('tabindex')) {
        this._trigger.setAttribute('tabindex', '0');
      }

      this._trigger.addEventListener('mouseenter', this._boundMouseenter = (event) => this._onTriggerEnter(event));
      this._trigger.addEventListener('mouseleave', this._boundMouseleave = (event) => this._onTriggerLeave(event));
      this._trigger.addEventListener('focusin', this._boundfocusin = (event) => this._onTriggerEnter(event));
      this._trigger.addEventListener('focusout', this._boundfocusout = (event) => this._onTriggerLeave(event));
      this._trigger.addEventListener('touchstart', this._boundTouchstart = (event) => this._onTriggerEnter(event));
      window.addEventListener('touchend', this._boundTouchendWindow = (event) => this._onTriggerLeaveOutside(event));
    }
  }

  /**
   * Dispose component
   */
  dispose() {
    this._trigger.removeEventListener('mouseenter', this._boundMouseenter);
    this._trigger.removeEventListener('mouseleave', this._boundMouseleave);
    this._trigger.removeEventListener('focusin', this._boundfocusin);
    this._trigger.removeEventListener('focusout', this._boundfocusout);
    this._trigger.removeEventListener('touchstart', this._boundTouchstart);
    window.removeEventListener('touchend', this._boundTouchendWindow);
    window.removeEventListener('scroll', this._boundScrollWindow);

    this._element.classList.remove(CLASS_IS_TOP, CLASS_IS_ACTIVE, CLASS_IS_UPGRADED);
    this._element.removeAttribute('style');
    this._element.removeChild(this._triangle);
  }

  /**
   * Open tooltip
   * @param {HTMLElement} trigger element that opens the tooltip.
   * @param {number} clientX the x-coordinate of trigger (mouse/touch).
   */
  open(trigger, clientX) {
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    clientX = clientX || rect.left + rect.width / 2;
    const triggerX = clientX - rect.left;
    const yTop = rect.top - this._element.offsetHeight - OFFSET_TARGET_TOP;
    const yBottom = rect.bottom + OFFSET_TARGET_BOTTOM + 2;
    let x = rect.left + rect.width / 2 - this._element.offsetWidth / 2;
    let y = yBottom;
    let triangleX = 0;

    this._element.classList.remove(CLASS_IS_TOP);

    x = rect.left + triggerX - this._element.offsetWidth / 2;

    if (x < OFFSET_VIEWPORT_X) {
      x = OFFSET_VIEWPORT_X;
    }

    // If tooltip would be out of viewport on the right
    if (x + this._element.offsetWidth > window.innerWidth - OFFSET_VIEWPORT_X) {
      x = window.innerWidth - OFFSET_VIEWPORT_X - this._element.offsetWidth;
    }

    // If viewport height isn't large enough, place tooltip on top if possible
    if (yBottom + this._element.offsetHeight > window.innerHeight - OFFSET_VIEWPORT_X) {
      y = yTop;
      this._element.classList.add(CLASS_IS_TOP);
    }

    triangleX = triggerX + rect.left - x;

    this._element.classList.add(CLASS_IS_ACTIVE);
    this._element.style.left = `${x}px`;
    this._element.style.top = `${y}px`;

    this._triangle.style.left = `${triangleX}px`;

    this._scrolled = false;
    window.addEventListener('scroll', this._boundScrollWindow = (event) => this._onScrollWindow(event));
  }

  /**
   * Close tooltip.
   */
  close() {
    window.removeEventListener('scroll', this._boundScrollWindow);
    this._element.classList.remove(CLASS_IS_ACTIVE);
  }

  /**
   * Handle enter event.
   * @param {Event} event that fired.
   */
  _onTriggerEnter(event) {
    this.open(event.target, event.clientX);
    this.openTimeout = setTimeout(this.open => (event.target, event.clientX));
  }

  /**
   * Handle leave event.
   * @param {Event} event that fired.
   */
  _onTriggerLeave(event) {
    this.close();
  }

  /**
   * Handle leave outside event.
   * @param {Event} event that fired.
   */
  _onTriggerLeaveOutside(event) {
    if (!this._element.contains(event.target) && !this._trigger.contains(event.target)) {
      this.close();
    };
  }

  /**
   * Handle scroll event.
   * @param {Event} event that fired.
   */
  _onScrollWindow(event) {
    window.removeEventListener('scroll', this._boundScrollWindow);
    if (!this._scrolled) {
      this.close();
      this._scrolled = true;
    }
  }
}
