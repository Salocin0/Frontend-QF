// Polyfills that must be applied BEFORE test modules are imported
// TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  try {
    const { TextEncoder, TextDecoder } = require('util');
    if (TextEncoder) global.TextEncoder = TextEncoder;
    if (TextDecoder) global.TextDecoder = TextDecoder;
  } catch (e) {
    // ignore
  }
  if (typeof global.TextEncoder === 'undefined') {
    try {
      const te = require('text-encoding');
      if (te && te.TextEncoder) global.TextEncoder = te.TextEncoder;
      if (te && te.TextDecoder) global.TextDecoder = te.TextDecoder;
    } catch (e) {
      // ignore
    }
  }
}

// BroadcastChannel
if (typeof global.BroadcastChannel === 'undefined') {
  class _BC {
    constructor() { this.onmessage = null; }
    postMessage() { /* noop */ }
    close() { /* noop */ }
    addEventListener() { /* noop */ }
    removeEventListener() { /* noop */ }
  }
  global.BroadcastChannel = _BC;
}

// Streams
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = class {
    getWriter() {
      return {
        write: async () => {},
        close: async () => {},
        releaseLock: () => {},
      };
    }
  };
}
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class {
    constructor() {}
  };
}
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class {
    constructor() { this.readable = new global.ReadableStream(); this.writable = new global.WritableStream(); }
  };
}

// ResizeObserver (jsdom doesn't implement it; several components use it to
// measure their own width for responsive layout)
if (typeof global.ResizeObserver === 'undefined') {
  class _ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      const rect = target.getBoundingClientRect
        ? target.getBoundingClientRect()
        : { width: 0, height: 0 };
      this.callback([{ target, contentRect: rect }]);
    }
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver = _ResizeObserver;
  window.ResizeObserver = _ResizeObserver;
}

// WHATWG fetch objects
if (typeof global.Response === 'undefined' || typeof global.Request === 'undefined' || typeof global.Headers === 'undefined') {
  try {
    const nodeFetch = require('node-fetch');
    if (nodeFetch) {
      global.fetch = global.fetch || nodeFetch;
      global.Response = global.Response || nodeFetch.Response;
      global.Request = global.Request || nodeFetch.Request;
      global.Headers = global.Headers || nodeFetch.Headers;
    }
  } catch (e) {
    // ignore
  }
}
