const { expect } = require('@playwright/test');
const { parsePrice } = require('../utils/money');

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** The product card containing the given visible product name. */
  item(name) {
    return this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  /** Adds a product by its visible name and returns the price shown on the card (in cents). */
  async addToCart(name) {
    const card = this.item(name);
    await expect(card).toHaveCount(1);
    const priceText = await card.getByTestId('inventory-item-price').innerText();
    await card.getByRole('button', { name: 'Add to cart' }).click();
    await expect(card.getByRole('button', { name: 'Remove' })).toBeVisible();
    return parsePrice(priceText);
  }

  async openCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/\/cart\.html$/);
  }
}

module.exports = { InventoryPage };
