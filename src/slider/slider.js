/**
 * NOTE Slider AUI components rely on the 3rd party library noUiSlider.
 * @see https://github.com/leongersen/noUiSlider
 */

import Component from '../component/component';
import limit from '../util/limit';
import mapLinear from '../util/map-linear';
import ResizeObserver from '../util/resize-observer';
import noUiSlider from 'nouislider';

const SELECTOR_COMPONENT = '.aui-js-slider';
const SELECTOR_HIDDEN_FIELD = '.aui-slider__hidden-field';
const SELECTOR_OUTPUT = '.aui-slider__output';
const CLASS_COMPONENT = 'aui-slider';
const CLASS_IS_DISABLED = 'is-disabled';
const EVENT_NAMESPACE = CLASS_COMPONENT;

/**
 * Class constructor for Slider AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Slider extends Component {

  /**
   * Upgrades all Slider AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Slider(element));
      }
    });
    return components;
  };

  /**
   * Initialize component
   */
  init() {
    super.init();

    // Save reference to component elements
    this._hiddenField = this._element.querySelector(SELECTOR_HIDDEN_FIELD);
    this._output = this._element.querySelector(SELECTOR_OUTPUT);

    // Create slider container element
    this._slider = document.createElement('div');
    this._element.insertBefore(this._slider, this._element.firstChild);

    // Parse and save start and range values:
    this._value = this._parseData(this._hiddenField.value);
    this._rangeMin = this._parseData(this._element.getAttribute('data-min'));
    this._rangeMax = this._parseData(this._element.getAttribute('data-max'));

    // Create noUiSlider instance
    noUiSlider.create(this._slider, {
      // Set the start value defined in the hidden field.
      // https://refreshless.com/nouislider/slider-options/#section-start
      start: this._value,

      // Set the range as defined in the data attributes
      // https://refreshless.com/nouislider/slider-values/#section-range
      range: {
        min: this._rangeMin,
        max: this._rangeMax
      },

      // If there are two handles, set the bar between the handles, but not
      // between the handles and the sliders edges. If there is only one handle,
      // set the bar from the slider edge to the handle.
      // https://refreshless.com/nouislider/slider-options/#section-Connect
      connect: this._value.length > 1
        ? true
        : [true, false],

      // Define behaviour depending on number of handles
      // https://refreshless.com/nouislider/behaviour-option/
      behaviour: this._value.length > 1
        ? 'tap-drag'
        : 'tap',

      // Use AUI namespace for css classes
      // https://refreshless.com/nouislider/more/#section-styling
      cssPrefix: `${CLASS_COMPONENT}__`
    });
    this._slider.noUiSlider.on(`update.${EVENT_NAMESPACE}`, (values, handle, unencoded, tap, positions) => this._onUpdate(values, handle, unencoded, tap, positions));

    if (this._output) {
      this._resizeObserver = new ResizeObserver();
      this._resizeObserver.resized.add(this._resizedHandler = () => this._centerOutput());
    }

    if (this._element.classList.contains(CLASS_IS_DISABLED)) {
      this.disable();
    }
  }

  /**
   * Dispose component
   */
  dispose() {
    if (this._slider) {
      this._slider.noUiSlider.off(`.${EVENT_NAMESPACE}`);
    }
    if (this._resizeObserver) {
      this._resizeObserver.resized.remove(this._resizedHandler);
      this._resizeObserver = null;
    }
  }

  /**
   * Enable component
   */
  enable() {
    this._element.classList.remove(CLASS_IS_DISABLED);
    this._slider.removeAttribute('disabled');
  }

  /**
   * Disable component
   */
  disable() {
    this._element.classList.add(CLASS_IS_DISABLED);
    this._slider.setAttribute('disabled', true);
  }

  /**
   * Handle on update
   * @param {Array} values Current slider values
   * @param {Integer} handle Handle that caused the event 0 or 1
   * @param {Array} unencoded Slider values without formatting
   * @param {boolean} tap Event was caused by the user tapping the slider
   * @param {Array} positions Left offset of the handles in relation to the slider
   */
  _onUpdate(values, handle, unencoded, tap, positions) {
    if (this._hiddenField) {
      this._hiddenField.value = unencoded;
    }

    // Position output to center of slider handles
    if (this._output) {
      this._output.innerHTML = values.length > 1
        ? `${values[0]} to ${values[1]}`
        : `${values[0]}`;
      this._centerOutput();
    }
  }

  /**
   * Center output bewteen handles.
   */
  _centerOutput() {
    const unencoded = this._slider.noUiSlider.get();
    const sliderAverage = typeof unencoded === 'object'
      ? unencoded.reduce((previousValue, currentValue) => {
          return previousValue + parseFloat(currentValue);
        }, 0) / unencoded.length
      : parseFloat(unencoded);
    const maxRight = this._element.offsetWidth - this._output.offsetWidth;
    const handleSize = this._slider.offsetHeight;
    const position = mapLinear(sliderAverage, this._rangeMin, this._rangeMax, 0, 1) * this._slider.offsetWidth - this._output.offsetWidth / 2 + handleSize / 2;
    this._output.style.left = `${limit(position, 0, maxRight)}px`;
  }

  /**
   * Parse data to use with noUiSlider
   * Returns given value as array of floats
   * "0,100" => [0,100]
   * @param {string} value Current slider values
   * @returns {Array} values as floats
   */
  _parseData(value) {
    return value && value.split(',').map(element => parseFloat(element));
  }
}
