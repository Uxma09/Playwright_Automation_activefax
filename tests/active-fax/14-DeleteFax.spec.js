import { test, expect, describe } from './fixtures.js';

describe('Delete Fax', () => {
  test('FaxDeletion', async ({ page }) => {

    await page.getByText('Items ListingGroup by:').click();
    await page.waitForSelector('tr');

    let found = false;
    const rows = page.locator('tr');
    const rowCount = await rows.count();

    for (let i = rowCount - 1; i >= 0; i--) {

      const row = rows.nth(i);

      // Select only INDEXED rows excluding others
      if (
        (await row.locator('text=INDEXED').count()) > 0 &&
        (await row.locator('text=REJECTED').count()) === 0 &&
        (await row.locator('text=SCHEDULED').count()) === 0 &&
        (await row.locator('text=REVIEWED').count()) === 0
      ) {

        await row.scrollIntoViewIfNeeded();

        const viewItemLink = row.getByRole('link', { name: /View Item/ });
        await expect(viewItemLink).toBeVisible();
        await viewItemLink.click();

        // 🔹 Wait until either Check Out OR Back to Listing appears
        await Promise.race([
          page.getByRole('button', { name: 'Check Out' })
              .waitFor({ state: 'visible', timeout: 10000 })
              .catch(() => {}),
          page.getByRole('button', { name: 'Back to Listing' })
              .waitFor({ state: 'visible', timeout: 10000 })
              .catch(() => {})
        ]);

        const checkOutBtn = page.getByRole('button', { name: 'Check Out' });
        const checkInBtn = page.getByRole('button', { name: 'Check In' });
        const backBtn = page.getByRole('button', { name: 'Back to Listing' });

        const isCheckOutVisible = await checkOutBtn.isVisible().catch(() => false);

        // 🔹 If no document / warning page → go back
        if (!isCheckOutVisible) {
          console.log('No document or warning page → Going Back');

          if (await backBtn.isVisible().catch(() => false)) {
            await backBtn.click();
          } else {
            await page.goBack();
          }

          await page.waitForSelector('text=Items ListingGroup by:', { timeout: 10000 });
          continue;
        }

        // 🔹 If document exists → perform checkout
        if (isCheckOutVisible) {
          await checkOutBtn.click();
          await page.waitForLoadState('networkidle');
        } else if (await checkInBtn.isVisible().catch(() => false)) {
          await checkInBtn.click();
          await checkOutBtn.waitFor({ state: 'visible', timeout: 10000 });
          await checkOutBtn.click();
        }

        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error('No accessible INDEXED row found with valid document');
    }

  });
});

