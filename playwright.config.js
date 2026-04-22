import { defineConfig, devices } from '@playwright/test';
import { baseURL } from './config/site.js';

const slowMo = parseInt(process.env.BROWSER_SLOW_MO_MS || '0', 10) || 0;
const headless =
  process.env.HEADLESS === '1' ||
  String(process.env.BROWSER_HEADLESS || '').toLowerCase() === 'true' ||
  !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  globalSetup: './global-setup.js',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    locale: 'en-US',
    baseURL: baseURL(),
    headless,
    launchOptions: { slowMo },
    actionTimeout: 45_000,
    navigationTimeout: 60_000,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium' }],
});
