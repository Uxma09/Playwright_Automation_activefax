import { test, expect, describe } from './fixtures.js';
describe('Fax Listing ', () => {
  test('Item notes', async ({ page }) => {

    await page.getByRole('button', { name: 'Columns Visibility' }).click();
    await page.getByRole('button', { name: 'Reset Grouping' }).click();
    await page.getByText('Range').click();
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByText('Items ListingGroup by:').click();
    // Wait for the table to load
    await page.waitForSelector('table');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const rows = page.locator('tr');
    const rowCount = await rows.count();
    let clicked = false;
    let firstRowIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      // Check for blue notes icon
      const blueIcon = row.locator('.text-primary.fs-4');
      // Check for badge value > 0
      const notesBadge = row.locator('.MuiBadge-badge');
      let shouldClick = false;
      if (await blueIcon.count() > 0) {
        shouldClick = true;
      } else if (await notesBadge.count() > 0) {
        const badgeText = await notesBadge.first().innerText();
        if (parseInt(badgeText, 10) > 0) {
          shouldClick = true;
        }
      }
      if (shouldClick) {
        // Click the 'view item' cell in this row
        const viewItemCell = row.locator('.d-flex > div > .m-0');
        await viewItemCell.first().click();
        clicked = true;
        firstRowIndex = i;
        break;
      }
    }
    if (!clicked) throw new Error('No row with blue notes icon or notes > 0 found to click.');

    // Notes logic
    await page.getByRole('button', { name: 'Notes' }).click();
    await page.waitForTimeout(500);
    const addNotesBtn = page.getByRole('button', { name: 'Add New Notes' });
    if (await addNotesBtn.isVisible()) {
      await addNotesBtn.click();
      await page.waitForTimeout(300);
    }
    await page.getByRole('textbox', { name: 'Enter Subject' }).fill('test');
    await page.getByRole('textbox', { name: 'Enter Note' }).fill('test');
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Save Note' }).click();
    await page.waitForTimeout(500);
    // Always close the Notes tab after saving
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: 'Back to Listing' }).click();
    await page.waitForTimeout(800);
      // Assert Notes tab is closed
      const notesDrawer = page.locator('.MuiDrawer-paper');
      await expect(notesDrawer).toBeHidden({ timeout: 2000 });
      // Assert listing is visible
      await expect(page.locator('table')).toBeVisible({ timeout: 2000 });


    await page.waitForTimeout(800);
 });
});
