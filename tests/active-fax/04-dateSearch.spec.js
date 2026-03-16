import { test, expect, describe } from './fixtures.js';

describe('dateSearch', () => {
  test('ViewListing Overview', async ({ page }) => {
  await page.getByText('Range').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByText('Single').click();
  await page.getByRole('button', { name: 'Search' }).click();

    await page.waitForTimeout(2000);
  });
});



