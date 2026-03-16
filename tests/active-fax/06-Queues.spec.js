import { test, expect, describe } from './fixtures.js';

describe('dateSearch', () => {
  test('Queues', async ({ page }) => {
    
   //await page.locator('div').filter({ hasText: 'FacilityFacility AFacility' }).nth(3).click();
   await page.getByText('Queues', { exact: true }).click();
   await page.waitForTimeout(300);
  await page.getByRole('img').nth(3).click();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Main Inbox' }).check();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('img').nth(4).click();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Central Scheduling' }).check();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('img').nth(4).click();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Radiology' }).check();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('img').nth(4).click();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Lab' }).check();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('img').nth(4).click();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Complete' }).check();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('img').nth(4).click();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Main Inbox' }).uncheck();
  await page.waitForTimeout(300);
  await page.getByRole('checkbox', { name: 'Central Scheduling' }).uncheck();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button').nth(5).click();

    await page.waitForTimeout(300);
  });
});


