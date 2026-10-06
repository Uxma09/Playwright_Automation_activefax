const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
  }

  async expectItems(names) {
    await expect(this.page.getByTestId('inventory-item-name')).toHaveText(names);
  }

  async checkout() {
    await this.page.getByTestId('checkout').click();
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
  }
}

module.exports = { CartPage };
