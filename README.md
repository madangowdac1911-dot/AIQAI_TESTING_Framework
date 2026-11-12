# AQAI Sythlinx QA Framework

UI and API test automation framework for the [ParaBank](https://parabank.parasoft.com/parabank) demo banking app. It uses
**TypeScript**, **Playwright Test**, **playwright-bdd** (Gherkin `.feature` files) and **Allure** reporting.

## Features

- BDD scenarios in Gherkin, run natively by the Playwright Test runner (via `playwright-bdd`)
- Page Object Model (`pages/`) with per-scenario fixtures, so scenarios share no state and can run in parallel
- API client (`api/ParaBankApi.ts`) built on Playwright `APIRequestContext` for fast test-data setup
- One-time global setup that re-creates the login user if the ParaBank demo database was reset
- Multiple environments (`dev` / `qa` / `uat`) selected with `TEST_ENV`
- Tag-based runs (`@smoke`, `@regression`, `@login`, `@register`, `@negative`)
- Allure reports with screenshots, plus video and trace on failure
- Winston logging to the console and `reports/logs/`

## Tech Stack

| Tool             | Purpose                              |
| ---------------- | ------------------------------------ |
| @playwright/test | Test runner, browser automation, API |
| playwright-bdd   | Gherkin feature files -> Playwright  |
| TypeScript       | Language                             |
| allure-playwright| Reporting                            |
| winston          | Logging                              |
| dotenv           | Environment / credentials config     |
| cross-env        | Cross-platform env vars in scripts   |

## Project Structure

```
.
├── api/                 # API clients (ParaBankApi)
├── config/              # Runtime config (index.ts) and environment URLs (environments.ts)
├── data/                # Test data (users.json)
├── features/            # Gherkin feature files (login, register)
├── fixtures/            # Playwright fixtures + Given/When/Then exports
├── pages/               # Page objects (BasePage, LoginPage, RegisterPage, AccountsOverviewPage)
├── step-definitions/    # Step implementations
├── support/             # Global setup / teardown
├── utils/               # Helpers and logger
├── .features-gen/       # Generated specs (auto-created by bddgen, do not edit)
├── reports/             # Test results, Allure results/report, logs (generated)
├── playwright.config.ts
└── tsconfig.json
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- Java 8+ (only needed to generate and open the Allure report)

## Setup

```bash
npm install
npx playwright install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable       | Default     | Description                                                         |
| -------------- | ----------- | ------------------------------------------------------------------- |
| `TEST_ENV`     | `qa`        | Target environment: `dev`, `qa` or `uat`                            |
| `BROWSER`      | `chromium`  | `chromium`, `firefox` or `webkit`                                   |
| `HEADLESS`     | `true`      | Set `false` to see the browser (also set by `--headed/--debug/--ui`) |
| `VIEWPORT`     | `1920x1080` | Viewport size when not maximized (`WIDTHxHEIGHT`)                   |
| `MAXIMIZE`     | `true`      | Headed Chromium starts maximized; `false` uses `VIEWPORT`           |
| `SLOW_MO`      | `0`         | Delay in ms between browser actions                                 |
| `PARALLEL`     | `1`         | Number of workers                                                   |
| `RETRY`        | `0`         | Retries for failed tests                                            |
| `LOG_LEVEL`    | `info`      | Winston log level                                                   |
| `APP_USERNAME` | (required)  | ParaBank login username                                             |
| `APP_PASSWORD` | (required)  | ParaBank login password                                             |

`.env` is gitignored. Never commit real credentials.

## Running Tests

The config runs `bddgen` automatically, so `.feature` files are turned into specs on every run.

```bash
npx playwright test                    # all tests (headless)
npx playwright test --headed           # headed
npx playwright test login --headed     # one feature (filename regex)
npx playwright test --grep @smoke      # by tag
npx playwright test --ui               # Playwright UI mode
```

### npm scripts

| Script                    | What it does                                  |
| ------------------------- | --------------------------------------------- |
| `npm test`                | Clean `reports/` then run all tests           |
| `npm run test:headed`     | Run all tests headed                          |
| `npm run test:parallel`   | Run with 3 workers                            |
| `npm run test:smoke`      | Run `@smoke` scenarios                        |
| `npm run test:regression` | Run `@regression` scenarios                   |
| `npm run test:login`      | Run `@login` scenarios                        |
| `npm run test:register`   | Run `@register` scenarios                     |
| `npm run test:dev`        | Run against `dev`                             |
| `npm run test:qa`         | Run against `qa`                              |
| `npm run test:uat`        | Run against `uat`                             |
| `npm run typecheck`       | TypeScript type check                         |
| `npm run report`          | Generate and open the Allure report           |

Note: `npm test` cleans `reports/` first; `npx playwright test` does not.

## Reports and Artifacts

- **Allure**: `npm run report` (generates `reports/allure-report` from `reports/allure-results` and opens it)
- **Test results**: `reports/test-results/` (screenshots for every test; video and trace on failure)
- **Logs**: `reports/logs/execution.log` and `reports/logs/error.log`

To view a trace: `npx playwright show-trace <path-to-trace.zip>`

## Test Scenarios

**Login** (`features/login.feature`)
- Valid login shows Accounts Overview and the welcome message (`@smoke`)
- Invalid credentials (wrong password, unknown user) show an error (`@negative`)
- Empty credentials show "Please enter a username and password." (`@negative`)

**Register** (`features/register.feature`)
- Register a new customer with a unique username from `data/users.json` (`@smoke`)

## Writing New Tests

1. Add a scenario to a `.feature` file in `features/` (or create a new one).
2. Implement the steps in `step-definitions/` and import `Given`/`When`/`Then` from `fixtures/fixtures.ts`:

   ```ts
   import { expect } from '@playwright/test';
   import { Then } from '../fixtures/fixtures';

   Then('the Accounts Overview page should be displayed', async ({ page, accountsPage }) => {
     await expect(page).toHaveTitle(/Accounts Overview/);
   });
   ```

3. Put locators and page actions in a page object under `pages/` and expose it as a fixture in `fixtures/fixtures.ts`.
4. Use the `testData` fixture to pass values between steps in the same scenario.
5. Run `npm run typecheck` and the tests.

## Notes

- ParaBank's public demo database is reset from time to time. `support/global-setup.ts` checks the login user through the API and registers it again if needed.
- For invalid logins ParaBank returns either "The username and password could not be verified." or "An internal error has occurred and has been logged." depending on the demo DB state. The step accepts both.
- All three environments point to the public ParaBank site. In a real project, set per-environment URLs in `config/environments.ts`.

## Author

Madan Gowda
