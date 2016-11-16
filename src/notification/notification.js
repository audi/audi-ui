import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-notification';
const CLASS_CONTENT = 'aui-notification__content';
const CLASS_CLOSE_BUTTON = 'aui-notification__close';
const CLASS_IS_CLOSED = 'is-closed';
const CLASS_IS_OPEN = 'is-open';
const ATTR_CLOSE = 'data-close';

/**
 * Class constructor for Notification AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Notification extends Component {

  /**
   * Upgrades all Notification AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Notification(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._content = this._element.querySelector(`.${CLASS_CONTENT}`);
    if (!this._content) {
      this._content = document.createElement('div');
      this._content.classList.add(CLASS_CONTENT);
      this._element.appendChild(this._content);
    }

    // Add close button
    this._closeButton = document.createElement('button');
    this._closeButton.setAttribute('type', 'button');
    this._closeButton.classList.add(CLASS_CLOSE_BUTTON);
    this._element.appendChild(this._closeButton);

    this.open();
  }

  open() {
    this._element.addEventListener('click', this._clickHandler = (event) => this._onClick(event));
    this.checkOpeningPreparation();
  }

  checkOpeningPreparation() {
    clearTimeout(this.openingTimeout);
    this._element.classList.add(CLASS_IS_OPEN);
    this._element.classList.remove(CLASS_IS_CLOSED);
  }

  close() {
    this._element.removeEventListener('click', this._clickHandler);
    this._element.style.height = `${this._element.offsetHeight}px`;
    this._element.style.marginTop = '0px';
    this._element.style.marginBottom = '0px';
    this.checkClosingPreparation();
  }

  checkClosingPreparation() {
    clearTimeout(this.openingTimeout);
    if (window.getComputedStyle(this._element).height && this._element.style.height) {
      this._element.classList.remove(CLASS_IS_OPEN);
      this._element.classList.add(CLASS_IS_CLOSED);
    } else {
      window.requestAnimationFrame(() => this.checkClosingPreparation());
    }
  }

  _onClick(event) {
    if (event.target.classList.contains(CLASS_CLOSE_BUTTON) || event.target.hasAttribute(ATTR_CLOSE)) {
      this.close();
    }
  }
}
