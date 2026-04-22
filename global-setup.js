import { chromium } from '@playwright/test';
import { baseURL } from './config/site.js';
import { testData } from './utils/testData.js';
import { RegisterPage } from './pages/RegisterPage.js';

const headless =
  process.env.HEADLESS === '1' ||
  String(process.env.BROWSER_HEADLESS || '').toLowerCase() === 'true' ||
  !!process.env.CI;

export default async function globalSetup() {
  if (!testData.registerBeforeSuite) return;

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({ baseURL: baseURL(), locale: 'en-US' });
  const page = await context.newPage();
  try {
    await new RegisterPage(page).registerFromTestData(testData);
  } finally {
    await context.close();
    await browser.close();
  }
}
