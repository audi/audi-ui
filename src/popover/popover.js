import Component from '../component/component';
import reflow from '../util/reflow';
import closest from '../util/closest';
import transitionend from '../util/transition-end-event';
import Tether from 'tether';

const SELECTOR_COMPONENT = '.aui-js-popover';
const SELECTOR_DISMISS = '[data-dismiss="popover"]';
const CLASS_ARROW = 'aui-popover__arrow';
const CLASS_ARROW_SHAPE = 'aui-popover__arrow-shape';
const CLASS_ACTIVE = 'is-active';
const CLASS_SHOWN = 'is-shown';
const CLASS_POPOVER_IS_OPEN = 'aui-popover-is-open';
const ARROW_SIZE = 20;

const AttachmentMap = {
  top: 'bottom center',
  right: 'middle left',
  bottom: 'top center',
  left: 'middle right'
}

/**
 * Class constructor for Popover AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Popover extends Component {

  /**
   * Upgrades all Popover AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Popover(element));
      }
    });
    return components;
  };

  /**
   * Initialize component
   */
  init() {
    super.init();

    this._body = document.querySelector('body');

    this._id = this._element.getAttribute('id');
    this._trigger = document.getElementById(this._element.getAttribute('for'));
    this._tether = null;
    const placement = this._element.hasAttribute('data-placement') ? this._element.getAttribute('data-placement') : 'top';
    this._attachement = AttachmentMap[placement.toLowerCase()];

    const content = this._element.querySelector('.aui-popover__content');
    const arrowColor = this._element.hasAttribute('data-arrow-color') ? this._element.getAttribute('data-arrow-color') : window.getComputedStyle(content).backgroundColor;
    this._arrow = this._addArrow(content, arrowColor);

    if (this._trigger) {
      this._trigger.addEventListener('click', this._boundClickHandler = (event) => this.toggle(event));
    }
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();

    this.hide();
    this.removeChild(this._arrow);

    if (this._trigger) {
      this._trigger.removeEventListener('click', this._boundClickHandler);
    }
  }

  /**
   * Toggle show/hide Popover
   * @param {Event} event Click event of trigger element (optional)
   */
  toggle(event) {
    const performToggle = () => {
      if (!this._element.classList.contains(CLASS_ACTIVE) && this._tether) {
        this.show();
      } else {
        this.hide();
      }
    };

    if (event) {
      event.preventDefault();

      if (this._tether === null) {
        this._tether = new Tether({
          element: this._element,
          target: event.currentTarget,
          attachment: this._attachement,
          classPrefix: 'aui-tether',
          // NOTE We set an offset in CSS, because this offset wouln't be
          // flipped as it should:
          // https://github.com/HubSpot/tether/issues/106
          offset: '0 0',
          constraints: [{
            to: 'window',
            pin: ['left', 'right'],
            attachment: 'together'
          }],
          optimizations: {
            gpu: false
          }
        });
        reflow(this._element); // REVIEW Do we need this anymore?
        this._tether.position();
      }
      performToggle();

    } else {
      performToggle();
    }
  }

  /**
   * Show Popover
   */
  show() {
    this._body.classList.add(CLASS_POPOVER_IS_OPEN);
    this._element.classList.add(CLASS_ACTIVE);
    this._element.classList.add(CLASS_SHOWN);
    setTimeout(() => {
      window.addEventListener('click', this._boundWindowClickHandler = (event) => this._onClickOutside(event));
    })
  }

  /**
   * Hide Popover
   */
  hide() {
    this._element.classList.remove(CLASS_SHOWN);
    this._element.addEventListener(transitionend, this._boundAnimationendHandler = (event) => this._onHideComplete(event));
    window.removeEventListener('click', this._boundWindowClickHandler);
  }

  /**
   * Clean up Tether instance
   * @private
   */
  _cleanupTether() {
    if (this._tether) {
      this._tether.destroy();
      this._tether = null;
    }
    this._element.removeAttribute('style');
  }

  /**
   * Handle click of window.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClickOutside(event) {
    // Hide if target dismisses Popover
    if (closest(event.target, SELECTOR_DISMISS, this._element)) {
      this.hide();

      // Hide if target is not inside Popover and is not a trigger element
    } else if (!this._element.contains(event.target) && event.target !== this._trigger) {
      this.hide();
    }
  }

  /**
   * Handle hide transition complete.
   * @param {Event} event The event that fired.
   * @private
   */
  _onHideComplete(event) {
    this._body.classList.remove(CLASS_POPOVER_IS_OPEN);
    this._element.classList.remove(CLASS_ACTIVE);
    this._element.removeEventListener(transitionend, this._boundAnimationendHandler);
    this._cleanupTether();
  }

  /**
   * Adds an arrow SVG element
   * <span class="…"><svg … ><path … /></svg></span>
   *
   * @param {HTMLElement} parent element to append arrow to.
   * @param {string} color used as value of fill property.
   * @returns {HTMLElement} the added arrow element.
   */
  _addArrow(parent, color) {
    const element = document.createElement('span');
    element.classList.add(CLASS_ARROW);
    const svg = this.createSvgNode('svg', {
      class: CLASS_ARROW_SHAPE,
      width: ARROW_SIZE,
      height: ARROW_SIZE,
      viewBox: `0 0 ${ARROW_SIZE} ${ARROW_SIZE}`
    });
    // Draw a diamond square ◆
    const path = this.createSvgNode('path', {
      d: `M${ARROW_SIZE / 2} 0 L ${ARROW_SIZE} ${ARROW_SIZE / 2} L ${ARROW_SIZE / 2} ${ARROW_SIZE} L 0 ${ARROW_SIZE / 2} Z`,
      fill: color
    });
    svg.appendChild(path);
    element.appendChild(svg);
    parent.appendChild(element);
    return element;
  }
}
