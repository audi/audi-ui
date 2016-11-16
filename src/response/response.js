import Component from '../component/component';
import animationEndEvent from '../util/animation-end-event';

const SELECTOR_COMPONENT = '.aui-js-response';
const CLASS_BUTTON_PRIMARY = 'aui-button--primary';
const CLASS_BUTTON_SECONDARY = 'aui-button--secondary';
const CLASS_BUTTON_ICON = 'aui-button--icon';
const CLASS_BUTTON_FLOATING = 'aui-button--floating';
const CLASS_RESPONSE = 'aui-response';
const CLASS_RESPONSE_MASKED = 'aui-response--masked';
const CLASS_EFFECT = 'aui-response__effect';
const CLASS_EFFECT_LARGE = 'aui-response__effect--large';
const CLASS_IS_ANIMATING = 'is-animating';
const CLASS_IS_DISABLED = 'is-disabled';

/**
 * Class constructor for Response AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Response extends Component {

  /**
   * Upgrades all Response AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Response(element));
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
  }

  /**
   * Initialize component
   */
  init() {
    super.init();

    let boxedButton = this._element.classList.contains(CLASS_BUTTON_PRIMARY) || this._element.classList.contains(CLASS_BUTTON_SECONDARY) || this._element.classList.contains(CLASS_BUTTON_FLOATING);

    this._useTriggerX = boxedButton || !this._element.classList.contains(CLASS_BUTTON_ICON);
    this._useTriggerY = boxedButton;
    this._masked = boxedButton;
    this._large = boxedButton;

    this._responseContainer = document.createElement('span');
    this._responseContainer.classList.add(CLASS_RESPONSE);
    if (this._masked) {
      this._responseContainer.classList.add(CLASS_RESPONSE_MASKED);
    }
    this._element.appendChild(this._responseContainer);

    this._responseEffect = document.createElement('span');
    this._responseEffect.classList.add(CLASS_EFFECT);
    if (this._large) {
      this._responseEffect.classList.add(CLASS_EFFECT_LARGE);
    }
    this._responseContainer.appendChild(this._responseEffect);

    this._element.addEventListener('mousedown', this._mousedownHandler = (event) => this._onMousedown(event));
    animationEndEvent && this._responseEffect.addEventListener(animationEndEvent, this._animationendHandler = (event) => this._onAnimationend(event));
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();

    this._element.removeEventListener('mousedown', this._mousedownHandler);
    if (animationEndEvent && this._responseEffect) {
      this._responseEffect.removeEventListener(animationEndEvent, this._animationendHandler);
    }
    this._element.removeChild(this._responseContainer);
  }

  /**
   * Handle mousedown of element.
   * @param {Event} event The event that fired.
   * @private
   */
  _onMousedown(event) {
    // Get cross-browser offsetX, offsetY
    let target = event.currentTarget || event.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = event.clientX - rect.left,
      offsetY = event.clientY - rect.top;

    if (!target.classList.contains(CLASS_IS_DISABLED)) {
      this._responseEffect.style.left = this._useTriggerX ? `${offsetX}px` : '50%';
      this._responseEffect.style.top = this._useTriggerY ? `${offsetY}px` : '50%';
      this._responseContainer.classList.add(CLASS_IS_ANIMATING);
    }
  }

  /**
   * Handle animationend of element.
   * @param {Event} event The event that fired.
   * @private
   */
  _onAnimationend(event) {
    this._responseContainer.classList.remove(CLASS_IS_ANIMATING);
  }
}
