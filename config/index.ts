import dotenv from 'dotenv';
import { environments, EnvName } from './environments';

dotenv.config({ quiet: true });

// `npx playwright test --headed / --debug / --ui` should behave like HEADLESS=false (env is inherited by workers).
if (['--headed', '--debug', '--ui'].some((flag) => process.argv.includes(flag))) process.env.HEADLESS = 'false';

const envName = (process.env.TEST_ENV ?? 'qa').toLowerCase() as EnvName;
if (!environments[envName]) {
  throw new Error(`Unknown TEST_ENV "${envName}". Use one of: ${Object.keys(environments).join(', ')}`);
}

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key} (check your .env file)`);
  return value;
};

const browser = (process.env.BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit';
const headless = process.env.HEADLESS !== 'false';
const [width, height] = (process.env.VIEWPORT ?? '1920x1080').toLowerCase().split('x').map(Number);

export const config = {
  env: environments[envName],
  browser,
  headless,
  slowMo: Number(process.env.SLOW_MO ?? 0),
  // Headed Chromium opens maximized and uses the real window size; otherwise a fixed viewport is used.
  maximize: !headless && browser === 'chromium' && process.env.MAXIMIZE !== 'false',
  viewport: { width: width || 1920, height: height || 1080 },
  timeouts: {
    step: 60_000,
    action: 15_000,
    navigation: 30_000,
  },
  user: {
    username: required('APP_USERNAME'),
    password: required('APP_PASSWORD'),
  },
  paths: {
    reports: 'reports',
    screenshots: 'reports/screenshots',
    videos: 'reports/videos',
    traces: 'reports/traces',
    logs: 'reports/logs',
  },
};
