import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-select';
const CLASS_INPUT = 'aui-select__input';
const CLASS_LABEL = 'aui-select__label';
const CLASS_FOCUS_LINE = 'aui-select__focus-line';
const CLASS_IS_FOCUS = 'is-focused';
const CLASS_IS_DIRTY = 'is-dirty';
const CLASS_IS_DISABLED = 'is-disabled';

/**
 * Class constructor for Select AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Select extends Component {

  /**
   * Upgrades all Select AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Select(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._label = this._element.querySelector(`.${CLASS_LABEL}`);

    this._input = this._element.querySelector(`.${CLASS_INPUT}`);
    this._input.addEventListener('change', this._changeHandler = (event) => this._onChange(event));
    this._input.addEventListener('focus', this._focusHandler = (event) => this._onFocus(event));
    this._input.addEventListener('blur', this._blurHandler = (event) => this._onBlur(event));
    this._input.addEventListener('reset', this._resetHandler = (event) => this._onReset(event));

    // Insert thick focus line after select element:
    let focusLine = document.createElement('span');
    focusLine.classList.add(CLASS_FOCUS_LINE);
    this._label.parentNode.insertBefore(focusLine, this._label.nextSibling);

    this.updateClasses();
  }

  updateClasses() {
    this.checkDisabled();
    this.checkDirty();
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
   * Check the dirty state and update field accordingly.
   */
  checkDirty() {
    // console.log('value', this._input.value, typeof this._input.value);
    // console.log('options', this._input.options[this._input.selectedIndex].disabled);
    if (!this._input.options[this._input.selectedIndex].disabled) {
      this._element.classList.add(CLASS_IS_DIRTY);
    } else {
      this._element.classList.remove(CLASS_IS_DIRTY);
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
   * Disable text field.
   */
  disable() {
    this._input.disabled = true;
    this.updateClasses();
  }

  /**
   * Event Handler
   */

  _onChange(event) {
    this.updateClasses();
  }

  _onFocus(event) {
    this._element.classList.add(CLASS_IS_FOCUS);
  }

  _onBlur(event) {
    this._element.classList.remove(CLASS_IS_FOCUS);
  }

  _onReset(event) {
    this.updateClasses();
  }
}
