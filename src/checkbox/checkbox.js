import Component from '../component/component';

const NAMESPACE = 'auiCheckbox';
const SELECTOR_COMPONENT = '.aui-js-checkbox';
const CLASS_INPUT = 'aui-checkbox__input';
const CLASS_LABEL = 'aui-checkbox__label';
const CLASS_BOX = 'aui-checkbox__box';
const CLASS_TICK = 'aui-checkbox__tick';
const CLASS_IS_FOCUS = 'is-focused';
const CLASS_IS_CHECKED = 'is-checked';
const CLASS_IS_DISABLED = 'is-disabled';

/**
 * Class constructor for Checkbox AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Checkbox extends Component {

  /**
   * Upgrades all Checkbox AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Checkbox(element));
      }
    });
    return components;
  };

  /**
   * Returns all AUI component instances within the given container
   * @param {HTMLElement} container The container element to search for components
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static get(container = document) {
    let components = [];
    if (container) {
      Array.from(container.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
        components.push(element.auiCheckbox);
      });
    }
    return components;
  }

  constructor(element) {
    super(element, NAMESPACE);
  }

  init() {
    super.init();

    this._input = this._element.querySelector(`.${CLASS_INPUT}`);
    this._input.addEventListener('change', this._changeHandler = (event) => this._onChange(event));
    this._input.addEventListener('focus', this._focusHandler = (event) => this._onFocus(event));
    this._input.addEventListener('blur', this._blurHandler = (event) => this._onBlur(event));

    // Insert box with tick after label element:
    this._label = this._element.querySelector(`.${CLASS_LABEL}`);
    let box = document.createElement('span');
    box.classList.add(CLASS_BOX);
    this._label.parentNode.insertBefore(box, this._label.nextSibling);
    let tick = document.createElement('span');
    tick.classList.add(CLASS_TICK);
    box.appendChild(tick);

    this.updateClasses();
  }

  updateClasses() {
    this.checkDisabled();
    this.checkToggleState();
    this.checkFocus();
  }

  /**
   * Check the disabled state and update field accordingly.
   */
  checkDisabled() {
    if (this._input.disabled) {
      this._element.classList.add(CLASS_IS_DISABLED);
    } else {
      this._element.classList.remove(CLASS_IS_DISABLED);
    }
  }

  /**
   * Check the toggle state and update field accordingly.
   */
  checkToggleState() {
    if (this._input.checked) {
      this._element.classList.add(CLASS_IS_CHECKED);
    } else {
      this._element.classList.remove(CLASS_IS_CHECKED);
    }
  }

  /**
   * Check the focus state and update field accordingly.
   */
  checkFocus() {
    if (Boolean(this._element.querySelector(':focus'))) {
      this._element.classList.add(CLASS_IS_FOCUS);
    } else {
      this._element.classList.remove(CLASS_IS_FOCUS);
    }
  }

  /**
   * Enable checkbox
   */
  enable() {
    this._input.disabled = false;
    this.updateClasses();
  }

  /**
   * Disable checkbox
   */
  disable() {
    this._input.disabled = true;
    this.updateClasses();
  }

  /**
   * Check checkbox
   */
  check() {
    this._input.checked = true;
    this.updateClasses();
  }

  /**
   * Uncheck checkbox
   */
  uncheck() {
    this._input.checked = false;
    this.updateClasses();
  }

  /**
   * Uncheck checkbox
   */
  toggle() {
    if (this._input.checked) {
      this.uncheck();
    } else {
      this.check();
    }
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();

    this._input.removeEventListener('change', this._changeHandler);
    this._input.removeEventListener('focus', this._focusHandler);
    this._input.removeEventListener('blur', this._blurHandler);

    this._element.removeChild(this._element.querySelector(`.${CLASS_BOX}`));
  }

  /**
   * Event Handler
   */

  _onChange(event) {
    this.updateClasses();
  }

  // TODO Find out why unfocus is triggered on mousedown
  _onFocus(event) {
    this._element.classList.add(CLASS_IS_FOCUS);
  }

  _onBlur(event) {
    this._element.classList.remove(CLASS_IS_FOCUS);
  }

  /**
   * Getter and Setter
   */

  get input() {
    return this._input;
  }

  get checked() {
    return this._input.checked = true;
  }

  set checked(value) {
    if (value) {
      this.check();
    } else {
      this.uncheck();
    }
  }

  get disabled() {
    return this._input.disabled = true;
  }

  set disabled(value) {
    if (value) {
      this.disable();
    } else {
      this.enable();
    }
  }
}
