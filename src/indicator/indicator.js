import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-indicator';
const CLASS_ITEM = 'aui-indicator__action';
const CLASS_INDICATOR = 'aui-indicator__indicator';
const CLASS_IS_ACTIVE = 'is-active';

/**
 * Class constructor for Indicator AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Indicator extends Component {

  /**
   * Upgrades all Indicator AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Indicator(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._items = Array.from(this._element.querySelectorAll(`.${CLASS_ITEM}`));

    this._indicator = document.createElement('span');
    this._indicator.classList.add(CLASS_INDICATOR);
    this._element.appendChild(this._indicator);

    this._element.addEventListener('click', this.clickHandler = (event) => this._onClick(event));
  }

  _onClick(event) {
    if (!event.target.classList.contains(CLASS_ITEM)) {
      return;
    }
    event.preventDefault();

    this._items.forEach(item => {
      item.classList.remove(CLASS_IS_ACTIVE);
    });
    event.target.classList.add(CLASS_IS_ACTIVE);

    // Indicator position
    let rectContainer = this._element.getBoundingClientRect();
    let rectTarget = event.target.getBoundingClientRect();
    let indicatorLeft = rectTarget.left - rectContainer.left;
    this._indicator.style.left = `${indicatorLeft}px`;
  }
}
