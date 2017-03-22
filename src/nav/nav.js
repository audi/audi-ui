import Component from '../component/component';
import NavBar from '../nav/nav-bar';
import NavDropdown from '../nav/nav-dropdown';
import NavList from '../nav/nav-list';
import ResizeObserver from '../util/resize-observer';

const SELECTOR_COMPONENT = '.aui-js-nav';
const CLASS_LIST = 'aui-nav--list';
const CLASS_BAR = 'aui-nav--bar';
const CLASS_TAB = 'aui-nav--tab';
const CLASS_DROPDOWN = 'aui-nav--dropdown';

/**
 * Class constructor for Nav AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Nav extends Component {

  /**
   * Upgrades all Nav AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Nav(element));
      }
    });
    return components;
  };

  /**
   * Returns modifier `list`
   */
  static get MODIFIER_LIST() {
    return CLASS_LIST;
  }

  /**
   * Returns modifier `bar`
   */
  static get MODIFIER_BAR() {
    return CLASS_BAR;
  }

  /**
   * Returns modifier `tab`
   */
  static get MODIFIER_TAB() {
    return CLASS_TAB;
  }

  /**
   * Returns modifier `dropdown`
   */
  static get MODIFIER_DROPDOWN() {
    return CLASS_DROPDOWN;
  }

  /**
   * Constructor
   * @constructor
   * @param {HTMLElement} element The element of the AUI component.
   */
  constructor(element) {
    super(element);
  }

  /**
   * Initialize component.
   */
  init() {
    super.init();

    // Initialize with appropriate decorator depending on modifier,
    // represented by according CSS class:
    if (this._element.classList.contains(CLASS_BAR)) {
      this._originModifier = Nav.MODIFIER_BAR;

    } else if (this._element.classList.contains(CLASS_TAB)) {
      this._originModifier = Nav.MODIFIER_TAB;

    } else if (this._element.classList.contains(CLASS_DROPDOWN)) {
      this._originModifier = Nav.MODIFIER_DROPDOWN;

    } else if (this._element.classList.contains(CLASS_LIST)) {
      this._originModifier = Nav.MODIFIER_LIST;
    }

    this._layoutBreakpoint = parseInt(window.getComputedStyle(this._element, ':after').getPropertyValue('content').replace(/['"]+/g, ''));

    if (this._layoutBreakpoint > 0 && (this._originModifier === Nav.MODIFIER_BAR || this._originModifier === Nav.MODIFIER_TAB)) {
      this._resizeObserver = new ResizeObserver();
      this._resizeObserver.resized.add(this._boundResize = () => this._resized());
      this._resized();
    } else {
      this.setModifier(this._originModifier);
    }
  }

  /**
   * Dispose component.
   */
  dispose() {
    super.dispose();

    if (this._decorator) {
      this._decorator.dispose();
    }
  }

  /**
   * Updates inidcator position and visibility of paddles.
   */
  update() {
    if (this._decorator) {
      this._decorator.update();
    }
  }

  /**
   * Set modifier to switch style of Nav Component.
   * @param {string} modifier name.
   * @throws Will throw an error, if the given modifier is not supported.
   */
  setModifier(modifier) {
    if (this._modifier === modifier) {
      return;
    }

    if (this._decorator) {
      this._decorator.dispose();
    }

    this._element.classList.remove(CLASS_LIST, CLASS_BAR, CLASS_TAB, CLASS_DROPDOWN);

    switch (modifier) {
      case Nav.MODIFIER_BAR:
        this._element.classList.add(CLASS_BAR);
        this._decorator = new NavBar(this._element);
        break;

      case Nav.MODIFIER_TAB:
        this._element.classList.add(CLASS_TAB);
        this._decorator = new NavBar(this._element);
        break;

      case Nav.MODIFIER_DROPDOWN:
        this._element.classList.add(CLASS_DROPDOWN);
        this._decorator = new NavDropdown(this._element);
        break;

      case Nav.MODIFIER_LIST:
        this._element.classList.add(CLASS_LIST);
        this._decorator = new NavList(this._element);
        break;

      default:
        throw new Error(`Modifier '${modifier}' for Nav component not supported.`);
    }

    this._modifier = modifier;
  }

  /**
   * Handle resize signal.
   */
  _resized() {
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (this._originModifier === Nav.MODIFIER_BAR || this._originModifier === Nav.MODIFIER_TAB) {
      if (viewportWidth >= this._layoutBreakpoint) {
        this.setModifier(this._originModifier);
      } else {
        this.setModifier(Nav.MODIFIER_DROPDOWN);
      }
    }
  }

  /**
   * Returns index.
   * @returns {number} the index of current active action element.
   */
  get index() {
    return this._decorator
      ? this._decorator.index
      : undefined;
  }

  /**
   * Returns length.
   * @returns {number} the number of action elements.
   */
  get length() {
    return this._decorator
      ? this._decorator.length
      : undefined;
  }
}
