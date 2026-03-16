import { test, expect, describe } from './fixtures.js';

describe('Rejct Fax', () => {
  test('Fax Rejection', async ({ page }) => {
//   await page.getByRole('button', { name: 'Columns Visibility' }).click();
//   await page.waitForTimeout(600);
//   await page.getByRole('button', { name: 'Reset Grouping' }).click();
//   await page.waitForTimeout(600);
//   await page.waitForTimeout(500);
//   await page.getByText('Range').click();
//   await page.waitForTimeout(500);
//   await page.getByRole('button', { name: 'Search' }).click();
//   await page.waitForTimeout(500);
//   await page.getByText('Items ListingGroup by:').click();
//   await page.waitForTimeout(500);
//   await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
//    await page.waitForTimeout(500);
  
//  // Find a row with 'INDEXED' status, not 'SCHEDULED' or 'REVIEWED'
//     const rows = page.locator('tr');
//     const rowCount = await rows.count();
//     let found = false;
//     for (let i = 0; i < rowCount; i++) {
//       const row = rows.nth(i);
//       if (
//         (await row.locator('text=INDEXED').count()) > 0 &&
//         (await row.locator('text=SCHEDULED').count()) === 0 &&
//         (await row.locator('text=REVIEWED').count()) === 0
//       ) {
//         // Click the 'View Item' link in that row
//         await row.getByRole('link', { name: /View Item/ }).click();
//         found = true;
//         break;
//       }
//     }
//     if (!found) throw new Error('No row with INDEXED status found (excluding SCHEDULED/REVIEWED)');


//   //await page.locator('tr:nth-child(35) > td:nth-child(4) > .d-flex > div > .m-0').click();
//   // Robust check out/check in logic
//   const checkOutBtn = page.getByRole('button', { name: 'Check Out' });
//   const checkInBtn = page.getByRole('button', { name: 'Check In' });
//   if (await checkOutBtn.isVisible()) {
//     await checkOutBtn.click();
//     await page.waitForTimeout(600);
//   } else if (await checkInBtn.isVisible()) {
//     await checkInBtn.click();
//     await page.waitForTimeout(600);
//     await checkOutBtn.waitFor({ state: 'visible', timeout: 10000 });
//     await checkOutBtn.click();
//     await page.waitForTimeout(600);
//   }
//   await page.getByRole('button', { name: 'Reject' }).click();
//   await page.waitForTimeout(800);
//   await page.getByRole('combobox').nth(3).selectOption('1178');
//   await page.getByRole('combobox').nth(4).selectOption('1004');
//   await page.getByRole('textbox', { name: 'Default Messages' }).click();
//   await page.getByRole('checkbox', { name: 'Send Cover Page Only' }).check();
//   await page.getByRole('textbox', { name: 'Default Messages' }).click();
//   await page.getByRole('checkbox', { name: 'Send Cover Page Only' }).press('t');
//   await page.getByRole('textbox', { name: 'Default Messages' }).fill('test ');
//   await page.getByRole('button', { name: 'Send' }).click();
//     await page.waitForTimeout(800);
  });
});
