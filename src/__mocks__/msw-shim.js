// msw-shim: provide a compatible CJS wrapper for tests to import { rest } from 'msw'
// Lazy proxy to the real msw `rest` if available at runtime via global.__MSW_REST
// This avoids requiring 'msw' at module load time (imports occur before setup files run).
const noopHandler = () => ({});
let _cachedReal = null;
let proxy = null;
proxy = new Proxy({}, {
  get(_, prop) {
    return (...args) => {
      const real = _cachedReal || global.__MSW_REST;
      // Avoid delegating to proxy itself (could cause recursion)
      if (real && real !== proxy && typeof real[prop] === 'function') {
        // cache resolved real implementation for future calls
        _cachedReal = real;
        return real[prop](...args);
      }
      // return a noop handler to keep tests from throwing
      return noopHandler();
    };
  }
});

module.exports = { rest: proxy };
