import { test, expect, describe } from './fixtures.js';

describe('Fax Listing Test Suite', () => {
  test('Advance Search', async ({ page }) => {
   await page.getByRole('button').nth(3).click();
  await page.getByRole('dialog').getByRole('textbox', { name: 'Select Date' }).click();
  await page.getByRole('gridcell', { name: /March 11/ }).click();
  await page.locator('select[name="office"]').selectOption('2');
  await page.locator('.mb-3 > .rmsc > .dropdown-container > .dropdown-heading > .dropdown-heading-value').first().click();
  await page.getByRole('checkbox', { name: 'Johnson, Walter Mr' }).check();
  await page.getByText('Sending ContactAll items are').click();
  await page.getByRole('textbox', { name: 'Object Id' }).click();
  await page.getByRole('textbox', { name: 'Object Id' }).fill('368');
  await page.locator('div:nth-child(7) > .rmsc > .dropdown-container > .dropdown-heading > .dropdown-heading-value').click();
  await page.getByRole('checkbox', { name: 'History And Physical' }).check();
  await page.locator('div').filter({ hasText: /^Progress Notes$/ }).click();
  await page.getByRole('checkbox', { name: 'Labs' }).check();
  await page.getByRole('checkbox', { name: 'Physician Orders' }).check();
  await page.getByText('Date ReviewedSingleRangeSender InformationOfficeSelect OfficeGoldFaxHealthware').click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('sonia');
  await page.getByRole('textbox', { name: 'First Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('sabeen');
  await page.getByRole('dialog').getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button').nth(4).click();
    
  //  // ========== FIRST SEARCH ==========
  //   // Open advance search
  //   await page.getByRole('button').nth(3).click();
  //   await page.waitForTimeout(500);
    
  //   // Select office
  //   await page.locator('select[name="office"]').selectOption('2');
  //   await page.waitForTimeout(300);
    
  //   // Select sending contact
  //   await page.locator('.mb-3 > .rmsc > .dropdown-container > .dropdown-heading').first().click();
  //   await page.waitForTimeout(300);
  //   await page.getByRole('checkbox', { name: 'Johnson, Walter Mr' }).check();
  //   await page.waitForTimeout(300);
  //   // Close dropdown
  //   await page.locator('.mb-3 > .rmsc > .dropdown-container > .dropdown-heading').first().click();
  //   await page.waitForTimeout(500);
    
  //   // Select item types
  //   await page.locator('div:nth-child(7) > .rmsc > .dropdown-container > .dropdown-heading').first().click();
  //   await page.waitForTimeout(400);
  //   await page.getByRole('checkbox', { name: 'Test Fax Cover Page' }).check();
  //   await page.waitForTimeout(400);
  //   await page.getByRole('checkbox', { name: 'Progress Notes' }).check();
  //   await page.waitForTimeout(400);
  //   await page.getByRole('checkbox', { name: 'Physician Orders' }).check();
  //   await page.waitForTimeout(400);
  //   await page.getByRole('checkbox', { name: 'History And Physical' }).check();
  //   await page.waitForTimeout(500);
  //   // Close dropdown
  //   await page.locator('div:nth-child(7) > .rmsc > .dropdown-container > .dropdown-heading').first().click();
  //   await page.waitForTimeout(500);
    
  //   // Fill first name
  //   await page.getByRole('textbox', { name: 'First Name' }).click();
  //   await page.waitForTimeout(200);
  //   await page.getByRole('textbox', { name: 'First Name' }).fill('sarah');
  //   await page.waitForTimeout(500);
    
  //   // First search
  //   await page.getByRole('dialog').getByRole('button', { name: 'Search' }).click();
  //   await page.waitForTimeout(2000);




    await page.getByRole('button').nth(4).click();
    await page.waitForTimeout(2000);
  });
});
