import { expect } from '@playwright/test';
import { Then, When } from '../fixtures/fixtures';
import { CustomerDetails } from '../pages/RegisterPage';
import { readJson, uniqueId } from '../utils/helpers';

type NewCustomerData = Omit<CustomerDetails, 'username'> & { usernamePrefix: string };

When('the user opens the registration page', async ({ loginPage }) => {
  await loginPage.goToRegister();
});

When(
  'the user registers with valid customer details from {string}',
  async ({ registerPage, testData, $testInfo }, file: string) => {
    const { usernamePrefix, ...data } = readJson<{ newCustomer: NewCustomerData }>(file).newCustomer;
    const username = `${usernamePrefix}_${uniqueId()}`; // unique on every run
    testData.username = username;
    await $testInfo.attach('Generated username', { body: username, contentType: 'text/plain' });

    await registerPage.fillForm({ ...data, username });
    await registerPage.submit();
  },
);

Then('the account should be created successfully', async ({ registerPage }) => {
  await expect(registerPage.successMessage).toContainText(
    'Your account was created successfully. You are now logged in.',
  );
});

Then('the welcome heading should show the new username', async ({ registerPage, testData }) => {
  await expect(registerPage.heading).toHaveText(`Welcome ${testData.username}`);
});
