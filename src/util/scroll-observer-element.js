import Signal from '../util/signal';

const SCROLL_END_THRESHOLD = 100; // in ms

export default class ScrollObserverElement {

  constructor(element) {
    this._element = element;
    this._scrollX = this._element.scrollLeft;
    this._scrollY = this._element.scrollTop;
    this._ticking = false;

    this.scrolled = new Signal();
    this.scrollEnded = new Signal();

    this._element.addEventListener('scroll', this._scrollHandler = (event) => this._onScroll(event));
  }

  _onScroll(event) {
    this._scrollX = event.target.scrollLeft;
    this._scrollY = event.target.scrollTop;

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

  get scrollLeft() {
    return this._scrollX;
  }

  get scrollTop() {
    return this._scrollY;
  }
}
