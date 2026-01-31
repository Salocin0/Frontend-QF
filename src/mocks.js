// mocks.js
// Ensure TextEncoder/TextDecoder exist before loading MSW (some MSW deps expect these globals)
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

// Ensure BroadcastChannel exists (MSW uses BroadcastChannel in node environment internals)
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

// Polyfill Response/Request/Headers/fetch for msw internals that expect WHATWG fetch APIs
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

// Minimal streams polyfills (some MSW internals use streams in node)
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

let rest;
let setupServer;
try {
  const { createRequire } = require('module');
  const req = createRequire(process.cwd() + '/package.json');
  const msw = req('msw');
  // Support CJS and ESM shapes
  rest = msw.rest || (msw.default && msw.default.rest);
} catch (e) {
  rest = null;
}
try {
  const { createRequire } = require('module');
  const req = createRequire(process.cwd() + '/package.json');
  const mswNode = req('msw/node');
  setupServer = mswNode.setupServer || (mswNode.default && mswNode.default.setupServer);
} catch (e) {
  setupServer = null;
}

let server;
if (rest && setupServer) {
  // Define handlers only when msw is available
  server = setupServer(
    rest.post('http://127.0.0.1:8000/login/', (req, res, ctx) => {
      const { contraseña, correoElectronico } = req.body;

      // Simula una respuesta exitosa para un usuario específico
      if (correoElectronico === 'usuario@example.com' && contraseña === 'password123') {
        return res(ctx.json({ code: 200, data: { sessionId: 'session123' } }));
      }

      // Simula una respuesta fallida para otros casos
      return res(ctx.status(401), ctx.json({ code: 401, error: 'Invalid credentials' }));
    })
  );
} else {
  // Fallback noop server so tests don't crash when msw isn't available yet
  // This allows iterating on tests while fixing msw transform issues.
  // eslint-disable-next-line no-console
  console.warn('[msw] msw or msw/node not available in test environment — using noop server');
  server = {
    listen: () => {},
    resetHandlers: () => {},
    close: () => {},
    use: () => {},
  };

  // Provide a minimal `rest` stub so tests that call `rest.post(...)` don't throw.
  rest = {
    post: () => ({ /* noop handler stub */ }),
    get: () => ({ /* noop handler stub */ }),
    put: () => ({ /* noop handler stub */ }),
    delete: () => ({ /* noop handler stub */ }),
  };
}

module.exports = { server, rest };
