import { paths } from '../config/site.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  formRoot() {
    return this.page.locator("#loginPanel, form[name='login']").first();
  }

  async gotoLanding() {
    await this.page.goto(paths.home, { waitUntil: 'load' });
    await this.formRoot().locator("input[name='username']").waitFor();
  }

  async goto() {
    await this.gotoLanding();
  }

  async login(username, password) {
    const root = this.formRoot();
    await root.locator("input[name='username']").fill(username);
    await root.locator("input[name='password']").fill(password);
    await root.locator("input[type='submit']").click();
  }

  async loginToApplication(username, password) {
    await this.gotoLanding();
    await this.login(username, password);
  }
}

export class AppLoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('#email');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('#login');
    this.errorMsg = page.locator('.error');
    this.logoutBtn = page.locator('#logout');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async logout() {
    await this.logoutBtn.click();
  }
}
