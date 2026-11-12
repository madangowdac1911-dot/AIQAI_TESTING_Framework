import { Given } from '../fixtures/fixtures';

Given('the user is on the ParaBank home page', async ({ loginPage }) => {
  await loginPage.goto();
});
