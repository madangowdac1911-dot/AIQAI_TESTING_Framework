import { expect, Locator, Page } from '@playwright/test';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Parent class for every page object.
 * Holds the shared actions so child pages never repeat them.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Opens a path relative to the environment base URL, e.g. "/index.htm". */
  async open(path: string): Promise<void> {
    const url = `${config.env.baseUrl}${path}`;
    logger.info(`Navigating to ${url}`);
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async click(locator: Locator, name: string): Promise<void> {
    logger.info(`Click: ${name}`);
    await locator.click();
  }

  async fill(locator: Locator, value: string, name: string, mask = false): Promise<void> {
    logger.info(`Fill: ${name} = ${mask ? '******' : value}`);
    await locator.fill(value);
    await expect(locator).toHaveValue(value); // guards against the page resetting the field after fill
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
