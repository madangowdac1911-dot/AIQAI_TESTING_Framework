import { expect } from '@playwright/test';
import { config } from '../config';
import { Then, When } from '../fixtures/fixtures';
import { readJson } from '../utils/helpers';

type Credentials = { username: string; password: string };

When('the user logs in with valid credentials', async ({ loginPage }) => {
  await loginPage.login(config.user.username, config.user.password);
});

When('the user logs in with {string} credentials from test data', async ({ loginPage }, key: string) => {
  const creds = readJson<{ invalidLogins: Record<string, Credentials> }>('users.json').invalidLogins[key];
  if (!creds) throw new Error(`No invalidLogins entry "${key}" in data/users.json`);
  await loginPage.login(creds.username, creds.password);
});

When(
  'the user logs in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  },
);

Then('the Accounts Overview page should be displayed', async ({ page, accountsPage }) => {
  await expect(page).toHaveTitle(/Accounts Overview/);
  await expect(accountsPage.heading).toHaveText('Accounts Overview');
});

Then('the welcome message should be visible', async ({ accountsPage }) => {
  await expect(accountsPage.welcomeText).toContainText('Welcome');
});

// The public ParaBank demo returns either message for bad credentials, depending on its database state.
const INVALID_LOGIN_ERROR =
  /^(The username and password could not be verified\.|An internal error has occurred and has been logged\.)$/;

Then('the invalid credentials error should be displayed', async ({ loginPage }) => {
  await expect(loginPage.errorMessage).toHaveText(INVALID_LOGIN_ERROR);
});

Then('the login error message {string} should be displayed', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toHaveText(message);
});
