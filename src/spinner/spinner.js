import Component from '../component/component';
import ObjectResize from '../util/object-resize';
import limit from '../util/limit';
import bezierEasing from 'bezier-easing';

const SELECTOR_COMPONENT = '.aui-js-spinner';
const CLASS_CONTINUOUS = 'aui-spinner--continuous';
const CLASS_SHAPE = 'aui-spinner__svg';
const CLASS_PATH = 'aui-spinner__path';
const CLASS_PATH_PROGRESS = 'aui-spinner__path--progress';
const CLASS_GROUP = 'aui-spinner__group';
const CLASS_GROUP_BASE_PATH = 'aui-spinner__group-base';
const CLASS_GROUP_PROGRESS_PATH = 'aui-spinner__group-progress';
const CLASS_VALUE = 'aui-spinner__value';
const CLASS_IS_PENDING = 'is-pending';
const CLASS_IS_LOADING = 'is-loading';
const CLASS_IS_COMPLETE = 'is-complete';
const SIZE = 48;
const RADIUS = 22;
const STROKE_WIDTH = 3;
const LOOP_ANIMATION_DURATION = 1.5;
const LOOP_ANIMATION = [
  {
    dashLength: 0,
    dashOffset: 0,
    rotate: 0,
  },{
    dashLength: 0.65,
    dashOffset: -1,
    rotate: 360,
  }
];

/**
 * Class constructor for Spinner AUI component.
 * Implements AUI component design pattern defined at:
 * https://github.com/...
 *
 * @param {HTMLElement} element The element that will be upgraded.
 */
export default class Spinner extends Component {

  /**
   * Upgrades all Spinner AUI components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Spinner(element));
      }
    });
    return components;
  };

  constructor(element) {
    super(element);
  }

  init() {
    super.init();

    this._objectResize = new ObjectResize(this._element, this.resize, this);

    this._continuous = this._element.classList.contains(CLASS_CONTINUOUS);

    // Add value element, if required:
    if (!this._continuous) {
      this._value = document.createElement('span');
      this._value.classList.add(CLASS_VALUE);
      this._element.appendChild(this._value);
    }

    // Add SVG graphic:
    // <svg class="aui-spinner__shape" viewBox="0 0 200 200">
    //   <g class="aui-spinner__group">
    //     <circle class="aui-spinner__path" cx="0" cy="0" r="100" />
    //     <circle class="aui-spinner__path aui-spinner__path--progress" cx="0" cy="0" r="100" />
    //   </g>
    // </svg>
    let shape = this.createSvgNode('svg', {
      class: CLASS_SHAPE,
      viewBox: `0 0 ${SIZE} ${SIZE}`,
    });
    let group = this.createSvgNode('g', {class: CLASS_GROUP});
    let groupCircle1 = this.createSvgNode('g', {class: CLASS_GROUP_BASE_PATH});
    let groupCircle2 = this.createSvgNode('g', {class: CLASS_GROUP_PROGRESS_PATH});
    let circle1 = this.createSvgNode('circle', {
      class: CLASS_PATH,
      cx: 0,
      cy: 0,
      r: RADIUS
    });
    let circle2 = this.createSvgNode('circle', {
      class: `${CLASS_PATH} ${CLASS_PATH_PROGRESS}`,
      cx: 0,
      cy: 0,
      r: RADIUS,
      transform: 'rotate(-90)',
    });
    groupCircle1.appendChild(circle1);
    groupCircle2.appendChild(circle2);
    group.appendChild(groupCircle1);
    group.appendChild(groupCircle2);
    shape.appendChild(group);
    this._element.appendChild(shape);
    this._shape = shape;
    this._group = group;
    this._progressPath = circle2;
    this._basePath = circle1;
    this._groupProgress = groupCircle2;

    this._easing = bezierEasing(0.75, 0.02, 0.5, 1);
    this._easingDasharray = bezierEasing(0.4, 0, 0, 1);
    this._progressPath.style.strokeOpacity = 0;

    this.resize();
    this.progress(0);
  }

  progress(ratio) {
    ratio = limit(ratio, 0, 1);
    this._progress = ratio;
    const pathLength = this._getCircleLength(this._progressPath);

    if (!this._continuous) {
      this._progressPath.style.strokeDasharray = this._progress === 1
        ? 'none'
        : `${this._progress * pathLength}, ${pathLength}`;
      this._progressPath.style.strokeOpacity = this._progress === 0
        ? 0
        : 1;
    }

    if (this._value) {
      this._value.innerHTML = `${Math.round(this._progress * 100)}`;
    }

    this._updateClasses();
  }

  loop() {
    if (this._continuous) {
      this._progressPath.style.strokeOpacity = 1;
      window.requestAnimationFrame(timestamp => this._animateLoop(timestamp));
    }
  }

  stop() {}

  resize() {
    const size = this._element.offsetWidth;
    const radius = (size - STROKE_WIDTH) / 2;
    this._shape.setAttributeNS(null, 'viewBox', `${size / -2} ${size / -2} ${size} ${size}`);
    this._basePath.setAttributeNS(null, 'r', `${radius}`);
    this._progressPath.setAttributeNS(null, 'r', `${radius}`);
  }

  // TODO Optimize calculations; wording.
  _animateLoop(timestamp) {
    if (!this._loopStart) {
      this._loopStart = timestamp;
    }

    // The progress in seconds 0 <= progress <= LOOP_ANIMATION_DURATION
    let progress = (timestamp - this._loopStart) / 1000;
    // The progress ratio between 0 <= progressRatio <= 1
    let progressRatio = (progress / LOOP_ANIMATION_DURATION);
    if (progressRatio > 1 || progressRatio === 0) {
      this._animationEndSet = false;
      progress = 0;
      progressRatio = 0;
      this._loopStart = timestamp;
      this._dashLengthStart = LOOP_ANIMATION[0].dashLength;
      this._dashOffsetStart = LOOP_ANIMATION[0].dashOffset;
      this._dashLengthEnd = LOOP_ANIMATION[1].dashLength;
      this._dashOffsetEnd = LOOP_ANIMATION[1].dashOffset;
    }
    const ease = this._easing(progressRatio);
    const pathLength = this._getCircleLength(this._progressPath);
    this._dashLengthRatio = this._dashLengthStart + (this._dashLengthEnd - this._dashLengthStart) * this._easingDasharray(progressRatio);
    this._dashOffsetRatio = this._dashOffsetStart + (this._dashOffsetEnd - this._dashOffsetStart) * ease;
    this._rotate = LOOP_ANIMATION[1].rotate * ease;

    const dashLength = pathLength * this._dashLengthRatio;
    const dashOffset = pathLength * this._dashOffsetRatio;

    this._progressPath.style.strokeDasharray = `${dashLength}, ${pathLength}`;
    this._progressPath.style.strokeDashoffset = `${dashOffset}`;
    // this._group.setAttributeNS(null, 'transform', `rotate(${this._rotate})`);
    this._groupProgress.setAttributeNS(null, 'transform', `rotate(${this._rotate})`);

    window.requestAnimationFrame(timestamp => this._animateLoop(timestamp));
  }

  _updateClasses() {
    if (this._progress === 0) {
      this._element.classList.add(CLASS_IS_PENDING);
    } else {
      this._element.classList.remove(CLASS_IS_PENDING);
    }

    if (this._progress > 0 && this._progress < 1) {
      this._element.classList.add(CLASS_IS_LOADING);
    } else {
      this._element.classList.remove(CLASS_IS_LOADING);
    }

    if (this._progress === 1) {
      this._element.classList.add(CLASS_IS_COMPLETE);
    } else {
      this._element.classList.remove(CLASS_IS_COMPLETE);
    }
  }

  _getCircleLength(circle) {
    const r = circle.getAttribute('r');
    return 2 * Math.PI * r;
  }
}
