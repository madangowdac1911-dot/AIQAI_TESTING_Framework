export type EnvName = 'dev' | 'qa' | 'uat';

export interface EnvConfig {
  name: EnvName;
  baseUrl: string;
  apiUrl: string;
}

// ParaBank only has one public site, so all three point to it for the demo.
// In a real project each environment would have its own URL.
export const environments: Record<EnvName, EnvConfig> = {
  dev: {
    name: 'dev',
    baseUrl: 'https://parabank.parasoft.com/parabank',
    apiUrl: 'https://parabank.parasoft.com/parabank/services/bank',
  },
  qa: {
    name: 'qa',
    baseUrl: 'https://parabank.parasoft.com/parabank',
    apiUrl: 'https://parabank.parasoft.com/parabank/services/bank',
  },
  uat: {
    name: 'uat',
    baseUrl: 'https://parabank.parasoft.com/parabank',
    apiUrl: 'https://parabank.parasoft.com/parabank/services/bank',
  },
};
