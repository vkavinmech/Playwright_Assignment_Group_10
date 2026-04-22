export class ForgotPasswordPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('#email');
    this.submitBtn = page.locator('#submit');
    this.successMsg = page.locator('.success');
    this.errorMsg = page.locator('.error');
  }

  async goto() {
    await this.page.goto('/forgot-password');
  }

  async requestReset(email) {
    await this.email.fill(email);
    await this.submitBtn.click();
  }
}
