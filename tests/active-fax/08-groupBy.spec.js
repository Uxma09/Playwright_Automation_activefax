import { test, expect, describe } from './fixtures.js';

describe('Fax Listing', () => {
  test('GroupBy', async ({ page }) => {
      

await page.getByRole('button', { name: 'Group by' }).click();
  await page.locator('div').filter({ hasText: /^Items Listing$/ }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Group by' }).click();
  await page.getByLabel('Group by').getByText('Office').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Group by' }).click();
  await page.getByRole('checkbox', { name: 'Physician' }).check();
  await page.getByRole('checkbox', { name: 'Account No' }).check();
  await page.getByRole('checkbox', { name: 'Queue' }).check();
  await page.getByRole('checkbox', { name: 'Status' }).check();
  await page.locator('form').getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Reset Grouping' }).click();




    await page.waitForTimeout(800);
  });
});