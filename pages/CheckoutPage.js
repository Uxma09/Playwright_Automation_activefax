const { expect } = require('@playwright/test');
const { parsePrice } = require('../utils/money');

class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async fillCustomerInfo(firstName, lastName, postalCode) {
    await this.page.getByTestId('firstName').fill(firstName);
    await this.page.getByTestId('lastName').fill(lastName);
    await this.page.getByTestId('postalCode').fill(postalCode);
    await this.page.getByTestId('continue').click();
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
  }

  async expectItems(names) {
    await expect(this.page.getByTestId('inventory-item-name')).toHaveText(names);
  }

  /** Reads subtotal, tax and total from the overview page, in cents. */
  async readSummary() {
    const read = async (id) => parsePrice(await this.page.getByTestId(id).innerText());
    return {
      subtotal: await read('subtotal-label'),
      tax: await read('tax-label'),
      total: await read('total-label'),
    };
  }

  async finish() {
    await this.page.getByTestId('finish').click();
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
  }
}

module.exports = { CheckoutPage };
