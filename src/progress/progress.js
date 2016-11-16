import Component from '../component/component';
import limit from '../util/limit';

const SELECTOR_COMPONENT = '.aui-js-progress';
const CLASS_CONTINUOUS = 'aui-progress--continuous';
const CLASS_BAR = 'aui-progress__bar';
const CLASS_IS_PENDING = 'is-pending';
const CLASS_IS_LOADING = 'is-loading';
const CLASS_IS_COMPLETE = 'is-complete';

/**
 * Class constructor for Progress AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Progress extends Component {

  /**
   * Upgrades all Progress AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Progress(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._continuous = this._element.classList.contains(CLASS_CONTINUOUS);

    // Add bar elements:
    this._bar = document.createElement('span');
    this._bar.classList.add(CLASS_BAR);
    this._element.appendChild(this._bar);

    this.progress(0);
  }

  progress(ratio) {
    ratio = limit(ratio, 0, 1);
    this._progress = ratio;

    if (!this._continuous) {
      this._bar.style.width = `${this._progress * 100}%`;
    }

    this.updateClasses();
  }

  updateClasses() {
    if (this._progress === 0) {
      this._element.classList.add(CLASS_IS_PENDING);
    } else {
      this._element.classList.remove(CLASS_IS_PENDING);
    }

    if (this._progress > 0 && this._progress < 1) {
      this._element.classList.add(CLASS_IS_LOADING);
    } else {
      this._element.classList.remove(CLASS_IS_LOADING);
    }

    if (this._progress === 1) {
      this._element.classList.add(CLASS_IS_COMPLETE);
    } else {
      this._element.classList.remove(CLASS_IS_COMPLETE);
    }
  }
}
