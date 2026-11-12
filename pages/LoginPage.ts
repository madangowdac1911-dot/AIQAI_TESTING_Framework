import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  private readonly loginButton = this.page.locator('input[value="Log In"]');
  private readonly registerLink = this.page.getByRole('link', { name: 'Register' });
  readonly errorMessage = this.page.locator('#rightPanel p.error');

  async goto(): Promise<void> {
    await this.open('/index.htm');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'Username');
    await this.fill(this.passwordInput, password, 'Password', true);
    await this.click(this.loginButton, 'Log In button');
  }

  async goToRegister(): Promise<void> {
    await this.click(this.registerLink, 'Register link');
  }
}
