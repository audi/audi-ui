import Signal from '../util/signal';

let instance = null;

const SCROLL_END_THRESHOLD = 100; // in ms

export default class ScrollObserver {

  constructor() {
    if (!instance) {
      instance = this;
      this.init();
    }

    return instance;
  }

  init() {
    this._scrollX = 0;
    this._scrollY = 0;
    this._ticking = false;

    this.scrolled = new Signal();
    this.scrollEnded = new Signal();

    window.addEventListener('scroll', this.scrollHandler = (event) => this.onScroll(event));
  }

  onScroll(event) {
    this._scrollX = window.scrollX;
    this._scrollY = window.scrollY;

    if (!this._ticking) {
      window.requestAnimationFrame(() => {
        this._ticking = false;
        this.scrolled.dispatch(this._scrollX, this._scrollY);
        clearTimeout(this._scrollEndTimeout);
        this._scrollEndTimeout = setTimeout(() => {
          this.scrollEnded.dispatch(this._scrollX, this._scrollY);
        }, SCROLL_END_THRESHOLD);
      });
    }
    this._ticking = true;
  }

  get scrollX() {
    return this._scrollX;
  }

  get scrollY() {
    return this._scrollY;
  }
}
