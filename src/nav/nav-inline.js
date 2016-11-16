import Component from '../component/component';
import ResizeObserver from '../util/resize-observer';
import ScrollObserverElement from '../util/scroll-observer-element';
import limit from '../util/limit';

const SELECTOR_COMPONENT = '.aui-js-nav';
const CLASS_PANEL = 'aui-nav__panel';
const CLASS_ACTION = 'aui-nav__action';
const CLASS_INDICATOR = 'aui-nav__indicator';
const CLASS_PADDLES = 'aui-nav__paddles';
const CLASS_PADDLE_LEFT = 'aui-nav__paddle-left';
const CLASS_PADDLE_RIGHT = 'aui-nav__paddle-right';
const CLASS_IS_ACTIVE = 'is-active';
const CLASS_IS_ANIMATED = 'is-animated';
const SHOW_INDICATOR_DELAY = 0.25; // in seconds; Delay after which, the indicator fades in.
const INDICATOR_HIDDEN_X = -20; // Position of indicator when it's hidden, e.g. on page load.
const INDICATOR_HIDDEN_WIDTH = 10; // Width of indicator when it's hidden, e.g. on page load.
const SCROLL_THRESHOLD = 20; // in px; How far to scroll, before paddles are visible.
const SCROLL_PADDING = 10; // in px;
const SCROLL_EASING = 0.2;

/**
 * Class constructor for NavInline AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class NavInline extends Component {

  /**
   * Upgrades all NavInline AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new NavInline(element));
      }
    });
    return components;
  };

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

    // Refer elements
    this._panel = this._element.querySelector(`.${CLASS_PANEL}`);
    this._actionElements = Array.from(this._element.querySelectorAll(`.${CLASS_ACTION}`));

    // Add indicator (line underneath action elements)
    this._indicator = document.createElement('span');
    this._indicator.classList.add(CLASS_INDICATOR);
    this._panel.appendChild(this._indicator);

    // Add paddles (gradient and buttons on the left/right, when scrolling is required)
    this._paddles = document.createElement('div');
    this._paddles.classList.add(CLASS_PADDLES);
    this._element.appendChild(this._paddles);
    this._paddleLeft = this._addPaddle(CLASS_PADDLE_LEFT);
    this._paddleRight = this._addPaddle(CLASS_PADDLE_RIGHT);

    // Watch window resizing
    this._resizeObserver = new ResizeObserver();
    this._resizeObserver.resized.add(this._resizedHandler = () => this.update());

    // Watch scrolling of wrapper element
    this._scrollObserver = new ScrollObserverElement(this._panel);
    this._scrollObserver.scrolled.add(this._scrollHandler = () => this._onScrollElement());
    this._onScrollElement();

    // Add event handler
    this._element.addEventListener('click', this._clickHandler = (event) => this._onClick(event));

    // Set initial action element active
    this.setActive(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));

    // Delay fade in of indicator
    setTimeout(() => {
      this._element.classList.add(CLASS_IS_ANIMATED);
    }, SHOW_INDICATOR_DELAY * 1000);
  }

  /**
   * Dispose component.
   */
  dispose() {
    super.dispose();
    this._panel.scrollLeft = 0;
    this._scrollActive = false;
    this._resizeObserver.resized.remove(this._resizedHandler);
    this._scrollObserver.scrolled.remove(this._scrollHandler);
    this.removeChild(this._indicator);
    this.removeChild(this._paddles);
    this._element.removeEventListener('click', this._clickHandler);
    this._element.classList.remove(CLASS_IS_ANIMATED);
  }

  /**
   * Updates inidcator position and visibility of paddles.
   */
  update() {
    this.setActive(this._element.querySelector(`.${CLASS_IS_ACTIVE}`));
    this._updatePaddleVisibility();
  }

  /**
   * Set an action element at given index active.
   * @param {index} index The index of action element to set active.
   */
  setActiveByIndex(index) {
    let i = limit(index, 0, this._actionElements.length);
    this.setActive(this._actionElements[i]);
  }

  /**
   * Set an action element active.
   * @param {HTMLElement} activeTarget The action element to set active.
   */
  setActive(activeTarget) {
    // TODO: Optimize like in nav-list
    this._actionElements.forEach(item => {
      item.classList.remove(CLASS_IS_ACTIVE);
    });

    let indicatorLeft = INDICATOR_HIDDEN_X;
    let indicatorWidth = INDICATOR_HIDDEN_WIDTH;

    if (activeTarget) {
      activeTarget.classList.add(CLASS_IS_ACTIVE);
      let containerBounds = this._element.getBoundingClientRect();
      let rectTarget = activeTarget.getBoundingClientRect();
      indicatorLeft = rectTarget.left - containerBounds.left + this._panel.scrollLeft;
      indicatorWidth = activeTarget.offsetWidth;
    }

    this._indicator.style.left = `${indicatorLeft}px`;
    this._indicator.style.width = `${indicatorWidth}px`;

    this._index = null;
    for (var i = 0; i < this._actionElements.length; i++) {
      if (this._actionElements[i] === activeTarget) {
        this._index = i;
        break;
      }
    }
  }

  /**
   * Scroll to the next visible action element on the left.
   */
  scrollLeft() {
    this.scroll(-1);
  }

  /**
   * Scroll to the next visible action element on the right.
   */
  scrollRight() {
    this.scroll(1);
  }

  /**
   * Scroll to the next visible action element on the left or right.
   * @param {number} dir The direction to scroll to: -1=>left, 1=>right.
   */
  scroll(dir) {
    let containerBounds = this._element.getBoundingClientRect();
    let elementBounds;
    let left = 0;
    let right = this._panel.offsetWidth;
    let scroll = 0;

    if (dir < 0) {
      // Scroll to previous element
      for (let i = this._actionElements.length - 1; i > 0; i--) {
        let element = this._actionElements[i];
        elementBounds = element.getBoundingClientRect();
        let elementLeft = elementBounds.left - containerBounds.left;
        if (elementLeft < left) {
          scroll = Math.ceil(elementLeft + this._panel.scrollLeft - SCROLL_PADDING);
          break;
        }
      }

    } else {
      // Scroll to next element
      for (let i = 0; i < this._actionElements.length; i++) {
        let element = this._actionElements[i];
        elementBounds = element.getBoundingClientRect();
        let elementRight = elementBounds.left - containerBounds.left + element.offsetWidth;
        if (elementRight > right) {
          scroll = Math.ceil(elementRight + this._panel.scrollLeft + SCROLL_PADDING - right);
          break;
        }
      }
    }

    this._animateScroll(scroll);
  }

  /**
   * Scroll to the next visible action element on the left or right.
   * @param {number} scroll position to scroll to.
   * @private
   */
  _animateScroll(scroll) {
    this._scrollStart = this._panel.scrollLeft;
    this._scrollDelta = scroll - this._scrollStart;
    this._scrollRatio = 0;
    this._scrollActive = true;
    window.requestAnimationFrame(() => this._animateScrollTick());
  }

  /**
   * Scroll animation tick.
   * @private
   */
  _animateScrollTick() {
    let ratio = 1 - this._scrollRatio;
    ratio *= SCROLL_EASING;
    this._scrollRatio += ratio;

    if (ratio < 0.001) {
      this._scrollRatio = 1;
    }
    this._panel.scrollLeft = this._scrollStart + this._scrollDelta * this._scrollRatio;

    if (this._scrollActive && this._scrollRatio !== 1) {
      window.requestAnimationFrame(() => this._animateScrollTick());
    }
  }

  /**
   * Adds a paddle element.
   * @param {string} cssClass to add to element.
   * @returns {HTMLElement} the created paddle element.
   * @private
   */
  _addPaddle(cssClass) {
    let paddle = document.createElement('button');
    paddle.setAttribute('type', 'button');
    paddle.classList.add(cssClass);
    this._paddles.appendChild(paddle);
    return paddle;
  }

  /**
   * Update visibility of paddles depending on scroll position.
   * @private
   */
  _updatePaddleVisibility() {
    if (this._scrollObserver.scrollLeft - SCROLL_THRESHOLD > 0) {
      this._paddleLeft.disabled = false;
    } else {
      this._paddleLeft.disabled = true;
    }

    if (this._scrollObserver.scrollLeft + this._element.offsetWidth + SCROLL_THRESHOLD < this._panel.scrollWidth) {
      this._paddleRight.disabled = false;
    } else {
      this._paddleRight.disabled = true;
    }
  }

  /**
   * Handle scroll of element.
   * @private
   */
  _onScrollElement() {
    this._updatePaddleVisibility();
  }

  /**
   * Handle click of element.
   * @param {Event} event The event that fired.
   * @private
   */
  _onClick(event) {
    if (event.target === this._paddleLeft) {
      event.preventDefault();
      this.scrollLeft();

    } else if (event.target === this._paddleRight) {
      event.preventDefault();
      this.scrollRight();

    } else {
      // Find closest action element
      let currentElement = event.target;
      while (currentElement !== event.currentTarget) {
        if (currentElement.classList.contains(CLASS_ACTION)) {
          if (!currentElement.disabled) {
            this.setActive(currentElement);
          }
          break;
        }
        currentElement = currentElement.parentNode;
      }
    }
  }

  /**
   * Returns index.
   * @returns {number} the index of current active action element.
   */
  get index() {
    return this._index;
  }

  /**
   * Returns length.
   * @returns {number} the number of action elements.
   */
  get length() {
    return this._actionElements.length;
  }
}
