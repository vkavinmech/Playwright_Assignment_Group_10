import { paths } from '../config/site.js';

/** One-time customer registration (global setup). */
export class RegisterPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async navigateToRegister() {
    await this.page.goto(paths.register, { waitUntil: 'load' });
    await this.page.getByRole('heading', { name: 'Signing up is easy!' }).waitFor();
  }

  async registerFromTestData(data) {
    await this.navigateToRegister();
    await this.fillField('customer.firstName', 'First Name', data.registerFirstName);
    await this.fillField('customer.lastName', 'Last Name', data.registerLastName);
    await this.fillField('customer.address.street', 'Address', data.registerStreet);
    await this.fillField('customer.address.city', 'City', data.registerCity);
    await this.fillField('customer.address.state', 'State', data.registerState);
    await this.fillField('customer.address.zipCode', 'Zip Code', data.registerZip);
    await this.fillField('customer.phoneNumber', 'Phone', data.registerPhone);
    await this.fillField('customer.ssn', 'SSN', data.registerSsn);
    await this.fillField('customer.username', 'Username', data.username);
    await this.fillField('customer.password', 'Password', data.password);
    await this.fillField('repeatedPassword', 'Confirm', data.password);

    await this.submitRegister();
    await this.page.waitForLoadState('domcontentloaded');

    const outcome = this.page.locator(
      'text=/Your account was created|successfully created|Congratulations|already exists|already been used|already in use|not available|Username.*taken|Please correct the following errors/i'
    );
    await outcome.waitFor();

    const body = (await this.page.content()).toLowerCase();
    if (body.includes('internal error')) {
      throw new Error('ParaBank returned an internal error during registration.');
    }
    if (
      body.includes('already exists') ||
      body.includes('already been used') ||
      body.includes('already in use') ||
      body.includes('not available') ||
      (body.includes('username') && body.includes('taken'))
    ) {
      return;
    }
    if (body.includes('created') || body.includes('congratulations') || body.includes('successfully')) {
      return;
    }
    const err = this.page.locator('#rightPanel .error, .error').first();
    if ((await err.count()) > 0 && (await err.isVisible())) {
      const msg = await err.innerText();
      const m = (msg || '').toLowerCase();
      if (m.includes('already') || m.includes('taken') || m.includes('exist')) return;
      throw new Error(`Registration failed: ${msg}`);
    }
  }

  async fillField(nameAttr, labelPrefix, value) {
    const byName = this.page.locator(`input[name='${nameAttr}']`);
    if ((await byName.count()) > 0) {
      await byName.first().fill(value);
      return;
    }
    await this.page.getByLabel(labelPrefix, { exact: false }).first().fill(value);
  }

  async submitRegister() {
    let submit = this.page
      .locator("input[type='submit'][value='Register'], input[type='submit'][value='REGISTER']")
      .first();
    if ((await submit.count()) === 0) {
      submit = this.page.getByRole('button', { name: 'REGISTER' }).first();
    }
    await submit.click();
  }
}
