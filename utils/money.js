/**
 * Extracts the first "$12.34" amount from a label such as "Item total: $39.98"
 * and returns it in integer cents, so assertions never compare floating-point numbers.
 */
function parsePrice(text) {
  const match = text.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`No price found in "${text}"`);
  return Math.round(parseFloat(match[1]) * 100);
}

/** SauceDemo applies 8% tax, rounded to the nearest cent. */
const TAX_RATE = 0.08;
const expectedTax = (subtotalCents) => Math.round(subtotalCents * TAX_RATE);

module.exports = { parsePrice, TAX_RATE, expectedTax };
