import Component from '../component/component';
import ResizeObserver from '../util/resize-observer';

const SELECTOR_COMPONENT = '.aui-js-breadcrumb';
const CLASS_ITEMS = 'aui-breadcrumb__items';
const CLASS_IS_OVERSIZED = 'is-oversized';

/**
 * Class constructor for Breadcrumb AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Breadcrumb extends Component {

  /**
   * Upgrades all Breadcrumb AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Breadcrumb(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._items = this._element.querySelector(`.${CLASS_ITEMS}`);

    this._resizeObserver = new ResizeObserver();
    this._resizeObserver.resized.add(this._resizedHandler = () => this.update());

    this.update();
  }

  update() {
    this._checkSize();
  }

  dispose() {
    super.dispose();

    this._resizeObserver.resized.remove(this._resizedHandler);
  }

  _checkSize() {
    if (this._items.scrollWidth > this._items.offsetWidth) {
      this._items.scrollLeft = 9999;
      this._element.classList.add(CLASS_IS_OVERSIZED);
    } else {
      this._element.classList.remove(CLASS_IS_OVERSIZED);
    }
  }
}
