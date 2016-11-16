import Component from '../component/component';
import ResizeObserver from '../util/resize-observer';

const SELECTOR_COMPONENT = '.aui-js-pagination';
const CLASS_ITEM = 'aui-pagination__link';
const CLASS_INDICATOR = 'aui-pagination__indicator';
const CLASS_IS_ACTIVE = 'is-active';
const CLASS_IS_ANIMATED = 'is-animated';
const CLASS_IS_DISABLED = 'is-disabled';

/**
 * Class constructor for Pagination AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Pagination extends Component {

  /**
   * Upgrades all Pagination AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Pagination(element));
      }
    });
    return components;
  };

  /**
   * Initialize component
   */
  init() {
    super.init();

    this._resizeObserver = new ResizeObserver();
    this._resizeObserver.resized.add(this._boundResized = () => this.update());

    this._items = Array.from(this._element.querySelectorAll(`.${CLASS_ITEM}`));

    this._indicator = document.createElement('span');
    this._indicator.classList.add(CLASS_INDICATOR);
    this._element.appendChild(this._indicator);

    this._element.addEventListener('click', this._boundClick = (event) => this._onClick(event));

    this._repositionIndicator(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));
    setTimeout(() => {
      this._element.classList.add(CLASS_IS_ANIMATED);
    }, 250);
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();

    this._element.classList.remove(CLASS_IS_ANIMATED);

    this._element.removeEventListener('click', this._boundClick);
    this._resizeObserver.resized.remove(this._boundResized);

    if (this._indicator) {
      this.removeChild(this._indicator);
    }
  }

  /**
   * Update component.
   */
  update() {
    this._repositionIndicator(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));
  }

  /**
   * Reposition indicator of `active` page.
   * @param {HTMLElement} linkElement that is going to be `active`.
   * @private
   */
  _repositionIndicator(linkElement) {
    if (!linkElement)
      return;

    this._items.forEach(item => {
      item.classList.remove(CLASS_IS_ACTIVE);
    });
    linkElement.classList.add(CLASS_IS_ACTIVE);

    // Indicator position
    const rectContainer = this._element.getBoundingClientRect();
    const rectTarget = linkElement.getBoundingClientRect();
    const indicatorLeft = rectTarget.left - rectContainer.left + this._element.scrollLeft;
    this._indicator.style.left = `${indicatorLeft}px`;
    this._indicator.style.width = `${linkElement.offsetWidth}px`;
  }

  /**
   * Handle click.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClick(event) {
    if (event.target.classList.contains(CLASS_ITEM) && !event.target.classList.contains(CLASS_IS_DISABLED)) {
      this._repositionIndicator(event.target);
    }
  }
}
