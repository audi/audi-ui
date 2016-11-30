import Component from '../component/component';
import transitionendEvent from '../util/transition-end-event';

const CLOSE_BUTTON_SIZE_SMALL = 45;
const CLOSE_BUTTON_SIZE_LARGE = 81;
const CLOSE_ICON_SIZE_SMALL = 17;
const CLOSE_ICON_SIZE_LARGE = 31;
const CLASS_BACKDROP = 'aui-modal-backdrop';
const CLASS_CLOSE = 'aui-modal-dialog__close';
const CLASS_IS_ACTIVE = 'is-active';

/**
 * Class constructor for ModalDialog AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class ModalDialog extends Component {

  /**
   * Initialize component
   */
  init() {
    super.init();

    this._body = document.querySelector('body');

    this._closeButton = this._element.querySelector(`.${CLASS_CLOSE}`);
    if (this._closeButton) {
      this._addCloseButton(this._closeButton);
    }
  }

  /**
   * Opens this modal.
   */
  open() {
    if (this._element.parentNode !== this._body) {
      this._body.appendChild(this._element);
    }
  }

  /**
   * Handle transition end event
   * @param {Event} event which was fired.
   */
  _onBackdropCloseTransitionend(event) {
    if (event.target === event.currentTarget) {
      this._backdrop.removeEventListener(transitionendEvent, this._backdropCloseTransitionendHandler);
      this._element.classList.remove(CLASS_IS_ACTIVE);
      this._removeBackdrop();
    }
  }

  /**
   * Adds a semi-transparent backdrop element behind the modal.
   */
  _addBackdrop() {
    if (!this._backdrop) {
      this._backdrop = document.createElement('div');
      this._backdrop.classList.add(CLASS_BACKDROP);
      this._body.appendChild(this._backdrop);
    }
  }

  /**
   * Removes the backdrop element behind modal.
   */
  _removeBackdrop() {
    if (this._backdrop) {
      this._body.removeChild(this._backdrop);
      this._backdrop = null;
    }
  }

  /**
   * Adds close button
   * @param {HTMLElement} container to append close icon to.
   */
  _addCloseButton(container) {
    let diagonalHalf = (Math.sqrt(2) * CLOSE_ICON_SIZE_SMALL) / 2;
    let btnSize = CLOSE_BUTTON_SIZE_SMALL;

    const small = this.createSvgNode(
      'svg', {
        class: 'aui-modal-close-icon-small',
        viewBox: `0 0 ${btnSize} ${btnSize}`
      });
    let group = this.createSvgNode(
      'g', {
        transform: `translate(${btnSize / 2}, ${btnSize / 2})`
      });
    group.appendChild(this.createSvgNode('line', {
      x1: '0',
      y1: -diagonalHalf,
      x2: '0',
      y2: diagonalHalf,
      stroke: 'currentColor',
      transform: 'rotate(-45, 0, 0)'
    }));
    group.appendChild(this.createSvgNode('line', {
      x1: '0',
      y1: -diagonalHalf,
      x2: '0',
      y2: diagonalHalf,
      stroke: 'currentColor',
      transform: 'rotate(45, 0, 0)'
    }));
    small.appendChild(group);
    container.appendChild(small);

    diagonalHalf = (Math.sqrt(2) * CLOSE_ICON_SIZE_LARGE) / 2;
    btnSize = CLOSE_BUTTON_SIZE_LARGE;
    const large = this.createSvgNode(
      'svg', {
        'class': 'aui-modal-close-icon-large',
        'viewBox': `0 0 ${btnSize} ${btnSize}`
      });
    group = this.createSvgNode(
      'g', {
        transform: `translate(${btnSize / 2}, ${btnSize / 2})`
      });
    group.appendChild(this.createSvgNode('line', {
      x1: '0',
      y1: -diagonalHalf,
      x2: '0',
      y2: diagonalHalf,
      stroke: 'currentColor',
      transform: 'rotate(-45, 0, 0)'
    }));
    group.appendChild(this.createSvgNode('line', {
      x1: '0',
      y1: -diagonalHalf,
      x2: '0',
      y2: diagonalHalf,
      stroke: 'currentColor',
      transform: 'rotate(45, 0, 0)'
    }));
    large.appendChild(group);
    container.appendChild(large);
  }
}
