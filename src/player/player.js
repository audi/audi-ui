import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-player';
const SELECTOR_PROGRESS_CONTROL = '.aui-player__progress-control';
const SELECTOR_SEEK_HOLDER = '.aui-player__seek-holder';
const SELECTOR_PREVIEW = '.aui-player__preview';
const CLASS_SEEKING = 'is-seeking';

/**
 * Class constructor for Player AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Player extends Component {

  /**
   * Upgrades all Player AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Player(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);

    this._progressControl = this._element.querySelector(SELECTOR_PROGRESS_CONTROL);
    if (this._progressControl) {
      this._progressControl.addEventListener('mouseover', this.progressControlOverListener = event => this.progressControlOverHandler(event));
      this._progressControl.addEventListener('mouseout', this.progressControlOutListener = event => this.progressControlOutHandler(event));

      this._seekHolder = this._progressControl.querySelector(SELECTOR_SEEK_HOLDER);
    }

    this._preview = this._element.querySelector(SELECTOR_PREVIEW);
  }

  progressControlOverHandler(event) {
    this._progressControl.removeEventListener('mousemove', this.moveListener);
    this._progressControl.addEventListener('mousemove', this.progressControlMoveListener = event => this.progressControlMoveHandler(event));
    this._element.classList.add(CLASS_SEEKING);
    this.updateSeek(event.clientX);
  }

  progressControlMoveHandler(event) {
    this.updateSeek(event.clientX);
  }

  progressControlOutHandler(event) {
    this._element.classList.remove(CLASS_SEEKING);
  }

  updateSeek() {
    // Translate trigger position x to ratio of progress control width
    let boundings = this._progressControl.getBoundingClientRect(),
      offsetX = event.clientX - boundings.left,
      ratio = offsetX / this._progressControl.offsetWidth,
      ratioPercentStr;
    ratio = Math.max(0, Math.min(ratio, 1));
    ratioPercentStr = `${ratio * 100}%`
    this._seekHolder.style.width = ratioPercentStr;
  }
}
