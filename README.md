# SauceDemo – End-to-End Checkout Test (Playwright + TypeScript)

Automated end-to-end test for https://www.saucedemo.com covering the highest-risk journey:

**Login → add two products → verify cart → checkout info → verify subtotal, tax and total → finish → verify confirmation and empty cart**

## Requirements

- Node.js 18 or newer (tested with Node 20/22)
- Internet access to www.saucedemo.com

## Setup

```bash
git clone <this-repo-url>
cd saucedemo-playwright
npm ci                      # or: npm install
npx playwright install      # downloads browsers
```

## Run

```bash
npm test                    # headless, Chromium + Firefox
npm run test:headed         # watch it run
npx playwright test --project=chromium   # one browser only
npm run report              # open the HTML report (traces/screenshots on failure)
```

Optional credentials override (defaults are the public demo values):

```bash
SAUCE_USERNAME=standard_user SAUCE_PASSWORD=secret_sauce npm test
```

CI: `.github/workflows/playwright.yml` runs the suite on every push/PR and uploads the HTML report as an artifact.

## Project structure

```
pages/          Page objects (Login, Inventory, Cart, Checkout)
utils/money.ts  Price parsing in integer cents + 8% tax helper
tests/          checkout.spec.ts – the end-to-end test
```

## Design choices

- **Selectors:** `data-test` attributes via `getByTestId` (configured with `testIdAttribute: 'data-test'`), plus role-based buttons scoped to a product card. No CSS classes, no XPath, no index-based selectors.
- **No hard-coded waits:** only Playwright web-first assertions (`toHaveURL`, `toHaveText`, `toBeVisible`), which retry automatically.
- **Meaningful assertions:** expected totals are *calculated* from the prices shown on the product list, not hard-coded, and compared in integer cents to avoid floating-point errors.
- **Isolation:** each test gets a fresh browser context, so cookies and the `localStorage` cart never leak between tests.
- **Debuggability:** `test.step` blocks, trace + screenshot + video kept on failure.

## AI assistance

The first version of this project (test, page objects, README, CI workflow) was written with Claude (Anthropic).
The AI could not reach saucedemo.com from its environment, so it only verified that the code compiles.

| Area | AI contribution | Risk | What I did |
| --- | --- | --- | --- |
| Running | Only type-checked | Not proven on the live site | Ran it locally: [result] |
| Locators | `data-test` ids from memory | AI's knowledge of SauceDemo was outdated (it missed the Dynamic Catalog), so ids could have changed | Verified in DevTools and by running: [any fixes] |
| Price check | Expected totals calculated in cents | Depends on the 8% tax assumption | Matched against a manual order: 39.98 + 3.20 = 43.18 |
| Test data | Product names hard-coded | Breaks if products are renamed | Kept; listed as limitation |

## Known limitations / risks

- Runs against a public third-party site: outages or UI changes will fail the test without any change in this repo.
- Tax rate (8%) is an assumption taken from observed behaviour; there is no spec. If it changes, update `TAX_RATE`.
- Covers only the happy path for `standard_user`. Defects found manually (empty-cart checkout, URL skipping, weak validation) are documented in the assessment report, not automated here.
- No visual or accessibility checks; `visual_user` regressions would not be caught.
- Product names are used as test data; renaming products requires updating `PRODUCTS`.
