import { test, expect, describe } from './fixtures.js';

describe('Last test suit', () => {
  test('Logout', async ({ page }) => {

  await page.getByRole('button', { name: 'admin Administrators' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

    await page.waitForTimeout(800);
  });
});
