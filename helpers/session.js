import { testData } from '../utils/testData.js';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage.js';

/**
 * Log in and stop on Accounts Overview once account rows are visible.
 * @param {import('@playwright/test').Page} page
 */
export async function loginToAccountsOverview(page) {
  const login = new LoginPage(page);
  await login.loginToApplication(testData.username, testData.password);
  const overview = new AccountsOverviewPage(page);
  await overview.waitForHeading();
  await overview.waitForAccountRows();
  return { overview };
}
