// TODO Fork https://github.com/thomaseckhardt/js-signals translate to ES6

class SignalBinding {

  constructor(signal, listener, isOnce, priority) {
    // Handler function bound to the signal.
    this._listener = listener;

    // If binding should be executed just once.
    this._isOnce = isOnce;

    // Reference to Signal object that listener is currently bound to.
    this._signal = signal;

    // Listener priority
    this._priority = priority || 0;

    // If binding is active and should be executed.
    this._active = true;
  }

  _isBound() {
    return (!!this._signal && !!this._listener);
  }

  /**
   * Call listener passing arbitrary parameters.
   * If binding was added using `Signal.addOnce()` it will be automatically
   * removed from signal dispatch queue, this method is used internally for
   * the signal dispatch.
   * @param {Array} Array of parameters that should be passed to the listener
   * @return {*} Value returned by the listener.
   */
  execute(params) {
    let handlerReturn;
    if (this._active && !!this._listener) {
      handlerReturn = this._listener.apply(this._context, params);
      if (this._isOnce) {
        this.detach();
      }
    }
    return handlerReturn;
  }

  /**
   * Detach binding from signal.
   * - alias to: mySignal.remove(myBinding.getListener());
   * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
   */
  detach() {
    return this._isBound() ? this._signal.remove(this._listener) : null;
  }

  get isOnce() {
    return this._isOnce;
  }

  get listener() {
    return this._listener;
  }

  get signal() {
    return this._signal;
  }

  get priority() {
    return this._priority;
  }

  dispose() {
    delete this._signal;
    delete this._listener;
  }

  toString() {
    return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this._active + ']';
  }
}


class Signal {

  constructor() {
    this._bindings = [];
    this._prevParams = null;
    this._active = true;
  }

  /**
   * Add a listener to the signal.
   * @param {Function} listener Signal handler function.
   * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
   * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
   * @return {SignalBinding} An Object representing the binding between the Signal and listener.
   */
  add(listener, priority) {
    this._validateListener(listener, 'add');
    return this._registerListener(listener, false, priority);
  }

  addOnce(listener, priority) {
    this._validateListener(listener, 'addOnce');
    return this._registerListener(listener, true, priority);
  }

  remove(listener) {
    this._validateListener(listener, 'remove');

    var i = this._indexOfListener(listener);
    if (i !== -1) {
      this._bindings[i].dispose(); //no reason to a SignalBinding exist if it isn't attached to a signal
      this._bindings.splice(i, 1);
    }
    return listener;
  }

  removeAll() {
    let n = this._bindings.length;
    while (n--) {
      this._bindings[n].dispose();
    }
    this._bindings.length = 0;
  }

  has(listener) {
    return this._indexOfListener(listener) !== -1;
  }

  dispatch() {
    if (!this._active) {
      return;
    }

    let n = this._bindings.length;
    if (!n) {
      return;
    }

    let params = Array.prototype.slice.call(arguments);
    let bindings;

    bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch

    //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
    //reverse loop since listeners with higher priority will be added at the end of the list
    do {
      n--;
    } while (bindings[n] && bindings[n].execute(params) !== false);
  }

  dispose() {
    this.removeAll();
    delete this._bindings;
    delete this._prevParams;
  }

  _registerListener(listener, isOnce, priority) {
    let prevIndex = this._indexOfListener(listener);
    let binding;

    if (prevIndex !== -1) {
      binding = this._bindings[prevIndex];
      if (binding.isOnce() !== isOnce) {
        throw new Error(`You cannot add${isOnce ? '' : 'Once'}() then add${!isOnce ? '' : 'Once'}() the same listener without removing the relationship first.`);
      }
    } else {
      binding = new SignalBinding(this, listener, isOnce, priority);
      this._addBinding(binding);
    }

    if (this.memorize && this._prevParams) {
      binding.execute(this._prevParams);
    }

    return binding;
  }

  _validateListener(listener, fnName) {
    if (typeof listener !== 'function') {
      throw new Error(`listener is a required param of ${fnName}() and should be a Function.`);
    }
  }

  _indexOfListener(listener) {
    let n = this._bindings.length;
    let current;
    while (n--) {
      current = this._bindings[n];
      if (current.listener === listener) {
        return n;
      }
    }
    return -1;
  }

  _addBinding(binding) {
    var n = this._bindings.length;
    do {
      --n;
    } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);
    this._bindings.splice(n + 1, 0, binding);
  }
}

export default Signal;
