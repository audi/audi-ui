import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-textfield';
const CLASS_FIELD = 'aui-textfield__field';
const CLASS_INPUT = 'aui-textfield__input';
const CLASS_LABEL = 'aui-textfield__label';
const CLASS_FOCUS_LINE = 'aui-textfield__focus-line';
const CLASS_COUNTER = 'aui-textfield__counter';
const CLASS_COUNTER_VALUE = 'aui-textfield__counter-value';
const CLASS_IS_FOCUS = 'is-focused';
const CLASS_IS_DIRTY = 'is-dirty';
const CLASS_IS_INVALID = 'is-invalid';
const CLASS_IS_DISABLED = 'is-disabled';
const CLASS_IS_EQUAL_MAX_CHARS = 'is-equal-max-length';
const CLASS_IS_GREATER_MAX_CHARS = 'is-greater-max-length';
const ATTR_AUTOSIZE = 'data-autosize';

/**
 * Class constructor for Textfield AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Textfield extends Component {

  /**
   * Upgrades all Textfield AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Textfield(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._input = this._element.querySelector(`.${CLASS_INPUT}`);
    this._input.addEventListener('input', this._inputHandler = (event) => this._onInput(event));
    this._input.addEventListener('focus', this._focusHandler = (event) => this._onFocus(event));
    this._input.addEventListener('blur', this._blurHandler = (event) => this._onBlur(event));
    this._input.addEventListener('change', this._changeHandler = (event) => this._onChange(event));
    this._input.addEventListener('reset', this._resetHandler = (event) => this._onReset(event));

    // Insert counter if data attribute 'count' is present:
    if (this._element.getAttribute('data-count')) {
      this._maxChars = parseInt(this._element.getAttribute('data-count')) || 0;
      this._label = this._element.querySelector(`.${CLASS_FIELD}`);
      this._counter = document.createElement('span');
      this._counter.classList.add(CLASS_COUNTER);
      this._label.parentNode.insertBefore(this._counter, this._label.nextSibling);
      this._counterValue = document.createElement('span');
      this._counterValue.classList.add(CLASS_COUNTER_VALUE);
      this._counterValue.innerHTML = this._maxChars;
      this._counter.appendChild(this._counterValue);
      this._hasCounter = true;
    }

    // Insert thick focus line after label element:
    this._label = this._element.querySelector(`.${CLASS_LABEL}`);
    let focusLine = document.createElement('span');
    focusLine.classList.add(CLASS_FOCUS_LINE);
    this._label.parentNode.insertBefore(focusLine, this._label.nextSibling);

    // If textarea should adjust height to content
    if (this._element.hasAttribute(ATTR_AUTOSIZE) && this._element.getAttribute(ATTR_AUTOSIZE) !== 'false') {
      let style = window.getComputedStyle(this._input);
      this._inputPadding = parseInt(style.paddingTop) + parseInt(style.paddingBottom) || 0;
      this._inputBorder = parseInt(style.borderTop) + parseInt(style.borderBottom) || 0;
      this._input.addEventListener('keyup', this._keyupHandler = event => this._onKeyup(event));
      this._autosize = true;
    }

    this.updateClasses();
  }

  update() {
    this.updateClasses();
    this.updateCounter();
    if (this._autosize) {
      this.adjustHeightToContent();
    }
  }

  updateClasses() {
    this.checkDisabled();
    this.checkDirty();
    this.checkFocus();
  }

  updateCounter() {
    if (this._counterValue) {
      let numChars = this._input.value.length;
      let remainingChars = this._maxChars - numChars;
      this._counterValue.innerHTML = remainingChars;

      if (remainingChars === 0) {
        this._element.classList.add(CLASS_IS_EQUAL_MAX_CHARS);
      } else {
        this._element.classList.remove(CLASS_IS_EQUAL_MAX_CHARS);
      }

      if (remainingChars < 0) {
        this._element.classList.add(CLASS_IS_GREATER_MAX_CHARS);
        this._element.classList.add(CLASS_IS_INVALID);
      } else {
        this._element.classList.remove(CLASS_IS_GREATER_MAX_CHARS);
        this._element.classList.remove(CLASS_IS_INVALID);
      }
    }
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
   * Resize textarea
   */
  adjustHeightToContent() {
    let htmlTop = window.pageYOffset;
    let bodyTop = document.body.scrollTop;
    let originalHeight = this._input.style.height;

    this._input.style.height = 'auto';
    if (this._input.scrollHeight === 0) {
      // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
      this._input.style.height = originalHeight;
      return;
    }
    this._input.style.height = `${this._input.scrollHeight + this._inputBorder}px`;

    // prevents scroll position jump
    document.documentElement.scrollTop = htmlTop;
    document.body.scrollTop = bodyTop;
  }

  /**
   * Disable text field.
   */
  disable() {
    this._input.disabled = true;
    this.updateClasses();
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();

    this._input.removeEventListener('input', this._inputHandler);
    this._input.removeEventListener('focus', this._focusHandler);
    this._input.removeEventListener('blur', this._blurHandler);
    this._input.removeEventListener('change', this._changeHandler);
    this._input.removeEventListener('reset', this._resetHandler);

    super.removeChild(this._element.querySelector(`.${CLASS_FOCUS_LINE}`));
    super.removeChild(this._element.querySelector(`.${CLASS_COUNTER}`));
  }

  /**
   * Event Handler
   */

  _onInput(event) {
    this.update();
  }

  _onFocus(event) {
    this.update();
  }

  _onBlur(event) {
    this.update();
  }

  _onChange(event) {
    this.update();
  }

  _onReset(event) {
    this.update();
  }

  _onKeyup(event) {
    this.updateCounter();
    if (this._autosize) {
      this.adjustHeightToContent();
    }
  }

  /**
   * Getter and Setter
   */

  get input() {
    return this._input;
  }

  get autoSize() {
    return this._autosize;
  }

  set autoSize(value) {
    return this._autosize = Boolean(value);
  }
}
