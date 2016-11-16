import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-radio';
const CLASS_INPUT = 'aui-radio__input';
const CLASS_LABEL = 'aui-radio__label';
const CLASS_BOX = 'aui-radio__box';
const CLASS_TICK = 'aui-radio__tick';
const CLASS_IS_FOCUS = 'is-focused';
const CLASS_IS_CHECKED = 'is-checked';
const CLASS_IS_DISABLED = 'is-disabled';

let _radios;

/**
 * Class constructor for Radio AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Radio extends Component {

  /**
   * Upgrades all Radio AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Radio(element));
      }
    });
    _radios = components;
    return components;
  };

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

    this.groupName = this._input.getAttribute('name');

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
   * Enable radio.
   */
  enable() {
    this._input.disabled = false;
    this.updateClasses();
  }

  /**
   * Disable radio.
   */
  disable() {
    this._input.disabled = true;
    this.updateClasses();
  }

  /**
   * Check radio.
   */
  check() {
    this._input.checked = true;
    this.updateClasses();
  }

  /**
   * Uncheck radio.
   */
  uncheck() {
    this._input.checked = false;
    this.updateClasses();
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
   * Handle change event.
   * @param {Event} event that fired.
   */
  _onChange(event) {
    this.updateClasses();
    // Since other radio buttons don't get change events, we need to look for
    // them to update their classes.
    for (var i = 0; i < _radios.length; i++) {
      var button = _radios[i];
      // Different name == different group, so no point updating those.
      if (button._input.getAttribute('name') === this.groupName) {
        button.updateClasses();
      }
    }
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
