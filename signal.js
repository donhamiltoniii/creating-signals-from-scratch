// Global variable to track effects
// This is not viable long term
let effectCallback;

class Signal {
  /**
   * Creates new signal
   * @param {*} value
   */
  constructor(value) {
    this.value = value;
    this.subscribers = [];
  }

  /**
   * @returns current value of signal
   */
  getValue() {
    return this.value;
  }

  /**
   * Updates value of signal and also calls emit
   * @param {*} newValue
   */
  setValue(newValue) {
    this.value = newValue;
    this.emit();
  }

  /**
   * Emits publish event to all subscribed functions
   */
  emit() {
    this.subscribers.forEach((subscriber) => subscriber(this.value));
  }

  /**
   * Adds subscriber to list
   * @param {Function} callback
   */
  subscribe(callback) {
    this.subscribers.push(callback);
  }
}

/**
 * Creates an effect that is called anytime ANY signal is updated
 * @param {Function} callback
 */
export const createEffect = (callback) => {
  effectCallback = callback;
  callback();
  effectCallback = null;
};

/**
 *
 * @param {*} value
 * @returns {[Function, Function]} getter for signal value, setter for updating signal value
 */
export const createSignal = (value) => {
  const signal = new Signal(value);

  return [
    function value() {
      if (effectCallback) {
        signal.subscribe(effectCallback);
      }
      return signal.getValue();
    },
    function setValue(newVal) {
      signal.setValue(newVal);
    },
  ];
};
