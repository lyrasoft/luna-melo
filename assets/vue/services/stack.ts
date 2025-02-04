/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class Stack {
  /**
   * @type Stack[]
   */
  static stacks = {};

  name = '';
  store = [];
  observers = [];

  static create(name, store = []) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    return new this(name, store);
  }

  static get(name, store = []) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    if (!this.stacks[name]) {
      this.stacks[name] = new Stack(name, store);
    }

    return this.stacks[name];
  }

  static set(name, stack) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    this.stacks[name] = stack;

    return this;
  }

  static remove() {
    delete this.stacks[name];

    return this;
  }

  static all() {
    return this.stacks;
  }

  constructor(name, store = []) {
    this.name = name;
    this.store = store;
  }

  push(value = true) {
    const r = this.store.push(value);

    this.notice();

    return r;
  }

  pop() {
    const r = this.store.pop();

    this.notice();

    return r;
  }

  clear() {
    this.store = [];

    this.notice();

    return this;
  }

  isEmpty() {
    return this.store.length === 0;
  }

  get length() {
    return this.store.length;
  }

  peek() {
    return this.store;
  }

  observe(handler) {
    this.observers.push({
      handler
    });

    return this;
  }

  once(handler) {
    this.observers.push({
      handler,
      once: true
    });

    return this;
  }

  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length);
    });

    this.observers = this.observers.filter((observer) => observer.once !== true);

    return this;
  }

  off(callback = null) {
    this.observers = this.observers.filter((observer) => observer !== callback);
    return this;
  }
}
