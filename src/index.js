// TODO Add ComponentHandler.upgradeAllRegistered components e.g. to update them when all fonts are loaded.
// TODO Perform a `Cutting the mustard` test once. audiui-head.js
// TODO Outsource dependencies Tether, nouislider, bezier-easing

/**
 * Import all AUI components.
 */
import Alert from './alert/alert';
import Audioplayer from './audioplayer/audioplayer';
import Breadcrumb from './breadcrumb/breadcrumb';
import Checkbox from './checkbox/checkbox';
// import Dropdown from './dropdown/dropdown';
import Flyout from './flyout/flyout';
import Header from './header/header';
import Modal from './modal/modal';
import Nav from './nav/nav';
import Notification from './notification/notification';
import Pagination from './pagination/pagination';
import Player from './player/player';
import Popover from './popover/popover';
import Progress from './progress/progress';
import Radio from './radio/radio';
import Response from './response/response';
import Select from './select/select';
import Slider from './slider/slider';
import Indicator from './indicator/indicator';
import Spinner from './spinner/spinner';
import Textfield from './textfield/textfield';
import Tooltip from './tooltip/tooltip';

/**
 * Export all AUI components to make them accessible through npm.
 * @example
 * import {Alert} from 'audi-ui';
 * Alert.upgradeElements();
 */
export {
  Alert,
  Audioplayer,
  Breadcrumb,
  Checkbox,
  // Dropdown,
  Flyout,
  Header,
  Modal,
  Nav,
  Notification,
  Pagination,
  Player,
  Popover,
  Progress,
  Radio,
  Response,
  Select,
  Slider,
  Indicator,
  Spinner,
  Textfield,
  Tooltip
}

/**
 * Export Component Handler as default to have access to all components.
 * @example
 * import auiHandler from 'audi-ui';
 * auiHandler.upgradeAllElements();
 */
class ComponentHandler {

  constructor() {

    /**
     * Performs a "Cutting the mustard" test. If the browser supports the features
     * tested, adds a aui-js class to the <html> element.
     */
    if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
      document.documentElement.classList.add('aui-js');
    }

    this.upgradeAllElements();
  }

  upgradeAllElements() {
    Alert.upgradeElements();
    Audioplayer.upgradeElements();
    Breadcrumb.upgradeElements();
    Checkbox.upgradeElements();
    // Dropdown.upgradeElements();
    Flyout.upgradeElements();
    Header.upgradeElements();
    // Modal.upgradeElements();
    Nav.upgradeElements();
    Notification.upgradeElements();
    Pagination.upgradeElements();
    Player.upgradeElements();
    Popover.upgradeElements();
    // Progress.upgradeElements();
    Radio.upgradeElements();
    Response.upgradeElements();
    Select.upgradeElements();
    Slider.upgradeElements();
    Indicator.upgradeElements();
    // Spinner.upgradeElements();
    Textfield.upgradeElements();
    Tooltip.upgradeElements();
  }

}

const componentHandler = new ComponentHandler();

export default componentHandler;
