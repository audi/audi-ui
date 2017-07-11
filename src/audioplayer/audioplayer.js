import Component from '../component/component';
import Popover from './../popover/popover';

const SELECTOR_COMPONENT = '.aui-audioplayer';

export default class Audioplayer extends Component {

  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Audioplayer(element));
      }
    });
    return components;
  };

  init() {
    super.init();
    if (this.element.querySelector('.aui-audioplayer__mute')) {
      this.element.querySelector('.aui-audioplayer__mute').addEventListener('click', (event) => this._handleToggleMute(event));
    }
    if (this.element.querySelector('.aui-audioplayer__play')) {
      this.element.querySelector('.aui-audioplayer__play').addEventListener('click', (event) => this._handleTogglePlay(event));
    }
  }

  _handleToggleMute(event) {
    event.preventDefault();
    if (this.element.classList.contains('is-mute')) {
      this.element.classList.remove('is-mute');
    } else {
      this.element.classList.add('is-mute');
    }
  }

  _handleTogglePlay(event) {
    event.preventDefault();
    if (this.element.classList.contains('is-playing')) {
      this.element.classList.remove('is-playing');
    } else {
      this.element.classList.add('is-playing');
    }
  }

  dispose() {
    super.dispose();
  }

}