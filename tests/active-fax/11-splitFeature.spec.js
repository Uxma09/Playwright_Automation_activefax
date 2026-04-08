import { test, expect, describe } from './fixtures.js';

describe('Last test suite', () => {

  // Helper function for repeated Split & Thumbnail actions
  async function performSplitAndThumbnailActions(page) {
    await page.getByRole('button', { name: 'Split' }).waitFor({ state: 'visible', timeout: 7000 });
    await page.getByRole('button', { name: 'Split' }).click({ force: true });
    await page.waitForTimeout(1000);

    await page.getByRole('img', { name: /Thumbnail/ }).first().waitFor({ state: 'visible', timeout: 7000 });
    await page.getByRole('img', { name: /Thumbnail/ }).first().click({ force: true });
    await page.waitForTimeout(1000);

    // Click Back to Fax and handle browser dialog (CONFIRM)
    console.log('Test 11: About to wait for Back to Fax button...');
    await page.screenshot({ path: 'before-back-to-fax.png' });
    const allButtons = await page.locator('button').allTextContents();
    console.log('All button texts:', allButtons);
    // Always use the provided XPath for Back to Fax button
    const backToFaxBtn = page.locator('xpath=/html/body/div/div/div[1]/div/div[1]/div/button[2]');
    const isVisible = await backToFaxBtn.isVisible();
    const isEnabled = await backToFaxBtn.isEnabled();
    console.log('Back to Fax button (XPath) isVisible:', isVisible, 'isEnabled:', isEnabled);
    if (!isVisible || !isEnabled) {
        throw new Error('Back to Fax button is not visible or not enabled!');
    }
    await backToFaxBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Give UI time to settle
    // Explicit visibility check before click
    const visibleBeforeClick = await backToFaxBtn.isVisible();
    console.log('Back to Fax button isVisible right before click:', visibleBeforeClick);
    if (!visibleBeforeClick) {
        throw new Error('Back to Fax button is not visible right before click!');
    }
    console.log('Test 11: Clicking Back to Fax and waiting for dialog...');
    await page.screenshot({ path: 'before-back-to-fax-click.png' });
    // Click Back to Fax and handle custom modal dialog
    await backToFaxBtn.click({ force: true });
    console.log('Back to Fax button clicked. Waiting for custom modal dialog...');
    // Wait for modal dialog to appear
    const modalOkBtn = page.getByRole('button', { name: /ok/i });
    await modalOkBtn.waitFor({ state: 'visible', timeout: 7000 });
    // Log all visible buttons in the modal
    const modalButtons = await page.locator('button').allTextContents();
    console.log('All visible modal buttons:', modalButtons);
    // Log modal structure for debugging
    const modalHtml = await page.locator('body > div[role="dialog"]').innerHTML().catch(() => 'No modal dialog found');
    console.log('Modal dialog HTML:', modalHtml);
    console.log('Custom modal OK button is visible. Clicking OK...');
    await modalOkBtn.click({ force: true });
    console.log('Custom modal OK button clicked.');
    // Wait for modal dialog to disappear before proceeding
    await modalOkBtn.waitFor({ state: 'detached', timeout: 7000 });
    console.log('Custom modal OK button is gone, ready for next test case.');
    await page.screenshot({ path: 'after-modal-ok-clicked.png' });
  }

  test('Logout', async ({ page }) => {
    // Attach global dialog handler to always accept browser dialogs
    page.on('dialog', async dialog => {
      console.log('Global dialog handler: accepting dialog:', dialog.message());
      await dialog.accept();
    });
    console.log('Test 11: Start');

    // Initial setup
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Columns Visibility' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Reset Grouping' }).click();
    await page.waitForTimeout(500);
    await page.getByText('Range').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(500);
    await page.getByText('Items ListingGroup by:').click();
    await page.waitForTimeout(500);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Assert table is visible
    await expect(page.locator('table')).toBeVisible({ timeout: 2000 });
    await page.waitForTimeout(500);

    // Iterate rows to find a valid one
    const rows = page.locator('tr');
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
        await page.waitForTimeout(1000); // wait for row details to render

        // Re-locate buttons after UI update
        const checkInBtn = page.getByRole('button', { name: 'Check In' });
        const checkOutBtn = page.getByRole('button', { name: 'Check Out' });
        const backBtn = page.getByRole('button', { name: 'Back to Listing' });

        // Wait up to 3s for either button to appear
        await Promise.race([
          checkInBtn.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {}),
          checkOutBtn.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
        ]);
        const checkOutVisible = await checkOutBtn.isVisible().catch(() => false);
        const checkInVisible = await checkInBtn.isVisible().catch(() => false);
        const backVisible = await backBtn.isVisible().catch(() => false);

        if (!checkOutVisible && !checkInVisible) {
          // If neither button is visible, go back and try next row
          if (backVisible) {
            await backBtn.click();
            await page.waitForSelector('table');
          }
          continue;
        }

        // If Check Out is visible, click it
        if (checkOutVisible) {
          console.log('Test 11: Check Out is visible, waiting before click...');
          await page.waitForTimeout(1000);
          await checkOutBtn.waitFor({ state: 'visible', timeout: 7000 });
          try {
            console.log('Test 11: Attempting to click Check Out...');
            await checkOutBtn.click({ force: true });
            console.log('Test 11: Check Out clicked successfully.');
            await page.waitForTimeout(1500); // Wait after Check Out for visibility
          } catch (err) {
            console.error('Test 11: Failed to click Check Out:', err);
            await page.waitForTimeout(1000);
            try {
              console.log('Test 11: Retrying click on Check Out...');
              await checkOutBtn.click({ force: true });
              console.log('Test 11: Check Out clicked on retry.');
              await page.waitForTimeout(1500); // Wait after Check Out for visibility
            } catch (err2) {
              console.error('Test 11: Retry failed to click Check Out:', err2);
              throw new Error('Check Out button was visible but could not be clicked.');
            }
          }
        } else if (checkInVisible) {
          // If Check In is visible, click it, then wait for and click Check Out
          console.log('Test 11: Check In is visible, waiting before click...');
          await page.waitForTimeout(1000);
          await checkInBtn.waitFor({ state: 'visible', timeout: 7000 });
          try {
            console.log('Test 11: Attempting to click Check In...');
            await checkInBtn.click({ force: true });
            console.log('Test 11: Check In clicked successfully.');
            await page.waitForTimeout(1000); // Wait for UI update after Check In
          } catch (err) {
            console.error('Test 11: Failed to click Check In:', err);
            await page.waitForTimeout(1000);
            try {
              console.log('Test 11: Retrying click on Check In...');
              await checkInBtn.click({ force: true });
              console.log('Test 11: Check In clicked on retry.');
              await page.waitForTimeout(1000);
            } catch (err2) {
              console.error('Test 11: Retry failed to click Check In:', err2);
              throw new Error('Check In button was visible but could not be clicked.');
            }
          }
          await checkOutBtn.waitFor({ state: 'visible', timeout: 10000 });
          await page.waitForTimeout(1000);
          try {
            console.log('Test 11: Attempting to click Check Out after Check In...');
            await checkOutBtn.click({ force: true });
            console.log('Test 11: Check Out clicked after Check In.');
            await page.waitForTimeout(1500); // Wait after Check Out for visibility
          } catch (err) {
            console.error('Test 11: Failed to click Check Out after Check In:', err);
            await page.waitForTimeout(1000);
            try {
              console.log('Test 11: Retrying click on Check Out after Check In...');
              await checkOutBtn.click({ force: true });
              console.log('Test 11: Check Out clicked on retry after Check In.');
              await page.waitForTimeout(1500); // Wait after Check Out for visibility
            } catch (err2) {
              console.error('Test 11: Retry failed to click Check Out after Check In:', err2);
              throw new Error('Check Out button could not be clicked after Check In.');
            }
          }
        }

        // After Check Out, click Split and break the loop
        const splitBtn = page.getByRole('button', { name: 'Split' });
        console.log('Test 11: Waiting for Split button to be visible...');
        await splitBtn.waitFor({ state: 'visible', timeout: 7000 });
        await page.waitForTimeout(2000); // Wait before clicking Split for visibility
        try {
          console.log('Test 11: Attempting to click Split button...');
          await splitBtn.click({ force: true });
          console.log('Test 11: Split button clicked successfully.');
        } catch (err) {
          console.error('Test 11: Failed to click Split button:', err);
          await page.waitForTimeout(1500);
          try {
            console.log('Test 11: Retrying click on Split button...');
            await splitBtn.click({ force: true });
            console.log('Test 11: Split button clicked on retry.');
          } catch (err2) {
            console.error('Test 11: Retry failed to click Split button:', err2);
            throw new Error('Split button was visible but could not be clicked.');
          }
        }
        await page.waitForTimeout(2000); // Wait for Split page to load

        // Click the first thumbnail image (role 'img', name starts with 'Thumbnail')
        const thumbnails = page.getByRole('img', { name: /Thumbnail/ });
        await thumbnails.first().waitFor({ state: 'visible', timeout: 7000 });
        await thumbnails.first().click({ force: true });
        await page.waitForTimeout(1500); // Wait after thumbnail click for visibility

        // Show indexing fields and select options
        console.log('Test 11: Waiting for Show the indexing fields button...');
        await page.getByRole('button', { name: 'Show the indexing fields' }).waitFor({ state: 'visible', timeout: 7000 });
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Show the indexing fields' }).click({ force: true });
        console.log('Test 11: Clicked Show the indexing fields.');
        await page.waitForTimeout(1000);

        // Select 'Progress Notes'
        await page.locator('.css-19bb58m').first().click({ force: true });
        await page.waitForTimeout(500);
        await page.getByRole('option', { name: 'Progress Notes' }).click({ force: true });
        console.log('Test 11: Selected Progress Notes.');
        await page.waitForTimeout(500);
        // Select 'Labs'
        await page.locator('.css-19bb58m').first().click({ force: true });
        await page.waitForTimeout(500);
        await page.getByRole('option', { name: 'Labs' }).click({ force: true });
        console.log('Test 11: Selected Labs.');
        await page.waitForTimeout(500);
        // Select 'Physician Orders'
        await page.locator('.css-19bb58m').first().click({ force: true });
        await page.waitForTimeout(500);
        await page.getByRole('option', { name: 'Physician Orders' }).click({ force: true });
        console.log('Test 11: Selected Physician Orders.');
        await page.waitForTimeout(1000);

        // Save changes
        console.log('Test 11: Waiting for Save Changes button...');
        await page.getByRole('button', { name: 'Save Changes' }).waitFor({ state: 'visible', timeout: 7000 });
        await page.waitForTimeout(1000);

        await page.getByRole('button', { name: 'Save Changes' }).click({ force: true });
        console.log('Test 11: Clicked Save Changes.');
        await page.waitForTimeout(2500); // Wait for page to load after saving

        // Click Back to Fax
        console.log('Test 11: Waiting for Back to Fax button...');
        // Log all visible buttons and their enabled state
        const allButtons = await page.locator('button').all();
        for (const btn of allButtons) {
          const text = await btn.textContent();
          const visible = await btn.isVisible();
          const enabled = await btn.isEnabled();
          console.log(`Button: '${text}', visible: ${visible}, enabled: ${enabled}`);
        }
        const backToFaxBtn = page.getByRole('button', { name: /Back to Fax/i });
        await backToFaxBtn.waitFor({ state: 'visible', timeout: 7000 });
        const isVisible = await backToFaxBtn.isVisible();
        const isEnabled = await backToFaxBtn.isEnabled();
        console.log('Back to Fax button (role selector) isVisible:', isVisible, 'isEnabled:', isEnabled);
        await expect(backToFaxBtn).toBeEnabled();
        await backToFaxBtn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000); // Let UI settle
        await page.screenshot({ path: 'before-back-to-fax-click.png' });
        console.log('Test 11: Clicking Back to Fax and waiting for native browser dialog...');
        try {
          let clickSuccess = false;
          for (let attempt = 1; attempt <= 2; attempt++) {
            const enabled = await backToFaxBtn.isEnabled();
            console.log(`Back to Fax button enabled (attempt ${attempt}):`, enabled);
            if (!enabled) {
              await page.waitForTimeout(2000);
              continue;
            }
            try {
              console.log(`Attempt ${attempt}: Trying normal click on Back to Fax...`);
              await page.waitForTimeout(2000);
              console.log(`Attempt ${attempt}: Clicking Back to Fax button...`);
              await backToFaxBtn.click({ force: true });
              // Explicitly wait for dialog to appear after click
              try {
                await page.waitForEvent('dialog', { timeout: 10000 });
                console.log('Dialog appeared after Back to Fax click.');
              } catch (dialogErr) {
                console.log('No dialog appeared after Back to Fax click (waited 7s).');
              }
              clickSuccess = true;
              break;
            } catch (err) {
              console.error(`Attempt ${attempt} failed to click Back to Fax:`, err);
              // Try direct DOM click as fallback
              try {
                console.log(`Attempt ${attempt}: Trying direct DOM click on Back to Fax...`);
                await page.evaluate(el => el.click(), await backToFaxBtn.elementHandle());
                // Explicitly wait for dialog to appear after direct DOM click
                try {
                  await page.waitForEvent('dialog', { timeout: 7000 });
                  console.log('Dialog appeared after direct DOM click.');
                } catch (dialogErr) {
                  console.log('No dialog appeared after direct DOM click (waited 7s).');
                }
                clickSuccess = true;
                break;
              } catch (err2) {
                console.error(`Attempt ${attempt} failed for direct DOM click:`, err2);
                await page.waitForTimeout(1000);
              }
            }
          }
          if (!clickSuccess) {
            throw new Error('Failed to click Back to Fax and handle dialog after retries.');
          }
          await page.waitForTimeout(1000); // Give time for dialog to be accepted
        } catch (err) {
          console.error('Error clicking Back to Fax or handling dialog:', err);
        }
        await page.screenshot({ path: 'after-back-to-fax-click.png' });

        // After accepting dialog, click Reject if available, then end test
        const rejectBtn = page.getByRole('button', { name: /Reject/i });
        if (await rejectBtn.isVisible().catch(() => false)) {
          await rejectBtn.click({ force: true });
          await page.waitForTimeout(1000); // Wait for UI update after Reject
          console.log('Clicked Reject after split as required.');
          return;
        }
        break;
      } catch (err) {
        console.error('Test 11: Error in row selection/click:', err);
        // Try next row
        continue;
      }
    }

    // No further action needed; test should not reach here if flow is correct
  });
});
