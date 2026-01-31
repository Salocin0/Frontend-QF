test('msw rest availability', () => {
  let rest;
  try {
    const msw = require('msw');
    // eslint-disable-next-line no-console
    console.log('[debug] msw keys:', Object.keys(msw));
    rest = msw.rest || (msw.default && msw.default.rest);
    // eslint-disable-next-line no-console
    console.log('[debug] rest resolved:', !!rest);
  } catch (e) {
    rest = undefined;
    // eslint-disable-next-line no-console
    console.error('[debug] require(msw) threw', e && e.message);
  }

  // eslint-disable-next-line no-console
  console.log('[debug] rest is', typeof rest, !!rest);
  expect(rest).toBeDefined();
});
