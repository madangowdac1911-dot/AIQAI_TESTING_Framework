import { BasePage } from './BasePage';

export class AccountsOverviewPage extends BasePage {
  readonly heading = this.page.locator('#rightPanel h1.title').first();
  readonly welcomeText = this.page.locator('#leftPanel p.smallText');
  private readonly logoutLink = this.page.getByRole('link', { name: 'Log Out' });

  async logout(): Promise<void> {
    await this.click(this.logoutLink, 'Log Out link');
  }
}
