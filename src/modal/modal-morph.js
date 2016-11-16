// TODO Close morph transition is not correct in Safari. Dialog jumps to the
// top left corner and then closes.

// TODO Dialogs doesn't have the correct height and position in IE10-11.
// Some workarounds to consider
// http://codepen.io/philipwalton/pen/JdvdJE?editors=0100
// http://stackoverflow.com/questions/19371626/flexbox-not-centering-vertically-in-ie

import ModalDialog from '../modal/modal-dialog';
import transitionendEvent from '../util/transition-end-event';

const CLASS_MODAL_IS_OPEN = 'aui-modal-open';
const CLASS_MORPH_CONTENT = 'aui-modal__morph-content';
const CLASS_MORPH_BODY = 'aui-modal__morph-body';
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

    this._morphContent = this._element.querySelector(`.${CLASS_MORPH_CONTENT}`);
    this._morphBody = this._element.querySelector(`.${CLASS_MORPH_BODY}`);
  }

  /**
   * Opens this modal.
   * @param {HTMLElement} trigger The element which opens the modal.
   */
  open(trigger) {
    super.open();
    this._trigger = trigger;

    // Make modal element visible
    this._element.classList.add(CLASS_IS_ACTIVE);
    this._element.scrollTop = 0;
    this._addBackdrop();

    window.requestAnimationFrame(() => this._prepareOpenTransition());
  }

  _prepareOpenTransition() {
    // Loops until modal is really visible.
    // That's required to make transitions work as aspected.
    if (this._element.offsetWidth > 0) {
      // Save bounding rect of element to be morphed.
      this._endBoundingRect = this._morphBody.getBoundingClientRect();

      // Apply start bounding rect to element to be morphed.
      this._triggerBoundingRect = this._trigger.getBoundingClientRect();
      this._applyBoundingRectToElement(this._morphBody, this._triggerBoundingRect);

      // Start opening animation
      window.requestAnimationFrame(() => this._startOpenTransition());

    } else {
      window.requestAnimationFrame(() => this._prepareOpenTransition());
    }
  }

  _startOpenTransition() {
    let rect = this._morphBody.getBoundingClientRect();
    if (Math.round(this._triggerBoundingRect.width) === rect.width) {
      this._body.classList.add(CLASS_MODAL_IS_OPEN);
      this._morphContent.classList.add(CLASS_IS_MORPHING);

      // Apply end bounding rect to element to be morphed.
      this._applyBoundingRectToElement(this._morphBody, this._endBoundingRect);
      transitionendEvent && this._morphBody.addEventListener(transitionendEvent, this._morphBodyTransitionendHandler = (event) => this._onStartOpenTransitionend(event));

    } else {
      window.requestAnimationFrame(() => this._startOpenTransition());
    }
  }

  _onStartOpenTransitionend(event) {
    if (event.target === event.currentTarget) {
      console.log('morphing end');
      this._morphBody.removeEventListener(transitionendEvent, this._morphBodyTransitionendHandler);
      this._morphBody.removeAttribute('style');
      this._morphContent.classList.remove(CLASS_IS_MORPHING);
    }
  }

  /**
   * Closes this modal.
   */
  close() {
    this._morphBody.removeEventListener(transitionendEvent, this._morpBodyCloseTransitionendHandler);
    if (this._backdrop) {
      this._backdrop.removeEventListener(transitionendEvent, this._backdropCloseTransitionendHandler);
    }

    const boundingRect = this._morphBody.getBoundingClientRect();
    this._applyBoundingRectToElement(this._morphBody, boundingRect);
    this._morphContent.classList.add(CLASS_IS_MORPHING);

    window.requestAnimationFrame(() => this._startCloseTransition());
  }

  _startCloseTransition() {
    // Apply start bounding rect to element to be morphed.
    this._triggerBoundingRect = this._trigger.getBoundingClientRect();
    this._applyBoundingRectToElement(this._morphBody, this._triggerBoundingRect);
    transitionendEvent && this._morphBody.addEventListener(transitionendEvent, this._morpBodyCloseTransitionendHandler = (event) => this._onMorpBodyCloseTransitionend(event));

    if (this._backdrop) {
      transitionendEvent && this._backdrop.addEventListener(transitionendEvent, this._backdropCloseTransitionendHandler = (event) => this._onBackdropCloseTransitionend(event));
    }

    this._body.classList.remove(CLASS_MODAL_IS_OPEN);
  }

  _onMorpBodyCloseTransitionend(event) {
    if (event.target === event.currentTarget) {
      this._morphBody.removeEventListener(transitionendEvent, this._morpBodyCloseTransitionendHandler);
      this._morphBody.removeAttribute('style');
      this._morphContent.classList.remove(CLASS_IS_MORPHING);
    }
  }

  _applyBoundingRectToElement(element, rect) {
    element.style.top = `${Math.round(rect.top)}px`;
    element.style.left = `${Math.round(rect.left)}px`;
    element.style.width = `${Math.round(rect.width)}px`;
    element.style.minWidth = `${Math.round(rect.width)}px`;
    element.style.maxWidth = `${Math.round(rect.width)}px`;
    element.style.height = `${Math.round(rect.height)}px`;
    element.style.minHeight = `${Math.round(rect.height)}px`;
    element.style.maxHeight = `${Math.round(rect.height)}px`;
  }
}
