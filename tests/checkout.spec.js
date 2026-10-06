const { test, expect } = require('../fixtures/sharedPage');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { expectedTax } = require('../utils/money');

// Credentials are public demo values; env vars allow overriding them in CI.
const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

const PRODUCTS = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

test.describe('Checkout', () => {
  test('standard user can buy two products and totals are calculated correctly', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await test.step('Log in', async () => {
      await login.goto();
      await login.login(USERNAME, PASSWORD);
    });

    const listedPrices = [];
    await test.step('Add two products to the cart', async () => {
      for (const name of PRODUCTS) {
        listedPrices.push(await inventory.addToCart(name));
      }
      await expect(inventory.cartBadge).toHaveText(String(PRODUCTS.length));
    });

    await test.step('Cart contains exactly the selected products', async () => {
      await inventory.openCart();
      await cart.expectItems(PRODUCTS);
      await cart.checkout();
    });

    await test.step('Enter customer information', async () => {
      await checkout.fillCustomerInfo('Test', 'User', '44000');
    });

    await test.step('Overview shows correct items, subtotal, tax and total', async () => {
      await checkout.expectItems(PRODUCTS);
      const { subtotal, tax, total } = await checkout.readSummary();
      const expectedSubtotal = listedPrices.reduce((sum, p) => sum + p, 0);

      expect(subtotal, 'subtotal = sum of listed prices').toBe(expectedSubtotal);
      expect(tax, 'tax = 8% of subtotal').toBe(expectedTax(expectedSubtotal));
      expect(total, 'total = subtotal + tax').toBe(subtotal + tax);
    });

    await test.step('Finish order and see confirmation', async () => {
      await checkout.finish();
      await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
      // Cart must be emptied after a successful order.
      await expect(inventory.cartBadge).toHaveCount(0);
    });
  });
});
