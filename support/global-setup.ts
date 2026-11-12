import { ParaBankApi } from '../api/ParaBankApi';
import { config } from '../config';
import { CustomerDetails } from '../pages/RegisterPage';
import { readJson } from '../utils/helpers';
import { logger } from '../utils/logger';

/** Runs once before all tests: make sure the login user exists. */
export default async function globalSetup(): Promise<void> {
  logger.info(`===== Run started | env=${config.env.name} | browser=${config.browser} | headless=${config.headless} =====`);

  // ParaBank's demo database is reset from time to time, so re-create the login user via API if needed.
  const api = await ParaBankApi.create();
  try {
    if (!(await api.canLogin(config.user.username, config.user.password))) {
      logger.warn(`User "${config.user.username}" not found - registering via API`);
      const { newCustomer } = readJson<{ newCustomer: Omit<CustomerDetails, 'username'> }>('users.json');
      await api.register({ ...newCustomer, username: config.user.username, password: config.user.password });
    }
  } finally {
    await api.dispose();
  }
}
