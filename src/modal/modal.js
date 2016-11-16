import Component from '../component/component';
import ModalDefault from '../modal/modal-default';
import ModalMorph from '../modal/modal-morph';

const SELECTOR_COMPONENT = '.aui-js-modal';
const CLASS_MORPH = 'aui-modal--morph';

let modalComponents;
let currentModal;

/**
 * Class constructor for Modal AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Modal extends Component {

  /**
   * Upgrades all Modal AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Modal(element));
      }
    });
    modalComponents = components;
    return components;
  };

  /**
   * Get a modal component by element ID.
   * @param {string} id The id attribute of the components HTML element.
   * @returns {Modal} Returns a modal with the given ID.
   */
  static getModalById(id) {
    for (var i = 0; i < modalComponents.length; i++) {
      if (modalComponents[i].id === id) {
        return modalComponents[i];
      }
    }
  }

  /**
   * Close current modal.
   */
  static closeCurrentModal() {
    if (currentModal) {
      currentModal.close();
      currentModal = null;
    }
  }

  /**
   * Returns modifier `morph`
   */
  static get MODIFIER_MORPH() {
    return CLASS_MORPH;
  }

  /**
   * Returns modifier `default`
   */
  static get MODIFIER_DEFAULT() {
    return '';
  }

  /**
   * Initialize component
   */
  init() {
    super.init();

    this._id = this._element.getAttribute('id');

    // Initialize with appropriate decorator depending on modifier,
    // represented by according CSS class:
    if (this._element.classList.contains(CLASS_MORPH)) {
      this._decorator = new ModalMorph(this._element);
    } else {
      this._decorator = new ModalDefault(this._element);
    }
  }

  /**
   * Opens this modal.
   * @param {HTMLElement} trigger The element which opens the modal.
   */
  open(trigger) {
    currentModal = this;
    this._decorator.open(trigger);
  }

  /**
   * Closes this modal.
   */
  close() {
    currentModal = null;
    this._decorator.close();
  }

  /**
   * @returns {string} Returns the ID of the modal
   */
  get id() {
    return this._id;
  }
}
