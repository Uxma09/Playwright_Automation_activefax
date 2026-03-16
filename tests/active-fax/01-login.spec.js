import { test, expect, describe } from './fixtures.js';

describe('Login Test Suite', () => {
  
  // First test: Login and save authentication
  test('Login and Save Authentication', async ({ page, context }) => {
    console.log('Before navigation');
    await page.goto('https://axdemo.healthwaresystems.com/login', { timeout: 50000 });
    console.log('After navigation:', await page.url());
    await page.waitForLoadState('networkidle');
    console.log('Network idle, page should be fully loaded');
    await page.waitForTimeout(3000);
  console.log('Page loaded, proceeding with login');
    // Wait for login form to be visible
    
    // Fill in login credentials
    
    await page.locator('input[name="username"]').fill('admin');
    await page.waitForTimeout(500);
    await page.locator('input[name="password"]').fill('adminhws');
    await page.waitForTimeout(500);
    await page.getByRole('button').filter({ hasText: /^$/ }).click(); 
    await page.waitForTimeout(5000);
    await page.getByRole('button').filter({ hasText: /^$/ }).click();

    // Click Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();
  
    // Wait for login to complete and dashboard to load
    await page.waitForSelector('#basic-navbar-nav', { timeout: 15000 });
    await page.waitForTimeout(3000);
  
    // Save authentication state
    await context.storageState({ path: 'auth.json'});
  });
});
