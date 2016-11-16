import Component from '../component/component';

const SELECTOR_COMPONENT = '.aui-js-blank';

/**
 * Class constructor for Blank AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Blank extends Component {

  /**
   * Upgrades all Blank AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Blank(element));
      }
    });
    return components;
  };

  /**
   * Initialize component
   */
  init() {
    super.init();

    // (1) Define `SELECTOR_COMPONENT` like '.aui-js-name-of-component'
    // (2) Rename 'Blank' to 'NameOfComponent'
    // - in the comments of constructor method
    // - in the class name
    // - in the comments of method `upgradeElements`
    // - in the method `upgradeElements` itself
    // (3) Reference me in 'src/index.js'
  }

  /**
   * Dispose component
   */
  dispose() {
    super.dispose();

    // Remove dynamic added classes and attributes
    // Remove event listener
    // etc.
  }
}
