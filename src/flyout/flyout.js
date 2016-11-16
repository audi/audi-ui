import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-flyout';
const CLASS_TOGGLE = 'aui-flyout__toggle';
const CLASS_TRIANGLE = 'aui-flyout__triangle';
const CLASS_HEADER = 'aui-flyout__header';
const CLASS_CLOSE_BUTTON = 'aui-flyout__close';
const CLASS_PANEL = 'aui-flyout__panel';
const CLASS_IS_UPGRADED = 'is-upgraded';
const CLASS_IS_ACTIVE = 'is-active';
const CLASS_FLYOUT_IS_OPEN = 'aui-flyout-is-open';
const TOGGLE_THRESHOLD = 250; // in ms

/**
 * Class constructor for Flyout AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Flyout extends Component {

  /**
   * Upgrades all Flyout AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Flyout(element));
      }
    });
    return components;
  };

  /**
   * Initialize component
   */
  init() {
    super.init();

    this._activationTime = 0;

    this._body = document.querySelector('body');
    this._toggle = this._element.querySelector(`.${CLASS_TOGGLE}`);
    this._panel = this._element.querySelector(`.${CLASS_PANEL}`);

    // Add triangle shape
    this._triangle = document.createElement('span');
    this._triangle.classList.add(CLASS_TRIANGLE);
    this._panel.appendChild(this._triangle);

    // Add panel header with close button
    this._header = document.createElement('div');
    this._header.classList.add(CLASS_HEADER);
    this._header.innerHTML = `<button class="${CLASS_CLOSE_BUTTON}" type="button"></button>`;
    this._panel.appendChild(this._header);

    this._closeBtn = this._header.querySelector(`.${CLASS_CLOSE_BUTTON}`);
    this._closeBtn.addEventListener('click', this._boundClickClose = (event) => this._onClickClose(event));
    this._toggle.addEventListener('click', this._boundClickToggle = (event) => this._onClickToggle(event));

    if (this._element.classList.contains(CLASS_IS_ACTIVE)) {
      this.open();
    }
  }

  /**
   * Dispose component
   */
  dispose() {
    this._toggle.removeEventListener('click', this._boundClickToggle);
    this._closeBtn.removeEventListener('click', this._boundClickClose);
    window.removeEventListener('click', this._boundClickWindow);
    window.removeEventListener('touchend', this._boundTouchendWindow);

    this._panel.removeChild(this._triangle);

    this._element.classList.remove(CLASS_IS_ACTIVE, CLASS_IS_UPGRADED);
    this._element.removeAttribute('style');
  }

  /**
   * Open Flyout
   */
  open() {
    this._body.classList.add(CLASS_FLYOUT_IS_OPEN);
    this._activationTime = Date.now();
    this._isActive = true;
    this._element.classList.add(CLASS_IS_ACTIVE);
    window.addEventListener('click', this._boundClickWindow = (event) => this._onTouchOutside(event), true);
    window.addEventListener('touchend', this._boundTouchendWindow = (event) => this._onTouchOutside(event), true);
  }

  /**
   * Close Flyout
   */
  close() {
    this._body.classList.remove(CLASS_FLYOUT_IS_OPEN);
    this._isActive = false;
    this._element.classList.remove(CLASS_IS_ACTIVE);
    window.removeEventListener('click', this._boundClickWindow, true);
    window.removeEventListener('touchend', this._boundTouchendWindow, true);
  }

  /**
   * Toggle open/close Flyout
   */
  toggle() {
    let elapsed = Date.now() - this._activationTime;
    if (elapsed < TOGGLE_THRESHOLD) {
      return;
    }

    if (this._isActive) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Handle click of close button.
   * @param {Event} event that fired.
   */
  _onClickClose(event) {
    this.close();
  }

  /**
   * Handle click of toggle.
   * @param {Event} event that fired.
   */
  _onClickToggle(event) {
    this.toggle();
  }

  /**
   * Handle mouseneter.
   * @param {Event} event that fired.
   */
  _onMouseEnter(event) {
    this.open(event.target, event.clientX);
  }

  /**
   * Handle mouseleave.
   * @param {Event} event that fired.
   */
  _onMouseLeave(event) {
    this.close();
  }

  /**
   * Handle touch.
   * @param {Event} event that fired.
   */
  _onTouch(event) {
    event.stopPropagation();
    this.open();
  }

  /**
   * Handle touch outside.
   * @param {Event} event that fired.
   */
  _onTouchOutside(event) {
    if (!this._element.contains(event.target)) {
      this.close();
    }
  }
}
