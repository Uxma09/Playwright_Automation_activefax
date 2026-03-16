

import { test as base } from '@playwright/test';

let sharedContext;
let sharedPage;

export const test = base.extend({
  context: async ({ browser }, use) => {
    if (!sharedContext) {
      sharedContext = await browser.newContext();
      sharedPage = await sharedContext.newPage();
      
    }
    await use(sharedContext);
  },
  page: async ({ context }, use) => {
    await use(sharedPage);
  },
});

export { expect, describe } from '@playwright/test';
