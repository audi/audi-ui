import Component from '../component/component';
import clamp from '../util/clamp';

const SELECTOR_COMPONENT = '.aui-js-indicator';
const CLASS_ITEM = 'aui-indicator__item';
const CLASS_ACTION = 'aui-indicator__action';
const CLASS_TRIGGER = 'aui-indicator__trigger';
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

    this._actions = Array.from(this._element.querySelectorAll(`.${CLASS_ACTION}`));
    this._triggers = Array.from(this._element.querySelectorAll(`.${CLASS_TRIGGER}`));
    this._listItems = Array.from(this._element.querySelectorAll(`.${CLASS_ITEM}`));

    this._indicator = document.createElement('span');
    this._indicator.classList.add(CLASS_INDICATOR);
    this._element.appendChild(this._indicator);

    this._element.addEventListener('click', this.clickHandler = (event) => this._onClick(event));
  }

  /**
   * Handle click.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClick(event) {
    if (!event.target.classList.contains(CLASS_TRIGGER)) {
      return;
    }
    event.preventDefault();

    this.selectAction(event.target);
  }

  /**
   * Select item with given action element.
   * @param {HTMLElement} actionElement Action child element of the list item to select.
   * @private
   */
  selectAction(actionElement) {
    if (actionElement) {
      // Find index
      const listItem = actionElement.parentNode;
      const index = this._listItems.indexOf(listItem);
      this.select(index);
    }
  }

  /**
   * Select item.
   * @param {Integer} index Zero-based index of the list item to select.
   * @private
   */
  select(index = 0) {
    index = clamp(index, 0, this._actions.length - 1);
    const activeItem = this._actions[index];

    // Update actions
    this._actions.forEach(item => {
      item.classList.remove(CLASS_IS_ACTIVE);
    });
    activeItem.classList.add(CLASS_IS_ACTIVE);

    // Update indicator position
    const rectContainer = this._element.getBoundingClientRect();
    const rectTarget = activeItem.getBoundingClientRect();
    const indicatorLeft = rectTarget.left - rectContainer.left;
    this._indicator.style.left = `${indicatorLeft}px`;
  }
}
