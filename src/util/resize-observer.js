import Signal from '../util/signal';

let instance = null;

export default class ResizeObserver {

  constructor() {
    if (!instance) {
      instance = this;
      this.init();
    }

    return instance;
  }

  init() {
    this._ticking = false;

    this.resized = new Signal();

    window.addEventListener('resize', this._resizeHandler = (event) => this._onResize(event));
  }

  _onResize(event) {
    if (!this._ticking) {
      window.requestAnimationFrame(() => {
        this._ticking = false;
        this.resized.dispatch();
      });
    }
    this._ticking = true;
  }
}
