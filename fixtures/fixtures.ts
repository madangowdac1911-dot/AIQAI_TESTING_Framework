import { createBdd, test as base } from 'playwright-bdd';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { logger } from '../utils/logger';

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  accountsPage: AccountsOverviewPage;
  /** Scratch space to pass values between steps (e.g. the generated username). Fresh per scenario. */
  testData: Record<string, string>;
  scenarioLog: void;
};

/**
 * Per-scenario fixtures (replaces Cucumber's World). Each scenario gets its own page and page objects,
 * so scenarios never leak state into each other - which is what makes parallel runs safe.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  accountsPage: async ({ page }, use) => use(new AccountsOverviewPage(page)),
  testData: async ({}, use) => use({}),
  scenarioLog: [
    async ({}, use, testInfo) => {
      logger.info(`▶ Scenario: ${testInfo.title}`);
      await use();
      if (testInfo.status === testInfo.expectedStatus) logger.info(`✔ PASSED: ${testInfo.title}`);
      else logger.error(`✖ FAILED: ${testInfo.title}\n${testInfo.error?.message ?? ''}`);
    },
    { auto: true },
  ],
});

export const { Given, When, Then } = createBdd(test);
