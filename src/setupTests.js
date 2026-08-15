import '@testing-library/jest-dom';

// Polyfill necesario para MSW en node (TextEncoder/TextDecoder)
if (typeof global.TextEncoder === 'undefined') {
  try {
    const util = require('util');
    if (util && util.TextEncoder) global.TextEncoder = util.TextEncoder;
    if (util && util.TextDecoder) global.TextDecoder = util.TextDecoder;
  } catch (e) {
    // ignore
  }

  if (typeof global.TextEncoder === 'undefined') {
    // fallback a paquete 'text-encoding'
    const te = require('text-encoding');
    if (te && te.TextEncoder) global.TextEncoder = te.TextEncoder;
    if (te && te.TextDecoder) global.TextDecoder = te.TextDecoder;
  }
}

// Polyfill mínimo para BroadcastChannel (usado por msw en node)
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

// Polyfill mínimo de streams (Writable/Readable/Transform) usados por algunas libs
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

// Polyfill de ResizeObserver (jsdom no lo implementa; varios componentes lo
// usan para medir su propio ancho y aplicar layout responsive)
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

// Try to load real MSW runtime *now* and expose to shims via globals
try {
  const { createRequire } = require('module');
  const req = createRequire(process.cwd() + '/package.json');
  const msw = req('msw');
  const mswNode = req('msw/node');
  global.__MSW_REST = msw.rest || (msw.default && msw.default.rest);
  global.__MSW_SETUPSERVER = mswNode.setupServer || (mswNode.default && mswNode.default.setupServer);
  // eslint-disable-next-line no-console
  console.debug('[setupTests] MSW runtime loaded:', !!global.__MSW_REST, !!global.__MSW_SETUPSERVER);
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('[setupTests] Could not load msw at setup time:', e && e.message);
}

// Inicia MSW globalmente para las pruebas (requiere transformar paquetes ESM en Jest)
import { server } from './mocks';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
  // Silenciar errores de consola en tests para requests no manejados
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  console.error.mockRestore();
});

afterAll(() => {
  server.close();
});

