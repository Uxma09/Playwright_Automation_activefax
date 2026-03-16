import { test, expect, describe } from './fixtures.js';
describe('Dashboard Test Suite', () => {
  test('Dashboard View', async ({ page }) => {

  // Slightly increase window size before interacting
  await page.setViewportSize({ width: 1500, height: 850 });

  // Scroll the 'View All' button into view and click it
  const viewAllButton = await page.getByRole('button', { name: 'View All' });
  await viewAllButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300); // Give time for scroll/animation if any
  await viewAllButton.click();
  
  
  
});
});
    
  //   await page.locator('div').nth(2).click();
  // await page.locator('div').filter({ hasText: 'DashboardFacility:AllFacility' }).nth(2).click();
  // await page.locator('div').filter({ hasText: /^0New Arrivals$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^0Reviewed$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^0Needs Attention$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^0Rejected$/ }).nth(1).click();
  // await page.getByRole('button', { name: 'Monthly' }).click();
  // await page.getByRole('button', { name: 'Yearly' }).click();
  // await page.locator('div').filter({ hasText: /^Overall Stats$/ }).nth(1).click();
  // await page.getByText('Last Week Stats0New').click();
  // await page.getByText('Activity StatsUserReviewedIndexedRejected1admin02712Indexer0003Naviquis Admin040').click();
  // await page.getByText('Recent ItemsView AllPagesItem').click();
  // await page.getByRole('button', { name: 'View All' }).click();


  //  await page.locator('div').nth(2).click();
  // await page.locator('div').filter({ hasText: 'DashboardFacility:AllFacility' }).nth(2).click();
  // await page.locator('div').filter({ hasText: /^0New Arrivals$/ }).nth(1).click();
  // await page.getByRole('img').nth(3).click({
  //   position: {
  //     x: 40,
  //     y: 1
  //   }
  // });
  // await page.locator('div').filter({ hasText: /^0Needs Attention$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^1Rejected$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^Overall Stats$/ }).nth(1).click();
  // await page.getByText('Last Week Stats0New').click();
  // await page.getByText('Activity StatsUserReviewedIndexedRejected1admin02622Indexer0003Naviquis Admin040').click();
  // await page.getByText('Recent ItemsView AllPagesItem').click();
  // await page.getByRole('button', { name: 'View All' }).click();




  
  // await page.locator('div').filter({ hasText: /^0New Arrivals$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^0Reviewed$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^0Needs Attention$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^0Rejected$/ }).nth(1).click();
  // await page.locator('div').filter({ hasText: /^Overall Stats$/ }).nth(1).click();
  // await page.getByText('Last Week Stats0New').click();
  // await page.getByRole('heading', { name: 'Activity Stats' }).click();
  // await page.getByText('Activity StatsUserReviewedIndexedRejected1admin02712Indexer0003Naviquis Admin040').click();
  // await page.getByRole('button', { name: 'View All' }).click();