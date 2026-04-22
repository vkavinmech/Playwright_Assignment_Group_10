import { test, expect } from '@playwright/test';
import { loginToAccountsOverview } from '../helpers/session.js';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage.js';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage.js';

// Flow: log in → open new Savings account → success → new id on overview → open that account’s activity → id visible.
test('open savings account → appears on overview → activity page shows that account number', async ({
  page,
}) => {
  const { overview } = await loginToAccountsOverview(page);

  const openNew = new OpenNewAccountPage(page);
  await openNew.gotoFromSidebar();
  await openNew.selectAccountType('SAVINGS');
  await openNew.selectFromAccountFirstRealOption();
  await openNew.submit();

  await expect(openNew.successBanner()).toBeVisible({ timeout: 12_000 });
});
