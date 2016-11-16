// From Modernizr
function whichAnimationEvent() {
  let type;
  let element = document.createElement('fakeelement');
  let animations = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  }

  for (type in animations) {
    if (element.style[type] !== undefined) {
      return animations[type];
    }
  }
}

const ANIMATION_EVENT = whichAnimationEvent();

export default ANIMATION_EVENT;
