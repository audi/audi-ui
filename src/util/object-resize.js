export default class ObjectResize {

  constructor(parent, callback, callbackScope) {

    let isIE = navigator.userAgent.match(/Trident/);

    // NOTE
    // this._parent.style.position != 'static'
    // this._parent.style.display = 'block'

    this._parent = parent;
    this._helperElement = document.createElement('object');
    this._helperElement.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; border: 0px; opacity: 0;');
    this._helperElement.setAttribute('border', '0');
    this._helperElement.onload = () => this._onLoad();
    this._helperElement.type = 'text/html';
    if (isIE) {
      this._parent.appendChild(this._helperElement);
    }
    this._helperElement.data = 'about:blank';
    if (!isIE) {
      this._parent.appendChild(this._helperElement);
    }

    this._callback = callback;
    this._callbackScope = callbackScope;

    this._ticking = false;
  }

  _onLoad(event) {
    this._helperElement.contentDocument.defaultView.addEventListener('resize', this._resizeHandler = (event) => this._onResize(event));
  }

  _onResize(event) {
    if (!this._ticking) {
      window.requestAnimationFrame(() => {
        this._ticking = false;
        this._callback.call(this._callbackScope);
      });
    }
    this._ticking = true;
  }

  dispose() {
    this._helperElement.contentDocument.defaultView.removeEventListener('resize', this._resizeHandler);
    this._parent.removeChild(this._helperElement);
  }
}

// (function() {
//   var attachEvent = document.attachEvent;
//   var isIE = navigator.userAgent.match(/Trident/);
//   var requestFrame = (function() {
//     var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
//       function(fn) {
//         return window.setTimeout(fn, 20);
//       };
//     return function(fn) {
//       return raf(fn);
//     };
//   })();
//
//   var cancelFrame = (function() {
//     var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
//       window.clearTimeout;
//     return function(id) {
//       return cancel(id);
//     };
//   })();
//
//   function resizeListener(e) {
//     var win = e.target || e.srcElement;
//     if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
//     win.__resizeRAF__ = requestFrame(function() {
//       var trigger = win.__resizeTrigger__;
//       trigger.__resizeListeners__.forEach(function(fn) {
//         fn.call(trigger, e);
//       });
//     });
//   }
//
//   function objectLoad(e) {
//     this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
//     this.contentDocument.defaultView.addEventListener('resize', resizeListener);
//   }
//
//   window.addResizeListener = function(element, fn) {
//     if (!element.__resizeListeners__) {
//       element.__resizeListeners__ = [];
//       if (attachEvent) {
//         element.__resizeTrigger__ = element;
//         element.attachEvent('onresize', resizeListener);
//       } else {
//         if (getComputedStyle(element).position === 'static') element.style.position = 'relative';
//         var obj = element.__resizeTrigger__ = document.createElement('object');
//         obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
//         obj.__resizeElement__ = element;
//         obj.onload = objectLoad;
//         obj.type = 'text/html';
//         if (isIE) element.appendChild(obj);
//         obj.data = 'about:blank';
//         if (!isIE) element.appendChild(obj);
//       }
//     }
//     element.__resizeListeners__.push(fn);
//   };
//
//   window.removeResizeListener = function(element, fn) {
//     element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
//     if (!element.__resizeListeners__.length) {
//       if (attachEvent) element.detachEvent('onresize', resizeListener);
//       else {
//         element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
//         element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
//       }
//     }
//   }
// })();
