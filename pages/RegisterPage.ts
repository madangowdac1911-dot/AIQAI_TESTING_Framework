import { BasePage } from './BasePage';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
}

export class RegisterPage extends BasePage {
  private readonly field = (id: string) => this.page.locator(`[id="${id}"]`);
  private readonly registerButton = this.page.locator('input[value="Register"]');
  readonly heading = this.page.locator('#rightPanel h1.title');
  readonly successMessage = this.page.locator('#rightPanel p');

  async goto(): Promise<void> {
    await this.open('/register.htm');
  }

  async fillForm(c: CustomerDetails): Promise<void> {
    await this.fill(this.field('customer.firstName'), c.firstName, 'First Name');
    await this.fill(this.field('customer.lastName'), c.lastName, 'Last Name');
    await this.fill(this.field('customer.address.street'), c.street, 'Address');
    await this.fill(this.field('customer.address.city'), c.city, 'City');
    await this.fill(this.field('customer.address.state'), c.state, 'State');
    await this.fill(this.field('customer.address.zipCode'), c.zipCode, 'Zip Code');
    await this.fill(this.field('customer.phoneNumber'), c.phone, 'Phone');
    await this.fill(this.field('customer.ssn'), c.ssn, 'SSN');
    await this.fill(this.field('customer.username'), c.username, 'Username');
    await this.fill(this.field('customer.password'), c.password, 'Password', true);
    await this.fill(this.field('repeatedPassword'), c.password, 'Confirm Password', true);
  }

  async submit(): Promise<void> {
    await this.click(this.registerButton, 'Register button');
  }
}
