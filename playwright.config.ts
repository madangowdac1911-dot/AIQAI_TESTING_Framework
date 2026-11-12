import { execSync } from 'child_process';
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { config } from './config';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['fixtures/**/*.ts', 'step-definitions/**/*.ts'],
  outputDir: '.features-gen',
});

// Generate specs from .feature files so plain `npx playwright test` works (main process only, not in workers).
if (!process.env.TEST_WORKER_INDEX && !process.env.BDDGEN_CHILD) {
  execSync('npx bddgen', { stdio: 'inherit', env: { ...process.env, BDDGEN_CHILD: '1' } });
}

export default defineConfig({
  testDir,
  globalSetup: './support/global-setup.ts',
  globalTeardown: './support/global-teardown.ts',
  outputDir: 'reports/test-results',
  timeout: config.timeouts.step * 2,
  fullyParallel: true,
  workers: Number(process.env.PARALLEL ?? 1),
  retries: Number(process.env.RETRY ?? 0),
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        environmentInfo: {
          Environment: config.env.name,
          Browser: config.browser,
          Headless: String(config.headless),
          Node: process.version,
        },
      },
    ],
  ],
  use: {
    browserName: config.browser,
    headless: config.headless,
    // Headed Chromium opens maximized and uses the real window size; otherwise a fixed viewport is used.
    viewport: config.maximize ? null : config.viewport,
    launchOptions: {
      slowMo: config.slowMo,
      args: config.maximize ? ['--start-maximized'] : [],
    },
    actionTimeout: config.timeouts.action,
    navigationTimeout: config.timeouts.navigation,
    screenshot: 'on',
    video: { mode: 'retain-on-failure', size: config.viewport },
    trace: 'retain-on-failure',
  },
});
