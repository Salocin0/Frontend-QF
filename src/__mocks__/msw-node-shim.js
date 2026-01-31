// Expose a shim setupServer that delegates to global.__MSW_SETUPSERVER when available.
// If not available, provide a noop server implementation so tests don't crash.
function noopServer() {
  return {
    listen: () => {},
    resetHandlers: () => {},
    close: () => {},
    use: () => {},
  };
}

module.exports = {
  setupServer: (...handlers) => {
    const realSetupServer = global.__MSW_SETUPSERVER;
    if (typeof realSetupServer === 'function') {
      return realSetupServer(...handlers);
    }
    return noopServer(...handlers);
  }
};