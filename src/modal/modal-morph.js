import ModalDialog from '../modal/modal-dialog';
import transitionendEvent from '../util/transition-end-event';

const CLASS_MODAL_IS_OPEN = 'aui-modal-open';
const CLASS_CONTENT = 'aui-modal-dialog__content';
const CLASS_MORPH_DIALOG = 'aui-modal-morph';
const CLASS_IS_ACTIVE = 'is-active';
const CLASS_IS_MORPHING = 'is-morphing';

/**
 * Class constructor for ModalMorph AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class ModalMorph extends ModalDialog {

  /**
   * Initialize component
   */
  init() {
    super.init();

    this._content = this._element.querySelector(`.${CLASS_CONTENT}`);
  }

  /**
   * Open modal
   * @param {HTMLElement} trigger The element which opens the modal.
   */
  open(trigger) {
    console.log('Open morphing modal');
    super.open();
    this._trigger = trigger;

    // Make modal element visible
    this._element.classList.add(CLASS_IS_ACTIVE);
    this._element.scrollTop = 0;
    this._addBackdrop();

    window.requestAnimationFrame(() => this._prepareOpenTransition());
  }

  _prepareOpenTransition() {
    const rect = this._trigger.getBoundingClientRect();

    // Apply bounding rect to start with to morphing element
    this._morph = this._getMorphElement(rect);

    // Start opening animation
    window.requestAnimationFrame(() => this._startOpenTransition());
  }

  _startOpenTransition() {
    const rect = this._content.getBoundingClientRect();

    // Apply bounding rect to end on to morphing element
    this._applyBoundingRectToElement(this._morph, rect);
    transitionendEvent && this._element.addEventListener(transitionendEvent, this._boundTransitionendElementIn = (event) => this._onTransitionendElementIn(event));
    this._morph.classList.add(CLASS_IS_MORPHING);
    this._body.classList.add(CLASS_MODAL_IS_OPEN);
  }

  _onTransitionendElementIn(event) {
    this._element.removeEventListener(transitionendEvent, this._boundTransitionendElementIn);
    this._morph.classList.remove(CLASS_IS_MORPHING);
  }

  /**
   * Close modal
   */
  close() {
    console.log('close');
    if (this._backdrop) {
      this._backdrop.removeEventListener(transitionendEvent, this._backdropCloseTransitionendHandler);
      transitionendEvent && this._backdrop.addEventListener(transitionendEvent, this._backdropCloseTransitionendHandler = (event) => this._onBackdropCloseTransitionend(event));
    }

    this._element.removeEventListener(transitionendEvent, this._boundTransitionendElementIn);

    const rect = this._content.getBoundingClientRect();
    this._applyBoundingRectToElement(this._morph, rect);
    this._morph.classList.add(CLASS_IS_MORPHING);

    transitionendEvent && this._morph.addEventListener(transitionendEvent, this._boundTransitionendMorphOut = (event) => this._onTransitionendMorphOut(event));

    window.requestAnimationFrame(() => this._startCloseTransition());
  }

  _startCloseTransition() {
    const rect = this._trigger.getBoundingClientRect();
    this._applyBoundingRectToElement(this._morph, rect);

    this._body.classList.remove(CLASS_MODAL_IS_OPEN);
  }

  _onTransitionendMorphOut(event) {
    this._morph.removeEventListener(transitionendEvent, this._boundTransitionendMorphOut);
    this.removeChild(this._morph);
    this._morph = null;
  }

  _onMorpBodyCloseTransitionend(event) {
    if (event.target === event.currentTarget) {
      this._morphBody.removeEventListener(transitionendEvent, this._morpBodyCloseTransitionendHandler);
      this._morphBody.removeAttribute('style');
      this._content.classList.remove(CLASS_IS_MORPHING);
    }
  }

  _applyBoundingRectToElement(element, rect) {
    element.style.top = `${Math.round(rect.top + window.pageYOffset)}px`;
    element.style.left = `${Math.round(rect.left)}px`;
    element.style.width = `${Math.round(rect.width)}px`;
    element.style.height = `${Math.round(rect.height)}px`;
  }

  _getMorphElement(rect) {
    if (!this._morph) {
      this._morph = this.createElement('div', [CLASS_MORPH_DIALOG]);
      this._applyBoundingRectToElement(this._morph, rect);
      this._body.append(this._morph);
    }
    return this._morph;
  }
}
