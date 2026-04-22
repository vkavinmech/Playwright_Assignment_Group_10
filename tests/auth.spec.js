import { test, expect } from '@playwright/test';
import { paths } from '../config/site.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { testData } from '../utils/testData.js';

test.describe.serial('Parabank Auth E2E', () => {
  /** Populated by “Register New User” for the customer-lookup test. */
  let lastRegistered = null;

  test('Valid Login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginToApplication(testData.username, testData.password);

    await expect(page).toHaveURL(/overview\.htm/i);
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  });

  test('Invalid Login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.gotoLanding();
    await login.login(testData.username, 'wrong_password_not_valid_999');

    const panel = page.locator('#rightPanel');
    await expect(panel).toBeVisible({ timeout: 15_000 });
    const err = panel.locator('.error').first();
    const hasError = await err.isVisible().catch(() => false);
    if (hasError) {
      await expect(err).toBeVisible();
    } else {
      const t = ((await panel.innerText()) || '').toLowerCase();
      expect(
        t.includes('error') || t.includes('could not') || t.includes('incorrect') || t.includes('invalid')
      ).toBeTruthy();
    }
  });

  test('Register New User', async ({ page }) => {
    const id = Date.now();
    const ssn = `${String(100 + (id % 800)).padStart(3, '0')}-${String(10 + (id % 89)).padStart(2, '0')}-${String(1000 + (id % 8999)).padStart(4, '0')}`;
    lastRegistered = {
      ...testData,
      username: `pwuser_${id}`,
      password: testData.password,
      registerSsn: ssn,
    };

    await new RegisterPage(page).registerFromTestData(lastRegistered);

    const body = (await page.content()).toLowerCase();
    expect(
      body.includes('created') ||
        body.includes('congratulations') ||
        body.includes('successfully') ||
        body.includes('welcome')
    ).toBeTruthy();
  });

  test('Duplicate Registration', async ({ page }) => {
    await new RegisterPage(page).registerFromTestData(testData);
    const body = (await page.content()).toLowerCase();
    expect(
      body.includes('already') ||
        body.includes('taken') ||
        body.includes('exist') ||
        body.includes('not available')
    ).toBeTruthy();
  });

  test('Customer Lookup with registered profile', async ({ page }) => {
    test.skip(!lastRegistered, 'Requires successful “Register New User” data');

    await page.goto(paths.lookup, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Customer Lookup' })).toBeVisible();

    await page.locator('input[name="firstName"]').fill(lastRegistered.registerFirstName);
    await page.locator('input[name="lastName"]').fill(lastRegistered.registerLastName);
    await page.locator('input[name="address.street"]').fill(lastRegistered.registerStreet);
    await page.locator('input[name="address.city"]').fill(lastRegistered.registerCity);
    await page.locator('input[name="address.state"]').fill(lastRegistered.registerState);
    await page.locator('input[name="address.zipCode"]').fill(lastRegistered.registerZip);
    await page.locator('input[name="ssn"]').fill(lastRegistered.registerSsn);

    await page.locator('input[type="submit"][value="Find My Login Info"]').click();
    await page.waitForLoadState('domcontentloaded');

    const right = page.locator('#rightPanel');
    await expect(right).toContainText(new RegExp(lastRegistered.username, 'i'), { timeout: 15_000 });
  });

  test('Customer Lookup with invalid data shows error', async ({ page }) => {
    await page.goto(paths.lookup, { waitUntil: 'load' });
    await page.locator('input[name="firstName"]').fill('___NoSuchUser___');
    await page.locator('input[name="lastName"]').fill('___NoSuchUser___');
    await page.locator('input[name="address.street"]').fill('0 Nowhere Rd');
    await page.locator('input[name="address.city"]').fill('Void');
    await page.locator('input[name="address.state"]').fill('XX');
    await page.locator('input[name="address.zipCode"]').fill('00000');
    await page.locator('input[name="ssn"]').fill('000-00-0000');

    await page.locator('input[type="submit"][value="Find My Login Info"]').click();
    await page.waitForLoadState('domcontentloaded');

    const panel = page.locator('#rightPanel');
    const err = panel.locator('.error').first();
    const hasError = await err.isVisible().catch(() => false);
    if (hasError) {
      await expect(err).toBeVisible();
    } else {
      const t = ((await panel.innerText()) || '').toLowerCase();
      expect(t.includes('error') || t.includes('not found') || t.includes('could not')).toBeTruthy();
    }
  });

  test('Logout flow', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginToApplication(testData.username, testData.password);

    const logOut = page.getByRole('link', { name: /log out/i }).or(page.locator('a[href*="logout"]'));
    await logOut.first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator("#loginPanel input[name='username']")).toBeVisible({ timeout: 15_000 });
  });
});
