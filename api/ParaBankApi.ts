import { APIRequestContext, request } from '@playwright/test';
import { config } from '../config';
import { CustomerDetails } from '../pages/RegisterPage';
import { logger } from '../utils/logger';

/**
 * API client built on Playwright's APIRequestContext.
 * Used for fast test-data setup (no browser needed) and for API-level checks.
 */
export class ParaBankApi {
  private constructor(private readonly ctx: APIRequestContext) {}

  static async create(): Promise<ParaBankApi> {
    const ctx = await request.newContext({ extraHTTPHeaders: { Accept: 'application/json' } });
    return new ParaBankApi(ctx);
  }

  /** Returns true if the username/password pair is valid (REST endpoint: GET /login/{u}/{p}). */
  async canLogin(username: string, password: string): Promise<boolean> {
    const url = `${config.env.apiUrl}/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`;
    const res = await this.ctx.get(url);
    logger.info(`API GET /login/${username} -> ${res.status()}`);
    return res.ok();
  }

  /** Registers a customer by posting the same form the UI uses (ParaBank has no REST register endpoint). */
  async register(c: CustomerDetails): Promise<void> {
    const formUrl = `${config.env.baseUrl}/register.htm`;
    await this.ctx.get(formUrl); // obtain a session cookie first
    const res = await this.ctx.post(formUrl, {
      form: {
        'customer.firstName': c.firstName,
        'customer.lastName': c.lastName,
        'customer.address.street': c.street,
        'customer.address.city': c.city,
        'customer.address.state': c.state,
        'customer.address.zipCode': c.zipCode,
        'customer.phoneNumber': c.phone,
        'customer.ssn': c.ssn,
        'customer.username': c.username,
        'customer.password': c.password,
        repeatedPassword: c.password,
      },
    });
    logger.info(`API POST /register.htm (${c.username}) -> ${res.status()}`);
    if (!res.ok()) throw new Error(`API registration failed for ${c.username}: HTTP ${res.status()}`);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }
}
