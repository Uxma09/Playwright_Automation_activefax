import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 180000,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'https://axdemo.healthwaresystems.com',
    headless: false,
    screenshot: 'only-on-failure',
    actionTimeout: 120000,
    navigationTimeout: 120000,
    trace: 'on-first-retry',
    // storageState: 'auth.json', // Removed to ensure fresh session
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
