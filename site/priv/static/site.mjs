// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label) => label in fields ? fields[label] : this[label]
    );
    return new this.constructor(...properties);
  }
};
var List = class {
  static fromArray(array3, tail) {
    let t = tail || new Empty();
    for (let i2 = array3.length - 1; i2 >= 0; --i2) {
      t = new NonEmpty(array3[i2], t);
    }
    return t;
  }
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
  toArray() {
    return [...this];
  }
  // @internal
  atLeastLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return true;
      desired--;
    }
    return desired <= 0;
  }
  // @internal
  hasLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return false;
      desired--;
    }
    return desired === 0;
  }
  countLength() {
    let length3 = 0;
    for (let _ of this)
      length3++;
    return length3;
  }
};
function prepend(element2, tail) {
  return new NonEmpty(element2, tail);
}
function toList(elements, tail) {
  return List.fromArray(elements, tail);
}
var ListIterator = class {
  #current;
  constructor(current) {
    this.#current = current;
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true };
    } else {
      let { head, tail } = this.#current;
      this.#current = tail;
      return { value: head, done: false };
    }
  }
};
var Empty = class extends List {
};
var NonEmpty = class extends List {
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
  }
};
var Result = class _Result extends CustomType {
  // @internal
  static isResult(data) {
    return data instanceof _Result;
  }
};
var Ok = class extends Result {
  constructor(value) {
    super();
    this[0] = value;
  }
  // @internal
  isOk() {
    return true;
  }
};
var Error = class extends Result {
  constructor(detail) {
    super();
    this[0] = detail;
  }
  // @internal
  isOk() {
    return false;
  }
};
function isEqual(x, y) {
  let values = [x, y];
  while (values.length) {
    let a2 = values.pop();
    let b = values.pop();
    if (a2 === b)
      continue;
    if (!isObject(a2) || !isObject(b))
      return false;
    let unequal = !structurallyCompatibleObjects(a2, b) || unequalDates(a2, b) || unequalBuffers(a2, b) || unequalArrays(a2, b) || unequalMaps(a2, b) || unequalSets(a2, b) || unequalRegExps(a2, b);
    if (unequal)
      return false;
    const proto = Object.getPrototypeOf(a2);
    if (proto !== null && typeof proto.equals === "function") {
      try {
        if (a2.equals(b))
          continue;
        else
          return false;
      } catch {
      }
    }
    let [keys2, get2] = getters(a2);
    for (let k of keys2(a2)) {
      values.push(get2(a2, k), get2(b, k));
    }
  }
  return true;
}
function getters(object3) {
  if (object3 instanceof Map) {
    return [(x) => x.keys(), (x, y) => x.get(y)];
  } else {
    let extra = object3 instanceof globalThis.Error ? ["message"] : [];
    return [(x) => [...extra, ...Object.keys(x)], (x, y) => x[y]];
  }
}
function unequalDates(a2, b) {
  return a2 instanceof Date && (a2 > b || a2 < b);
}
function unequalBuffers(a2, b) {
  return a2.buffer instanceof ArrayBuffer && a2.BYTES_PER_ELEMENT && !(a2.byteLength === b.byteLength && a2.every((n, i2) => n === b[i2]));
}
function unequalArrays(a2, b) {
  return Array.isArray(a2) && a2.length !== b.length;
}
function unequalMaps(a2, b) {
  return a2 instanceof Map && a2.size !== b.size;
}
function unequalSets(a2, b) {
  return a2 instanceof Set && (a2.size != b.size || [...a2].some((e) => !b.has(e)));
}
function unequalRegExps(a2, b) {
  return a2 instanceof RegExp && (a2.source !== b.source || a2.flags !== b.flags);
}
function isObject(a2) {
  return typeof a2 === "object" && a2 !== null;
}
function structurallyCompatibleObjects(a2, b) {
  if (typeof a2 !== "object" && typeof b !== "object" && (!a2 || !b))
    return false;
  let nonstructural = [Promise, WeakSet, WeakMap, Function];
  if (nonstructural.some((c) => a2 instanceof c))
    return false;
  return a2.constructor === b.constructor;
}
function makeError(variant, module, line, fn, message, extra) {
  let error = new globalThis.Error(message);
  error.gleam_error = variant;
  error.module = module;
  error.line = line;
  error.fn = fn;
  for (let k in extra)
    error[k] = extra[k];
  return error;
}

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var None = class extends CustomType {
};
function unwrap(option, default$) {
  if (option instanceof Some) {
    let x = option[0];
    return x;
  } else {
    return default$;
  }
}

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
function do_reverse_acc(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining;
    let accumulator = loop$accumulator;
    if (remaining.hasLength(0)) {
      return accumulator;
    } else {
      let item = remaining.head;
      let rest$1 = remaining.tail;
      loop$remaining = rest$1;
      loop$accumulator = prepend(item, accumulator);
    }
  }
}
function do_reverse(list) {
  return do_reverse_acc(list, toList([]));
}
function reverse(xs) {
  return do_reverse(xs);
}
function do_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      loop$list = xs;
      loop$fun = fun;
      loop$acc = prepend(fun(x), acc);
    }
  }
}
function map(list, fun) {
  return do_map(list, fun, toList([]));
}

// build/dev/javascript/gleam_stdlib/gleam/string_builder.mjs
function from_string(string3) {
  return identity(string3);
}
function to_string(builder) {
  return identity(builder);
}
function split2(iodata, pattern) {
  return split(iodata, pattern);
}

// build/dev/javascript/gleam_stdlib/gleam/dynamic.mjs
function from(a2) {
  return identity(a2);
}

// build/dev/javascript/gleam_stdlib/dict.mjs
var tempDataView = new DataView(new ArrayBuffer(8));
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
function identity(x) {
  return x;
}
function graphemes(string3) {
  const iterator = graphemes_iterator(string3);
  if (iterator) {
    return List.fromArray(Array.from(iterator).map((item) => item.segment));
  } else {
    return List.fromArray(string3.match(/./gsu));
  }
}
function graphemes_iterator(string3) {
  if (Intl && Intl.Segmenter) {
    return new Intl.Segmenter().segment(string3)[Symbol.iterator]();
  }
}
function split(xs, pattern) {
  return List.fromArray(xs.split(pattern));
}

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function split3(x, substring) {
  if (substring === "") {
    return graphemes(x);
  } else {
    let _pipe = x;
    let _pipe$1 = from_string(_pipe);
    let _pipe$2 = split2(_pipe$1, substring);
    return map(_pipe$2, to_string);
  }
}

// build/dev/javascript/gleam_stdlib/gleam/uri.mjs
var Uri = class extends CustomType {
  constructor(scheme, userinfo, host, port, path, query, fragment) {
    super();
    this.scheme = scheme;
    this.userinfo = userinfo;
    this.host = host;
    this.port = port;
    this.path = path;
    this.query = query;
    this.fragment = fragment;
  }
};
function do_remove_dot_segments(loop$input, loop$accumulator) {
  while (true) {
    let input = loop$input;
    let accumulator = loop$accumulator;
    if (input.hasLength(0)) {
      return reverse(accumulator);
    } else {
      let segment = input.head;
      let rest = input.tail;
      let accumulator$1 = (() => {
        if (segment === "") {
          let accumulator$12 = accumulator;
          return accumulator$12;
        } else if (segment === ".") {
          let accumulator$12 = accumulator;
          return accumulator$12;
        } else if (segment === ".." && accumulator.hasLength(0)) {
          return toList([]);
        } else if (segment === ".." && accumulator.atLeastLength(1)) {
          let accumulator$12 = accumulator.tail;
          return accumulator$12;
        } else {
          let segment$1 = segment;
          let accumulator$12 = accumulator;
          return prepend(segment$1, accumulator$12);
        }
      })();
      loop$input = rest;
      loop$accumulator = accumulator$1;
    }
  }
}
function remove_dot_segments(input) {
  return do_remove_dot_segments(input, toList([]));
}
function path_segments(path) {
  return remove_dot_segments(split3(path, "/"));
}

// build/dev/javascript/gleam_stdlib/gleam/bool.mjs
function guard(requirement, consequence, alternative) {
  if (requirement) {
    return consequence;
  } else {
    return alternative();
  }
}

// build/dev/javascript/lustre/lustre/effect.mjs
var Effect = class extends CustomType {
  constructor(all) {
    super();
    this.all = all;
  }
};
function from2(effect) {
  return new Effect(toList([(dispatch, _) => {
    return effect(dispatch);
  }]));
}
function none() {
  return new Effect(toList([]));
}

// build/dev/javascript/lustre/lustre/internals/vdom.mjs
var Text = class extends CustomType {
  constructor(content) {
    super();
    this.content = content;
  }
};
var Element = class extends CustomType {
  constructor(key, namespace, tag, attrs, children, self_closing, void$) {
    super();
    this.key = key;
    this.namespace = namespace;
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
    this.self_closing = self_closing;
    this.void = void$;
  }
};
var Attribute = class extends CustomType {
  constructor(x0, x1, as_property) {
    super();
    this[0] = x0;
    this[1] = x1;
    this.as_property = as_property;
  }
};
var Event = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};

// build/dev/javascript/lustre/lustre/attribute.mjs
function attribute(name, value) {
  return new Attribute(name, from(value), false);
}
function on(name, handler) {
  return new Event("on" + name, handler);
}
function class$(name) {
  return attribute("class", name);
}
function href(uri) {
  return attribute("href", uri);
}
function target(target2) {
  return attribute("target", target2);
}

// build/dev/javascript/lustre/lustre/element.mjs
function element(tag, attrs, children) {
  if (tag === "area") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "base") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "br") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "col") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "embed") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "hr") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "img") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "input") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "link") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "meta") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "param") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "source") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "track") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else if (tag === "wbr") {
    return new Element("", "", tag, attrs, toList([]), false, true);
  } else {
    return new Element("", "", tag, attrs, children, false, false);
  }
}
function text(content) {
  return new Text(content);
}

// build/dev/javascript/lustre/lustre/internals/runtime.mjs
var Dispatch = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Shutdown = class extends CustomType {
};

// build/dev/javascript/lustre/vdom.ffi.mjs
function morph(prev, next, dispatch, isComponent = false) {
  let out;
  let stack = [{ prev, next, parent: prev.parentNode }];
  while (stack.length) {
    let { prev: prev2, next: next2, parent } = stack.pop();
    if (next2.subtree !== void 0)
      next2 = next2.subtree();
    if (next2.content !== void 0) {
      if (!prev2) {
        const created = document.createTextNode(next2.content);
        parent.appendChild(created);
        out ??= created;
      } else if (prev2.nodeType === Node.TEXT_NODE) {
        if (prev2.textContent !== next2.content)
          prev2.textContent = next2.content;
        out ??= prev2;
      } else {
        const created = document.createTextNode(next2.content);
        parent.replaceChild(created, prev2);
        out ??= created;
      }
    } else if (next2.tag !== void 0) {
      const created = createElementNode({
        prev: prev2,
        next: next2,
        dispatch,
        stack,
        isComponent
      });
      if (!prev2) {
        parent.appendChild(created);
      } else if (prev2 !== created) {
        parent.replaceChild(created, prev2);
      }
      out ??= created;
    }
  }
  return out;
}
function createElementNode({ prev, next, dispatch, stack }) {
  const namespace = next.namespace || "http://www.w3.org/1999/xhtml";
  const canMorph = prev && prev.nodeType === Node.ELEMENT_NODE && prev.localName === next.tag && prev.namespaceURI === (next.namespace || "http://www.w3.org/1999/xhtml");
  const el2 = canMorph ? prev : namespace ? document.createElementNS(namespace, next.tag) : document.createElement(next.tag);
  let handlersForEl;
  if (!registeredHandlers.has(el2)) {
    const emptyHandlers = /* @__PURE__ */ new Map();
    registeredHandlers.set(el2, emptyHandlers);
    handlersForEl = emptyHandlers;
  } else {
    handlersForEl = registeredHandlers.get(el2);
  }
  const prevHandlers = canMorph ? new Set(handlersForEl.keys()) : null;
  const prevAttributes = canMorph ? new Set(Array.from(prev.attributes, (a2) => a2.name)) : null;
  let className = null;
  let style = null;
  let innerHTML = null;
  for (const attr of next.attrs) {
    const name = attr[0];
    const value = attr[1];
    const isProperty = attr[2];
    if (isProperty) {
      el2[name] = value;
    } else if (name.startsWith("on")) {
      const eventName = name.slice(2);
      const callback = dispatch(value);
      if (!handlersForEl.has(eventName)) {
        el2.addEventListener(eventName, lustreGenericEventHandler);
      }
      handlersForEl.set(eventName, callback);
      if (canMorph)
        prevHandlers.delete(eventName);
    } else if (name.startsWith("data-lustre-on-")) {
      const eventName = name.slice(15);
      const callback = dispatch(lustreServerEventHandler);
      if (!handlersForEl.has(eventName)) {
        el2.addEventListener(eventName, lustreGenericEventHandler);
      }
      handlersForEl.set(eventName, callback);
      el2.setAttribute(name, value);
    } else if (name === "class") {
      className = className === null ? value : className + " " + value;
    } else if (name === "style") {
      style = style === null ? value : style + value;
    } else if (name === "dangerous-unescaped-html") {
      innerHTML = value;
    } else {
      el2.setAttribute(name, value);
      if (name === "value")
        el2[name] = value;
      if (canMorph)
        prevAttributes.delete(name);
    }
  }
  if (className !== null) {
    el2.setAttribute("class", className);
    if (canMorph)
      prevAttributes.delete("class");
  }
  if (style !== null) {
    el2.setAttribute("style", style);
    if (canMorph)
      prevAttributes.delete("style");
  }
  if (canMorph) {
    for (const attr of prevAttributes) {
      el2.removeAttribute(attr);
    }
    for (const eventName of prevHandlers) {
      handlersForEl.delete(eventName);
      el2.removeEventListener(eventName, lustreGenericEventHandler);
    }
  }
  if (next.key !== void 0 && next.key !== "") {
    el2.setAttribute("data-lustre-key", next.key);
  } else if (innerHTML !== null) {
    el2.innerHTML = innerHTML;
    return el2;
  }
  let prevChild = el2.firstChild;
  let seenKeys = null;
  let keyedChildren = null;
  let incomingKeyedChildren = null;
  let firstChild = next.children[Symbol.iterator]().next().value;
  if (canMorph && firstChild !== void 0 && // Explicit checks are more verbose but truthy checks force a bunch of comparisons
  // we don't care about: it's never gonna be a number etc.
  firstChild.key !== void 0 && firstChild.key !== "") {
    seenKeys = /* @__PURE__ */ new Set();
    keyedChildren = getKeyedChildren(prev);
    incomingKeyedChildren = getKeyedChildren(next);
  }
  for (const child of next.children) {
    if (child.key !== void 0 && seenKeys !== null) {
      while (prevChild && !incomingKeyedChildren.has(prevChild.getAttribute("data-lustre-key"))) {
        const nextChild = prevChild.nextSibling;
        el2.removeChild(prevChild);
        prevChild = nextChild;
      }
      if (keyedChildren.size === 0) {
        stack.unshift({ prev: prevChild, next: child, parent: el2 });
        prevChild = prevChild?.nextSibling;
        continue;
      }
      if (seenKeys.has(child.key)) {
        console.warn(`Duplicate key found in Lustre vnode: ${child.key}`);
        stack.unshift({ prev: null, next: child, parent: el2 });
        continue;
      }
      seenKeys.add(child.key);
      const keyedChild = keyedChildren.get(child.key);
      if (!keyedChild && !prevChild) {
        stack.unshift({ prev: null, next: child, parent: el2 });
        continue;
      }
      if (!keyedChild && prevChild !== null) {
        const placeholder = document.createTextNode("");
        el2.insertBefore(placeholder, prevChild);
        stack.unshift({ prev: placeholder, next: child, parent: el2 });
        continue;
      }
      if (!keyedChild || keyedChild === prevChild) {
        stack.unshift({ prev: prevChild, next: child, parent: el2 });
        prevChild = prevChild?.nextSibling;
        continue;
      }
      el2.insertBefore(keyedChild, prevChild);
      stack.unshift({ prev: keyedChild, next: child, parent: el2 });
    } else {
      stack.unshift({ prev: prevChild, next: child, parent: el2 });
      prevChild = prevChild?.nextSibling;
    }
  }
  while (prevChild) {
    const next2 = prevChild.nextSibling;
    el2.removeChild(prevChild);
    prevChild = next2;
  }
  return el2;
}
var registeredHandlers = /* @__PURE__ */ new WeakMap();
function lustreGenericEventHandler(event2) {
  const target2 = event2.currentTarget;
  if (!registeredHandlers.has(target2)) {
    target2.removeEventListener(event2.type, lustreGenericEventHandler);
    return;
  }
  const handlersForEventTarget = registeredHandlers.get(target2);
  if (!handlersForEventTarget.has(event2.type)) {
    target2.removeEventListener(event2.type, lustreGenericEventHandler);
    return;
  }
  handlersForEventTarget.get(event2.type)(event2);
}
function lustreServerEventHandler(event2) {
  const el2 = event2.target;
  const tag = el2.getAttribute(`data-lustre-on-${event2.type}`);
  const data = JSON.parse(el2.getAttribute("data-lustre-data") || "{}");
  const include = JSON.parse(el2.getAttribute("data-lustre-include") || "[]");
  switch (event2.type) {
    case "input":
    case "change":
      include.push("target.value");
      break;
  }
  return {
    tag,
    data: include.reduce(
      (data2, property) => {
        const path = property.split(".");
        for (let i2 = 0, o = data2, e = event2; i2 < path.length; i2++) {
          if (i2 === path.length - 1) {
            o[path[i2]] = e[path[i2]];
          } else {
            o[path[i2]] ??= {};
            e = e[path[i2]];
            o = o[path[i2]];
          }
        }
        return data2;
      },
      { data }
    )
  };
}
function getKeyedChildren(el2) {
  const keyedChildren = /* @__PURE__ */ new Map();
  if (el2) {
    for (const child of el2.children) {
      const key = child.key || child?.getAttribute("data-lustre-key");
      if (key)
        keyedChildren.set(key, child);
    }
  }
  return keyedChildren;
}

// build/dev/javascript/lustre/client-runtime.ffi.mjs
var LustreClientApplication2 = class _LustreClientApplication {
  #root = null;
  #queue = [];
  #effects = [];
  #didUpdate = false;
  #isComponent = false;
  #model = null;
  #update = null;
  #view = null;
  static start(flags, selector, init4, update3, view2) {
    if (!is_browser())
      return new Error(new NotABrowser());
    const root2 = selector instanceof HTMLElement ? selector : document.querySelector(selector);
    if (!root2)
      return new Error(new ElementNotFound(selector));
    const app = new _LustreClientApplication(init4(flags), update3, view2, root2);
    return new Ok((msg) => app.send(msg));
  }
  constructor([model, effects], update3, view2, root2 = document.body, isComponent = false) {
    this.#model = model;
    this.#update = update3;
    this.#view = view2;
    this.#root = root2;
    this.#effects = effects.all.toArray();
    this.#didUpdate = true;
    this.#isComponent = isComponent;
    window.requestAnimationFrame(() => this.#tick());
  }
  send(action) {
    switch (true) {
      case action instanceof Dispatch: {
        this.#queue.push(action[0]);
        this.#tick();
        return;
      }
      case action instanceof Shutdown: {
        this.#shutdown();
        return;
      }
      default:
        return;
    }
  }
  emit(event2, data) {
    this.#root.dispatchEvent(
      new CustomEvent(event2, {
        bubbles: true,
        detail: data,
        composed: true
      })
    );
  }
  #tick() {
    this.#flush_queue();
    const vdom = this.#view(this.#model);
    const dispatch = (handler) => (e) => {
      const result = handler(e);
      if (result instanceof Ok) {
        this.send(new Dispatch(result[0]));
      }
    };
    this.#didUpdate = false;
    this.#root = morph(this.#root, vdom, dispatch, this.#isComponent);
  }
  #flush_queue(iterations = 0) {
    while (this.#queue.length) {
      const [next, effects] = this.#update(this.#model, this.#queue.shift());
      this.#didUpdate ||= !isEqual(this.#model, next);
      this.#model = next;
      this.#effects = this.#effects.concat(effects.all.toArray());
    }
    while (this.#effects.length) {
      this.#effects.shift()(
        (msg) => this.send(new Dispatch(msg)),
        (event2, data) => this.emit(event2, data)
      );
    }
    if (this.#queue.length) {
      if (iterations < 5) {
        this.#flush_queue(++iterations);
      } else {
        window.requestAnimationFrame(() => this.#tick());
      }
    }
  }
  #shutdown() {
    this.#root.remove();
    this.#root = null;
    this.#model = null;
    this.#queue = [];
    this.#effects = [];
    this.#didUpdate = false;
    this.#update = () => {
    };
    this.#view = () => {
    };
  }
};
var start = (app, selector, flags) => LustreClientApplication2.start(
  flags,
  selector,
  app.init,
  app.update,
  app.view
);
var is_browser = () => window && window.document;

// build/dev/javascript/lustre/lustre.mjs
var App = class extends CustomType {
  constructor(init4, update3, view2, on_attribute_change) {
    super();
    this.init = init4;
    this.update = update3;
    this.view = view2;
    this.on_attribute_change = on_attribute_change;
  }
};
var ElementNotFound = class extends CustomType {
  constructor(selector) {
    super();
    this.selector = selector;
  }
};
var NotABrowser = class extends CustomType {
};
function application(init4, update3, view2) {
  return new App(init4, update3, view2, new None());
}
function start3(app, selector, flags) {
  return guard(
    !is_browser(),
    new Error(new NotABrowser()),
    () => {
      return start(app, selector, flags);
    }
  );
}

// build/dev/javascript/modem/modem.ffi.mjs
var defaults = {
  handle_external_links: false,
  handle_internal_links: true
};
var do_init = (dispatch, options = defaults) => {
  document.body.addEventListener("click", (event2) => {
    const a2 = find_anchor(event2.target);
    if (!a2)
      return;
    try {
      const url = new URL(a2.href);
      const uri = uri_from_url(url);
      const is_external = url.host !== window.location.host;
      if (!options.handle_external_links && is_external)
        return;
      if (!options.handle_internal_links && !is_external)
        return;
      event2.preventDefault();
      if (!is_external) {
        window.history.pushState({}, "", a2.href);
        window.requestAnimationFrame(() => {
          if (url.hash) {
            document.getElementById(url.hash.slice(1))?.scrollIntoView();
          }
        });
      }
      return dispatch(uri);
    } catch {
      return;
    }
  });
  window.addEventListener("popstate", (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    const uri = uri_from_url(url);
    window.requestAnimationFrame(() => {
      if (url.hash) {
        document.getElementById(url.hash.slice(1))?.scrollIntoView();
      }
    });
    dispatch(uri);
  });
};
var find_anchor = (el2) => {
  if (el2.tagName === "BODY") {
    return null;
  } else if (el2.tagName === "A") {
    return el2;
  } else {
    return find_anchor(el2.parentElement);
  }
};
var uri_from_url = (url) => {
  return new Uri(
    /* scheme   */
    new (url.protocol ? Some : None)(url.protocol),
    /* userinfo */
    new None(),
    /* host     */
    new (url.host ? Some : None)(url.host),
    /* port     */
    new (url.port ? Some : None)(url.port),
    /* path     */
    url.pathname,
    /* query    */
    new (url.search ? Some : None)(url.search),
    /* fragment */
    new (url.hash ? Some : None)(url.hash.slice(1))
  );
};

// build/dev/javascript/modem/modem.mjs
function init2(handler) {
  return from2(
    (dispatch) => {
      return do_init(
        (uri) => {
          let _pipe = uri;
          let _pipe$1 = handler(_pipe);
          return dispatch(_pipe$1);
        }
      );
    }
  );
}

// build/dev/javascript/site/core.mjs
var Main = class extends CustomType {
};
var Blog = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var MainPage = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var BlogPage = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var MainPageModel = class extends CustomType {
  constructor(selected_language, selected_tool) {
    super();
    this.selected_language = selected_language;
    this.selected_tool = selected_tool;
  }
};
var ThisWebsite = class extends CustomType {
};
var OnRouteChange = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var SetLanguage = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var SetTool = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};

// build/dev/javascript/lustre/lustre/element/html.mjs
function text2(content) {
  return text(content);
}
function h1(attrs, children) {
  return element("h1", attrs, children);
}
function h2(attrs, children) {
  return element("h2", attrs, children);
}
function nav(attrs, children) {
  return element("nav", attrs, children);
}
function div(attrs, children) {
  return element("div", attrs, children);
}
function hr(attrs) {
  return element("hr", attrs, toList([]));
}
function p(attrs, children) {
  return element("p", attrs, children);
}
function a(attrs, children) {
  return element("a", attrs, children);
}
function br(attrs) {
  return element("br", attrs, toList([]));
}
function i(attrs, children) {
  return element("i", attrs, children);
}

// build/dev/javascript/shared/shared.mjs
var P = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var CodeSample = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var SectionHeader = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Link = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
var Br = class extends CustomType {
};

// build/dev/javascript/site/components.mjs
function header() {
  return nav(
    toList([class$("flex place-content-center")]),
    toList([
      div(
        toList([
          class$(
            "bg-rose-200 flex flex-row place-content-center w-fit py-1 px-3 space-x-5 rounded-b-lg"
          )
        ]),
        (() => {
          let _pipe = toList([
            ["about", "about"],
            ["other", "other"],
            ["cool", "cool"]
          ]);
          return map(
            _pipe,
            (x) => {
              return a(
                toList([
                  href(x[1]),
                  class$(
                    "text-rose-700 hover:underline hover:text-pink-700"
                  )
                ]),
                toList([text(x[0])])
              );
            }
          );
        })()
      )
    ])
  );
}
function title_text(title, extra_css) {
  return h1(
    toList([class$("text-rose-800 text-xl " + extra_css)]),
    toList([text(title)])
  );
}
function blog_title(title) {
  return h1(
    toList([class$("text-rose-800 text-3xl")]),
    toList([text(title)])
  );
}
function blog_post(contents) {
  return div(
    toList([]),
    map(
      contents,
      (x) => {
        if (x instanceof P) {
          let p2 = x[0];
          return p(
            toList([class$("inline")]),
            toList([text(p2)])
          );
        } else if (x instanceof CodeSample) {
          let code = x[0];
          return p(
            toList([class$("inline")]),
            toList([text(code)])
          );
        } else if (x instanceof SectionHeader) {
          let title = x[0];
          return title_text(title, "");
        } else if (x instanceof Link) {
          let link = x[0];
          let text3 = x[1];
          return a(
            toList([href(link), class$("inline")]),
            toList([text(text3)])
          );
        } else {
          return br(toList([]));
        }
      }
    )
  );
}

// build/dev/javascript/site/pages/blog/this_website.mjs
function page() {
  return div(
    toList([]),
    toList([
      header(),
      blog_title("This Website"),
      blog_post(
        toList([
          new SectionHeader("The basics"),
          new P("This site was made with "),
          new Link("https://gleam.run/", "gleam"),
          new P(" and "),
          new Link("https://lustre.build/", "lustre"),
          new P(". The entirety of the styling was done using Tailwind."),
          new Br(),
          new P(
            "All three of these projects together formed a solid stack. Gleam's language design in particular leads to some really nice code."
          ),
          new CodeSample("# nice code when I think of some"),
          new P(
            "Lustre was also nice and intuitive. My only real problem was a lack of a templating language, which lead to some rather ugly code. On the other hand, that made simply breaking parts into other functions trivial."
          ),
          new SectionHeader("The blog")
        ])
      )
    ])
  );
}

// build/dev/javascript/site/pages/blog.mjs
function list_posts() {
  let posts = toList([["This Website", "this_website"]]);
  return div(
    toList([]),
    map(
      posts,
      (x) => {
        return a(
          toList([href("blog/" + x[1])]),
          toList([text(x[0])])
        );
      }
    )
  );
}
function page2(model) {
  return page();
}
function from_string2(post) {
  if (post === "this_website") {
    return new ThisWebsite();
  } else {
    throw makeError(
      "panic",
      "pages/blog",
      31,
      "from_string",
      "unknown post",
      {}
    );
  }
}

// build/dev/javascript/lustre/lustre/event.mjs
function on2(name, handler) {
  return on(name, handler);
}
function on_click(msg) {
  return on2("click", (_) => {
    return new Ok(msg);
  });
}

// build/dev/javascript/site/util/icon.mjs
var Icon = class extends CustomType {
  constructor(icon, hover_color) {
    super();
    this.icon = icon;
    this.hover_color = hover_color;
  }
};
function render_link(icon, link) {
  return a(
    toList([
      href(link),
      target("_blank"),
      class$(
        "text-rose-700 hover:-translate-y-0.5 transition-transform ease-in-out delay-50 duration-150 " + icon.hover_color
      )
    ]),
    toList([
      i(
        toList([
          class$("text-inherit text-xl sm:text-3xl nf " + icon.icon)
        ]),
        toList([])
      )
    ])
  );
}
function render_button(icon, msg) {
  return i(
    toList([
      on_click(msg),
      class$(
        "text-xl sm:text-3xl nf " + icon.icon + " text-rose-700 hover:-translate-y-0.5 transition-transform ease-in-out delay-50 duration-150 " + icon.hover_color
      )
    ]),
    toList([])
  );
}

// build/dev/javascript/site/pages/home/languages.mjs
function languages(model) {
  return div(
    toList([class$("")]),
    toList([
      title_text("Languages:", "text-center"),
      div(
        toList([
          class$(
            "p-2 bg-rose-200 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg"
          )
        ]),
        toList([
          div(
            toList([class$("flex flex-row place-content-evenly")]),
            (() => {
              let _pipe = toList([
                [
                  new Icon("nf-dev-rust", "hover:text-red-600"),
                  "At this point, Rust is the language I have the most experience with. It took me a while to get used to the borrow checker, but now most projects I make have at least some rust. I'm simply in love with the language. Two of my biggest projects, Sakinyje and Radish, use rust to some degree."
                ],
                [
                  new Icon("nf-dev-python", "hover:text-yellow-600"),
                  "Python was the first language I used, and I'm still a fan of it today. Although I don't use it as much as I used to, I still write some scripts in it and keep track of the ecosystem."
                ],
                [
                  new Icon("nf-seti-lua", "hover:text-indigo-400"),
                  "Lua is a language that I have relatively little experience with, but it is extremely intuitive. My main knowledge comes from configuration written for Neovim and scripts I made for Davinci Resolve."
                ],
                [
                  new Icon("nf-custom-elixir", "hover:text-purple-600"),
                  "Elixir is one of my favorite languages, though I haven't used it a ton. However, I find it intuitive due to my previous functional programming experience, and it's certainly a joy to write. My knowledge of Erlang from Gleam also helps."
                ],
                [
                  new Icon("nf-seti-go", "hover:text-indigo-400"),
                  "Go is the first lower-level language that I managed to learn. The over-simplification of everything is certainly annoying, but it does make me more productive. I've written a lot of concurrent programs and scrapers in Go."
                ],
                [
                  new Icon("nf-dev-haskell", "hover:text-purple-600"),
                  "I took the University of Helsinki Haskell MOOC, so I have a decent amount of experience with it. I haven't written much in Haskell since, but the principals have proven invaluable in other languages. Plus, now I know what a monad is."
                ],
                [
                  new Icon("nf-cod-terminal_bash", "hover:text-slate-900"),
                  "I love writing shell scripts. I learned a lot about bash (and posix sh) in my projects to make a shell, to compile a language to posix sh, andm y bash typing system."
                ],
                [
                  new Icon("nf-dev-javascript_badge", "hover:text-yellow-600"),
                  "Javascript was the second language I learned. It's not my favorite language, but it's certainly useful."
                ]
              ]);
              return map(
                _pipe,
                (x) => {
                  return render_button(x[0], new SetLanguage(x[1]));
                }
              );
            })()
          ),
          p(
            toList([class$("text-rose-900 m-1 pt-2 text-center")]),
            toList([
              text2(
                unwrap(
                  model.selected_language,
                  "Click on a language to see more detailed information"
                )
              )
            ])
          )
        ])
      )
    ])
  );
}

// build/dev/javascript/site/pages/home/tools.mjs
function tools(model) {
  return div(
    toList([class$("my-3")]),
    toList([
      title_text("Tools:", "text-center"),
      div(
        toList([
          class$(
            "p-2 bg-rose-200 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg"
          )
        ]),
        toList([
          div(
            toList([class$("flex flex-row place-content-evenly")]),
            (() => {
              let _pipe = toList([
                [
                  new Icon("nf-dev-git", "hover:text-orange-600"),
                  "I use the git cli daily to manage all of my projects, most of which are on github. "
                ],
                [
                  new Icon("nf-fa-linux", "hover:text-slate-900"),
                  "I've been using linux for around a year and a half, and I've experimented with many distros and desktop environments. I'm currently using Arch (btw)"
                ],
                [
                  new Icon("nf-linux-neovim", "hover:text-green-500"),
                  "Soon after I switched to linux, I began using neovim. These days it's the only editor I use, and I made a complete configuration from scratch."
                ],
                [
                  new Icon("nf-linux-hyprland", "hover:text-cyan-500"),
                  "Hyprland has been my go-to window manager for a long time now. I've customized it with vim-style keybinds and setting it up taught me a lot about Linux and Wayland."
                ],
                [
                  new Icon("nf-cod-terminal", "hover:text-slate-800"),
                  "When I first started programming on Windows, I was terrified of the shell. These days however, I spend as much time as possible in my terminal (currently Kitty)."
                ]
              ]);
              return map(
                _pipe,
                (x) => {
                  return render_button(x[0], new SetTool(x[1]));
                }
              );
            })()
          ),
          p(
            toList([class$("text-rose-900 m-1 pt-2 text-center")]),
            toList([
              text2(
                unwrap(
                  model.selected_tool,
                  "Click on a tool to see more detailed information"
                )
              )
            ])
          )
        ])
      )
    ])
  );
}

// build/dev/javascript/site/util/projects.mjs
var Project = class extends CustomType {
  constructor(name, description) {
    super();
    this.name = name;
    this.description = description;
  }
};
function project_to_html(project) {
  return div(
    toList([
      class$(
        "bg-rose-200 p-3 rounded-lg max-w-80 m-3 shadow-sm transition-all duration-150 hover:shadow-md"
      )
    ]),
    toList([
      h2(
        toList([class$("text-rose-700 text-lg hover:underline")]),
        toList([text(project.name)])
      ),
      p(
        toList([class$("text-rose-800")]),
        toList([text(project.description)])
      )
    ])
  );
}
function render_all() {
  let project_html = (() => {
    let _pipe = toList([
      new Project(
        "Radish",
        "A highly concurrent unix shell written in Gleam and Rust"
      ),
      new Project(
        "Sakinyje",
        "A modern desktop app for learning languages via immersion which seamlessly integrates with Anki"
      ),
      new Project("Anteater", "A TUI drawing app written in Python"),
      new Project(
        "Bashtyped",
        "An early exploration of making optional typing for bash"
      ),
      new Project(
        "This website",
        "My portfolio website, written entirely in Gleam."
      ),
      new Project(
        "Fishbang",
        "A fish plugin which emulates the various bash bang commands"
      )
    ]);
    return map(_pipe, project_to_html);
  })();
  return div(
    toList([]),
    prepend(title_text("Projects:", ""), project_html)
  );
}

// build/dev/javascript/site/pages/home.mjs
function page3(model) {
  let socials = (() => {
    let _pipe = toList([
      [
        new Icon("nf-md-github", "hover:text-rose-900"),
        "https://github.com/BrewingWeasel"
      ],
      [
        new Icon("nf-md-linkedin", "hover:text-fuchsia-600"),
        "https://www.linkedin.com/in/finnian-brewer-208b162b5"
      ]
    ]);
    return map(_pipe, (x) => {
      return render_link(x[0], x[1]);
    });
  })();
  return div(
    toList([class$("dark")]),
    toList([
      header(),
      div(
        toList([class$("flex flex-col sm:flex-row")]),
        toList([
          div(
            toList([class$("sm:w-2/3 w-full sm:ml-4 flex flex-col")]),
            toList([
              div(
                toList([class$("flex space-x-2 mr-4 items-baseline")]),
                prepend(
                  h1(
                    toList([
                      class$(
                        "text-rose-800 text-6xl m-2 font-bold grow"
                      )
                    ]),
                    toList([text("Labas!")])
                  ),
                  socials
                )
              ),
              br(toList([])),
              p(
                toList([class$("text-rose-900 text-md mx-4")]),
                toList([
                  text(
                    "I'm a 16-year-old self-taught programmer from Portland, Oregon. I'm interested in languages, linux, terminals and functional programming. When I get the chance, I love reading, running and backpacking. I write rust in neovim in a wayland tiling window manager on Arch, btw."
                  )
                ])
              ),
              hr(
                toList([class$("border-rose-900 border-1 mx-4 my-3")])
              ),
              languages(model),
              tools(model),
              list_posts()
            ])
          ),
          div(toList([]), toList([render_all()]))
        ])
      )
    ])
  );
}

// build/dev/javascript/site/site.mjs
function on_url_change(uri) {
  let $ = path_segments(uri.path);
  if ($.hasLength(2) && $.head === "blog") {
    let v = $.tail.head;
    return new OnRouteChange(new Blog(v));
  } else {
    return new OnRouteChange(new Main());
  }
}
function new_main_page() {
  return new MainPage(new MainPageModel(new None(), new None()));
}
function init3(_) {
  return [new_main_page(), init2(on_url_change)];
}
function update2(model, msg) {
  return [
    (() => {
      if (msg instanceof SetLanguage) {
        let v = msg[0];
        if (!(model instanceof MainPage)) {
          throw makeError(
            "assignment_no_match",
            "site",
            35,
            "update",
            "Assignment pattern did not match",
            { value: model }
          );
        }
        let model$1 = model[0];
        return new MainPage(
          model$1.withFields({ selected_language: new Some(v) })
        );
      } else if (msg instanceof SetTool) {
        let v = msg[0];
        if (!(model instanceof MainPage)) {
          throw makeError(
            "assignment_no_match",
            "site",
            39,
            "update",
            "Assignment pattern did not match",
            { value: model }
          );
        }
        let model$1 = model[0];
        return new MainPage(model$1.withFields({ selected_tool: new Some(v) }));
      } else {
        let page4 = msg[0];
        if (page4 instanceof Blog) {
          let blog = page4[0];
          return new BlogPage(from_string2(blog));
        } else {
          return new_main_page();
        }
      }
    })(),
    none()
  ];
}
function view(model) {
  if (model instanceof MainPage) {
    let model$1 = model[0];
    return page3(model$1);
  } else {
    let model$1 = model[0];
    return page2(model$1);
  }
}
function main() {
  let app = application(init3, update2, view);
  let $ = start3(app, "#app", void 0);
  if (!$.isOk()) {
    throw makeError(
      "assignment_no_match",
      "site",
      13,
      "main",
      "Assignment pattern did not match",
      { value: $ }
    );
  }
  return $;
}

// build/.lustre/entry.mjs
main();
