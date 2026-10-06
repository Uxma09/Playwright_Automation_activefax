const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
    // Assert we actually landed on the inventory, not just that the click happened.
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }
}

module.exports = { LoginPage };
