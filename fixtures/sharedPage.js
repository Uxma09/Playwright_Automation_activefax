const base = require('@playwright/test');

// Module state is per worker process, so each worker reuses one context/page.
let sharedContext;
let sharedPage;

const test = base.test.extend({
  context: async ({ browser, baseURL }, use) => {
    if (!sharedContext) {
      // Manually created contexts don't inherit config `use`, so pass baseURL explicitly.
      sharedContext = await browser.newContext({ baseURL });
    }
    await use(sharedContext);
  },
  page: async ({ context }, use) => {
    if (!sharedPage || sharedPage.isClosed()) {
      sharedPage = await context.newPage();
    }
    await use(sharedPage);
  },
});

module.exports = { test, expect: base.expect };
