import { test, expect, describe } from './fixtures.js';

describe('Rejct Fax', () => {
  async function refreshListingForRowSelection(page) {
    await page.getByRole('button', { name: 'Columns Visibility' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Reset Grouping' }).click();
    await page.waitForTimeout(500);
    await page.getByText('Range').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Items ListingGroup by:').click().catch(() => {});
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  }

  async function clickWhenEnabled(locator, page, label, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const visible = await locator.first().isVisible().catch(() => false);
      const enabled = visible && await locator.first().isEnabled().catch(() => false);
      if (visible && enabled) {
        await locator.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await locator.first().click({ force: true });
        console.log(`Test 12: ${label} clicked.`);
        return true;
      }
      await page.waitForTimeout(500);
    }
    return false;
  }

  test('Fax Rejection', async ({ page }) => {
    console.log('Test 12: Start');

    await page.goto('https://axdemo.healthwaresystems.com/listing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // If Reject is already available (for example right after test 11), use it directly.
    const rejectBtn = page.getByRole('button', { name: 'Reject' });
    const rejectVisibleAtStart = await rejectBtn.first().isVisible().catch(() => false);
    const rejectEnabledAtStart = rejectVisibleAtStart && await rejectBtn.first().isEnabled().catch(() => false);

    if (!rejectEnabledAtStart) {
      await refreshListingForRowSelection(page);
    }

    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

    let found = false;

    if (rejectEnabledAtStart) {
      console.log('Test 12: Reject already clickable at start, proceeding directly.');
      found = true;
    }

    for (let round = 0; round < 3 && !found; round++) {
      console.log(`Test 12: Row scan round ${round + 1}...`);
      const noDataRow = page.getByRole('row', { name: /no data found/i });
      if (await noDataRow.isVisible().catch(() => false)) {
        console.log('Test 12: No data found for this scan round, refreshing listing...');
        await refreshListingForRowSelection(page);
      }

      const rows = page.locator('tr');
      const rowCount = await rows.count();

      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const viewItemCellPrimary = row.locator('td:nth-child(4) > .d-flex > div > .m-0');
        const viewItemCellFallback = row.getByText(/view\s*item/i).first();

        let clickTarget = null;
        if (await viewItemCellPrimary.count() > 0) {
          clickTarget = viewItemCellPrimary.first();
        } else if (await viewItemCellFallback.count() > 0) {
          clickTarget = viewItemCellFallback;
        } else {
          continue;
        }

        await row.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        try {
          await clickTarget.click({ force: true });
          await page.waitForTimeout(1500);

          const checkOutBtn = page.getByRole('button', { name: /^check\s*out$/i });
          const checkInBtn  = page.getByRole('button', { name: /^check\s*in$/i });
          const backBtn     = page.getByRole('button', { name: /back to listing/i });

          await Promise.race([
            checkOutBtn.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
            checkInBtn.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
          ]);

          const rejectVisibleNow = await rejectBtn.first().isVisible().catch(() => false);
          const rejectEnabledNow = rejectVisibleNow && await rejectBtn.first().isEnabled().catch(() => false);
          if (rejectEnabledNow) {
            console.log('Test 12: Reject is clickable after opening row.');
            found = true;
            break;
          }

          const checkOutVisible = await checkOutBtn.first().isVisible().catch(() => false);
          const checkOutEnabled = checkOutVisible && await checkOutBtn.first().isEnabled().catch(() => false);
          const checkInVisible  = await checkInBtn.first().isVisible().catch(() => false);
          const checkInEnabled  = checkInVisible && await checkInBtn.first().isEnabled().catch(() => false);

          console.log(`Test 12: checkOutVisible=${checkOutVisible} checkOutEnabled=${checkOutEnabled} checkInVisible=${checkInVisible} checkInEnabled=${checkInEnabled}`);

          if (!checkOutEnabled && !checkInEnabled) {
            console.log('Test 12: No Check In/Check Out and no Reject. Going back to listing and refreshing Range/Search...');
            const backVisible = await backBtn.isVisible().catch(() => false);
            if (backVisible) {
              await backBtn.click();
              await page.waitForSelector('text=View Item', { timeout: 5000 });
              await page.waitForTimeout(500);
            }
            await refreshListingForRowSelection(page);
            break;
          }

          if (checkOutEnabled) {
            console.log('Test 12: Check Out is available, clicking...');
            const clickedCheckOut = await clickWhenEnabled(checkOutBtn, page, 'Check Out');
            if (!clickedCheckOut) {
              throw new Error('Test 12: Check Out path selected but Check Out was not clickable.');
            }
            await page.getByRole('button', { name: /^check\s*in$/i }).first()
              .waitFor({ state: 'visible', timeout: 10000 })
              .catch(() => {});
            await page.waitForTimeout(1000);
          } else {
            // Check In visible — check if Reject is already enabled
            console.log('Test 12: Check In visible. Checking if Reject is already enabled...');
            const rejectBtnEarly = page.getByRole('button', { name: 'Reject' });
            const rejectAlreadyEnabled = await rejectBtnEarly.first().isEnabled().catch(() => false);

            if (rejectAlreadyEnabled) {
              console.log('Test 12: Reject already enabled, skipping Check In/Out flow.');
            } else {
              console.log('Test 12: Clicking Check In to return, then Check Out...');
              const clickedCheckIn = await clickWhenEnabled(checkInBtn, page, 'Check In');
              if (!clickedCheckIn) {
                throw new Error('Test 12: Check In path selected but Check In was not clickable.');
              }

              const checkOutBtnAfter = page.getByRole('button', { name: /^check\s*out$/i });
              const clickedCheckOutAfterCheckIn = await clickWhenEnabled(
                checkOutBtnAfter,
                page,
                'Check Out (after Check In)',
                20000
              );

              if (clickedCheckOutAfterCheckIn) {
                await page.getByRole('button', { name: /^check\s*in$/i }).first()
                  .waitFor({ state: 'visible', timeout: 10000 })
                  .catch(() => {});
                await page.waitForTimeout(1000);
              } else {
                const rejectNowEnabled = await rejectBtnEarly.first().isEnabled().catch(() => false);
                if (!rejectNowEnabled) {
                  throw new Error('Test 12: Reject not enabled after Check In/Out flow.');
                }
                console.log('Test 12: Reject is enabled after Check In, proceeding.');
              }
            }
          }

          // Wait for Reject button to be enabled after row handling.
          const rejectVisibleAfterFlow = await rejectBtn.first().isVisible().catch(() => false);
          const rejectEnabledAfterFlow = rejectVisibleAfterFlow && await rejectBtn.first().isEnabled().catch(() => false);
          if (rejectEnabledAfterFlow) {
            found = true;
            break;
          }
        } catch (err) {
          console.error('Test 12: Error in row selection/click:', err);
          continue;
        }
      }

      if (!found) {
        const backBtn = page.getByRole('button', { name: /back to listing/i });
        const backVisible = await backBtn.isVisible().catch(() => false);
        if (backVisible) {
          await backBtn.click();
          await page.waitForTimeout(800);
        }
        await refreshListingForRowSelection(page);
      }
    }

    if (!found) {
      throw new Error('No valid row found with Check In / Check Out / Reject');
    }

    // Wait for Reject button to be enabled
    console.log('Test 12: Waiting for Reject button to be enabled...');
    await rejectBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(rejectBtn).toBeEnabled({ timeout: 15000 });
    await rejectBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    console.log('Test 12: Clicking Reject...');

    // Retry clicking Reject until the Send button appears in the dialog
    const sendBtn = page.getByRole('button', { name: 'Send' });
    let dialogOpened = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Test 12: Reject click attempt ${attempt}...`);
      await rejectBtn.scrollIntoViewIfNeeded();
      await rejectBtn.waitFor({ state: 'visible', timeout: 5000 });
      await rejectBtn.click();
      const appeared = await sendBtn.waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);
      if (appeared) {
        dialogOpened = true;
        console.log('Test 12: Reject dialog appeared.');
        break;
      }
      await page.waitForTimeout(1500);
    }
    if (!dialogOpened) {
      throw new Error('Test 12: Reject dialog never appeared after retries.');
    }

    await page.waitForTimeout(500);

    // Fill Reject Fax form inside the dialog
    const rejectDialog = page.locator('[role="dialog"]');
    const subjectCombo = rejectDialog.getByRole('combobox').nth(0);
    const coverCombo   = rejectDialog.getByRole('combobox').nth(1);
    await subjectCombo.selectOption({ index: 1 });
    await coverCombo.selectOption({ index: 1 });
    await rejectDialog.getByRole('textbox', { name: 'Default Messages' }).click();
    await rejectDialog.getByRole('textbox', { name: 'Default Messages' }).fill('test');
    await sendBtn.click();
    console.log('Test 12: Reject fax sent.');
  });
});
