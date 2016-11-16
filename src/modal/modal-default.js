import ModalDialog from '../modal/modal-dialog';
import ResizeObserver from '../util/resize-observer';
import transitionendEvent from '../util/transition-end-event';

const CLASS_MODAL_IS_OPEN = 'aui-modal-open';
const CLASS_WINDOW = 'aui-modal-dialog--window';
const CLASS_DIALOG_BODY = 'aui-modal-dialog__body';
const CLASS_IS_ACTIVE = 'is-active';

/**
 * Class constructor for ModalDefault AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class ModalDefault extends ModalDialog {

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

    // If dialog acts as window, we have to reposition the close button to
    // stick with the dialog.
    if (this._element.querySelector(`.${CLASS_WINDOW}`) && this._closeButton) {
      if (this._resizeObserver === undefined) {
        this._resizeObserver = new ResizeObserver();
        this._dialogBody = this._element.querySelector(`.${CLASS_DIALOG_BODY}`);
      }
      this._resizeObserver.resized.add(this._resizedHandler = () => this._repositionCloseButton());
      this._repositionCloseButton();
    }

    window.requestAnimationFrame(() => this._prepareOpenTransition());
  }

  /**
   * Prepare the open transition.
   */
  _prepareOpenTransition() {
    // Loops until modal is really visible.
    // That's required to make transitions work as aspected.
    if (this._element.offsetWidth > 0) {

      // Start opening animation
      this._body.classList.add(CLASS_MODAL_IS_OPEN);

    } else {
      window.requestAnimationFrame(() => this._prepareOpenTransition());
    }
  }

  /**
   * Closes this modal.
   */
  close() {
    if (this._backdrop) {
      this._backdrop.removeEventListener(transitionendEvent, this._backdropCloseTransitionendHandler);
      transitionendEvent && this._backdrop.addEventListener(transitionendEvent, this._backdropCloseTransitionendHandler = (event) => this._onBackdropCloseTransitionend(event));
    }

    if (this._resizeObserver) {
      this._resizeObserver.resized.remove(this._resizedHandler);
    }

    this._body.classList.remove(CLASS_MODAL_IS_OPEN);
  }

  /**
   * Reposition close button with dialog
   */
  _repositionCloseButton() {
    const rect = this._dialogBody.getBoundingClientRect();
    const right = rect.right - rect.width;
    // Only reposition if the window is positioned center, otherwise respect
    // CSS styling:
    if (right > 0) {
      this._closeButton.style.right = `${right}px`;
    } else {
      this._closeButton.style.right = '';
    }
  }
}
