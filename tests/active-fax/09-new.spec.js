import { test, expect, describe } from './fixtures.js';
describe('Dashboard Test Suite', () => {
  test('Dashboard rview', async ({ page }) => {

 await page.getByRole('button', { name: 'Columns Visibility' }).click();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Pages' }).uncheck();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Pages' }).check();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Item Received' }).uncheck();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Item Received' }).check();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Account No' }).uncheck();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Account No' }).check();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Status' }).uncheck();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Status' }).check();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Notes' }).uncheck();
    await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: 'Notes' }).check();
    await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Columns Visibility' }).click();

   
     });
});