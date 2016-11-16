import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-dropdown';
const SELECTOR_OPTION_INPUT = 'input';
const CLASS_ANIMATED_LIST_ITEMS = 'aui-dropdown__list-item--animate';
const CLASS_LABEL = 'aui-dropdown__label';
const CLASS_INPUT = 'aui-dropdown__input';
const CLASS_VALUE = 'aui-dropdown__value';
const CLASS_FOCUS_LINE = 'aui-dropdown__focus-line';
const CLASS_OPTION = 'aui-dropdown__option';
const CLASS_MULTIPLE = 'aui-dropdown--multiple';
const CLASS_IS_FOCUS = 'is-focused';
const CLASS_IS_DIRTY = 'is-dirty';
const CLASS_IS_DISABLED = 'is-disabled';
const CLASS_IS_ACTIVE = 'is-active';

/**
 * Class constructor for Dropdown AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Dropdown extends Component {

  /**
   * Upgrades all Dropdown AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Dropdown(element));
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

    this._element.addEventListener('click', this._clickHandler = event => this._onClick(event));

    this.multiple = this._element.classList.contains(CLASS_MULTIPLE);
    this._isActive = false;

    this._valueField = this._element.querySelector(`.${CLASS_VALUE}`);

    this._input = this._element.querySelector(`.${CLASS_INPUT}`);
    this._input.addEventListener('input', this._inputHandler = event => this._onInput(event));
    this._input.addEventListener('focus', this._focusHandler = event => this._onFocus(event));
    this._input.addEventListener('blur', this._blurHandler = event => this._onBlur(event));
    this._input.addEventListener('reset', this._resetHandler = event => this._onReset(event));

    let itemsAnimated = this._element.querySelectorAll(`.${CLASS_ANIMATED_LIST_ITEMS}`);
    for (var i = 0; i < itemsAnimated.length; i++) {
      itemsAnimated[i].style.transitionDelay = itemsAnimated[i].style.webkitTransitionDelay = `${.05 * i}s`;
    }

    // Insert thick focus line after label element:
    this._label = this._element.querySelector(`.${CLASS_LABEL}`);
    let focusLine = document.createElement('span');
    focusLine.classList.add(CLASS_FOCUS_LINE);
    this._label.parentNode.insertBefore(focusLine, this._label.nextSibling);

    this.updateClasses();
  }

  optionClicked(option) {
    if (this._valueField) {
      this._valueField.value = this._getOptionValue(option);
    }

    this.updateInput(option);

    if (!this.multiple) {
      this.close();
    }
  }

  updateInput(option) {
    let value = '';
    if (this.multiple) {
      let values = [];
      Array.from(this._element.querySelectorAll(`.${CLASS_OPTION}`)).forEach(element => {
        const input = element.querySelector(SELECTOR_OPTION_INPUT);
        if (input && input.checked) {
          values.push(this._getOptionTitle(element));
        }
      });
      value = values.length > 0 ? `(${values.length}) ${values.join(', ')}` : '';
    } else {
      value = this._getOptionTitle(option);
    }
    this._input.value = value;
    this.updateClasses();
  }

  _getOptionTitle(option) {
    let title = '';
    if (option) {
      title = option.hasAttribute('data-title') ? option.getAttribute('data-title') : '';
    }
    return title;
  }

  _getOptionValue(option) {
    let value = '';
    if (option) {
      value = option.hasAttribute('data-value') ? option.getAttribute('data-value') : '';
    }
    return value;
  }

  open() {
    if (!this._element.classList.contains(CLASS_IS_DISABLED)) {
      this._isActive = true;
      this._element.classList.add(CLASS_IS_ACTIVE);
      window.addEventListener('click', this._clickHandlerWindow = (event) => this._onClickOutside(event));
    }
  }

  close() {
    this._isActive = false;
    this._element.classList.remove(CLASS_IS_ACTIVE);
    window.removeEventListener('click', this.close);
  }

  toggleOpen() {
    if (this._isActive) {
      this.close();
    } else {
      this.open();
    }
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
    if (this._input.value && this._input.value.length > 0) {
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
   *
   */
  dispose() {
    super.dispose();

    this._input.removeEventListener('input', this._inputHandler);
    this._input.removeEventListener('focus', this._focusHandler);
    this._input.removeEventListener('blur', this._blurHandler);
    this._input.removeEventListener('reset', this._resetHandler);

    window.removeEventListener('click', this.close);
  }

  /**
   * Event Handler
   */

  _onClick(event) {
    let isOption = false;

    // Find closest action element
    let currentElement = event.target;
    while (currentElement !== event.currentTarget) {
      if (currentElement.classList.contains(CLASS_OPTION)) {
        this.optionClicked(currentElement);
        isOption = true;
        break;
      }
      currentElement = currentElement.parentNode;
    }

    if (!isOption) {
      this.toggleOpen();
    }
  }

  _onClickOutside(event) {
    if (!this._element.contains(event.target)) {
      this.close();
      this.updateClasses();
    }
  }

  _onInput(event) {
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
