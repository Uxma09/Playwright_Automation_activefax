import { test, expect, describe } from './fixtures.js';

describe('Fax Listing Test Suite', () => {
  test('Listing ', async ({ page }) => {
    console.log('fax listing ');
      await page.locator('div').filter({ hasText: 'FacilityFacility AFacility' }).nth(3).click();
  await page.waitForTimeout(500);
  await page.getByRole('combobox').selectOption('TST');
  await page.waitForTimeout(500);
  await page.getByRole('combobox').selectOption('HWS');
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Close' }).click();

    await page.waitForTimeout(800);
  });
});
