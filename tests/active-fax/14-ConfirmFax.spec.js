import { test, expect, describe } from './fixtures.js';

describe('Delete Fax', () => {
  test('FaxDeletion', async ({ page }) => {
    console.log('Test 14: Start');

    await page.goto('https://axdemo.healthwaresystems.com/listing', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForURL('**/listing', { timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1000);

    // Ensure results are fetched using Date Received range before iterating rows.
    const rangeRadio = page.getByRole('radio', { name: /range/i });
    if (await rangeRadio.first().isVisible().catch(() => false)) {
      await rangeRadio.first().check({ force: true }).catch(async () => {
        await page.locator('label:has-text("Range")').first().click({ force: true });
      });
    }

    const searchBtn = page.getByRole('button', { name: /^search$/i });
    if (await searchBtn.first().isVisible().catch(() => false)) {
      await searchBtn.first().click({ force: true });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(800);
    }

    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    const noDataHeading = page.getByRole('heading', { name: /no data found/i });
    if (await noDataHeading.first().isVisible().catch(() => false)) {
      throw new Error('Test 14: Listing returned no data after selecting Date Received Range and clicking Search.');
    }

    // Iterate rows to find one with Check In / Check Out
    const rows = page.locator('table tr');
    const rowCount = await rows.count();
    let found = false;

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const viewItemCell = row.locator('td:nth-child(4) > .d-flex > div > .m-0');
      if (await viewItemCell.count() === 0) continue;

      await row.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      try {
        await viewItemCell.first().click({ force: true });
        await page.waitForTimeout(1500);

        const checkOutBtn = page.getByRole('button', { name: /^check\s*out$/i });
        const checkInBtn  = page.getByRole('button', { name: /^check\s*in$/i });
        const backBtn     = page.getByRole('button', { name: /back to listing/i });

        await Promise.race([
          checkOutBtn.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
          checkInBtn.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
        ]);

        const checkOutVisible = await checkOutBtn.first().isVisible().catch(() => false);
        const checkOutEnabled = checkOutVisible && await checkOutBtn.first().isEnabled().catch(() => false);
        const checkInVisible  = await checkInBtn.first().isVisible().catch(() => false);
        const checkInEnabled  = checkInVisible && await checkInBtn.first().isEnabled().catch(() => false);

        console.log(`Test 14: checkOutVisible=${checkOutVisible} checkOutEnabled=${checkOutEnabled} checkInVisible=${checkInVisible} checkInEnabled=${checkInEnabled}`);

        if (!checkOutEnabled && !checkInEnabled) {
          console.log('Test 14: Neither Check In nor Check Out available, skipping row...');
          const backVisible = await backBtn.isVisible().catch(() => false);
          if (backVisible) {
            await backBtn.click();
            await page.waitForSelector('text=View Item', { timeout: 5000 });
            await page.waitForTimeout(500);
          }
          continue;
        }

        if (checkOutEnabled) {
          console.log('Test 14: Check Out is available, clicking...');
          await checkOutBtn.first().scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);
          await checkOutBtn.first().click({ force: true });
          console.log('Test 14: Check Out clicked.');
          await page.waitForTimeout(2000);
        } else {
          console.log('Test 14: Only Check In available. Clicking Check In...');
          await checkInBtn.first().scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);
          await checkInBtn.first().click({ force: true });
          console.log('Test 14: Check In clicked. Waiting for Check Out or Confirm to be enabled...');
          await page.waitForTimeout(2000);

          const checkOutBtnAfter = page.getByRole('button', { name: /^check\s*out$/i });
          const confirmBtnEarly  = page.getByRole('button', { name: 'Confirm' });

          const checkOutAppeared = await checkOutBtnAfter.first()
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

          if (checkOutAppeared) {
            await page.waitForTimeout(500);
            console.log('Test 14: Check Out is now visible, clicking...');
            await checkOutBtnAfter.first().scrollIntoViewIfNeeded();
            await checkOutBtnAfter.first().click({ force: true });
            console.log('Test 14: Check Out clicked after Check In.');
            await page.waitForTimeout(2000);
          } else {
            console.log('Test 14: Check Out did not appear, checking if Confirm is already enabled...');
            const confirmAlreadyEnabled = await confirmBtnEarly.first().isEnabled().catch(() => false);
            if (!confirmAlreadyEnabled) {
              throw new Error('Test 14: Neither Check Out appeared nor Confirm is enabled after Check In click.');
            }
            console.log('Test 14: Confirm is already enabled, proceeding without Check Out click.');
          }
        }

        // Wait for Confirm button to become enabled after checkout
        console.log('Test 14: Waiting for Confirm button to be enabled...');
        const confirmBtn = page.getByRole('button', { name: 'Confirm' });
        await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
        await expect(confirmBtn).toBeEnabled({ timeout: 15000 });
        await page.waitForTimeout(1000); // Let UI fully settle before clicking
        console.log('Test 14: Confirm button is enabled, clicking...');

        // Retry clicking Confirm until the dialog Send button appears
        const sendBtn = page.getByRole('button', { name: 'Send' });
        let dialogOpened = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`Test 14: Confirm click attempt ${attempt}...`);
          await confirmBtn.click({ force: true });
          const appeared = await sendBtn.waitFor({ state: 'visible', timeout: 8000 })
            .then(() => true)
            .catch(() => false);
          if (appeared) {
            dialogOpened = true;
            console.log('Test 14: Confirm dialog appeared.');
            break;
          }
          console.log(`Test 14: Dialog Send button not found on attempt ${attempt}, retrying...`);
          await page.waitForTimeout(1500);
        }
        if (!dialogOpened) {
          throw new Error('Test 14: Confirm dialog never appeared after retries.');
        }

        await page.waitForTimeout(500);

        // Fill Confirm Fax form inside the dialog
        const confirmDialog = page.locator('[role="dialog"]');
        const subjectCombo = confirmDialog.getByRole('combobox').nth(0);
        const coverCombo   = confirmDialog.getByRole('combobox').nth(1);
        await subjectCombo.selectOption({ index: 1 });
        await coverCombo.selectOption({ index: 1 });
        await confirmDialog.getByRole('checkbox', { name: 'Send Cover Page Only' }).check();
        await confirmDialog.getByRole('textbox', { name: 'Default Messages' }).click();
        await confirmDialog.getByRole('textbox', { name: 'Default Messages' }).fill('test');
        await sendBtn.click();
        console.log('Test 14: Fax sent.');

        found = true;
        break;
      } catch (err) {
        console.error('Test 14: Error in row selection/click:', err);
        continue;
      }
    }

    if (!found) {
      throw new Error('No valid row found with Check In / Check Out');
    }
  });
});