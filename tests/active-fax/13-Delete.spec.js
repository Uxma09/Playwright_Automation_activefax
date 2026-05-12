import { test, expect, describe } from './fixtures.js';

describe('Confirmation of Fax', () => {
  test('FaxConfirmation', async ({ page }) => {
    await page.goto('https://axdemo.healthwaresystems.com/listing', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForURL('**/listing', { timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await expect(page).toHaveURL(/\/listing/);

    // Skip when current filters/date produce no rows to operate on.
    const noDataRow = page.getByRole('row', { name: /no data found/i });
    const noDataHeading = page.getByRole('heading', { name: /no data found/i });
    const noDataVisible = await noDataRow.first().isVisible().catch(() => false)
      || await noDataHeading.first().isVisible().catch(() => false);
    test.skip(noDataVisible, 'No fax items available for deletion in current filters/date.');

    // Find a row with a viewable item
    const rows = page.locator('table tr');
    const rowCount = await rows.count();
    let found = false;

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const viewItemCell = row.locator('td:nth-child(4) > .d-flex > div > .m-0');
      if (await viewItemCell.count() === 0) continue;

      await row.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      try {
        await viewItemCell.first().click({ force: true });

        // Check if "Check Out" or "Check In" is present
        const checkOutBtn = page.getByRole('button', { name: /^check\s*out$/i });
        const checkInBtn = page.getByRole('button', { name: /^check\s*in$/i });

        const checkOutVisible = await checkOutBtn.first()
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false);

        const checkInVisible = await checkInBtn.first()
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(() => true)
          .catch(() => false);

        // Check for "Check In" first, then click "Check Out"
        if (checkInVisible) {
          await checkInBtn.first().click();
          await page.waitForTimeout(500);
          await checkOutBtn.first().click();
        } else if (checkOutVisible) {
          await checkOutBtn.first().click();
        } else {
          await page.getByRole('button', { name: /back to listing/i }).click().catch(() => {});
          await page.waitForTimeout(500);
          continue;
        }

        await page.waitForTimeout(1000);

        // Register dialog handler before the action that triggers it
        page.once('dialog', dialog => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialog.dismiss().catch(() => {});
        });

        await page.getByRole('button', { name: 'Delete' }).click();
        await page.waitForTimeout(800);

        found = true;
        break;
      } catch (err) {
        console.error('Test 13: Error in row:', err);
        continue;
      }
    }

    if (!found) {
      throw new Error('Test 13: No deletable row found. Either no data matched filters/date or rows were not check-out eligible.');
    }

    // Navigate back to the listing page
    await page.goto('https://axdemo.healthwaresystems.com/listing', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForURL('**/listing', { timeout: 15000 });
    await page.waitForTimeout(800);
  });
});