import dotenv from 'dotenv';
import { Currency } from '@tecafrik/africa-payment-sdk';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration interface for the payment portal server
 */
export interface Config {
  port: number;
  paydunya: {
    masterKey: string;
    privateKey: string;
    publicKey: string;
    token: string;
    mode: 'live' | 'test';
  };
  currency: Currency;
}

/**
 * Load and validate configuration from environment variables
 */
function loadConfig(): Config {
  const port = parseInt(process.env.PORT || '3000', 10);
  
  const masterKey = process.env.PAYDUNYA_MASTER_KEY || '';
  const privateKey = process.env.PAYDUNYA_PRIVATE_KEY || '';
  const publicKey = process.env.PAYDUNYA_PUBLIC_KEY || '';
  const token = process.env.PAYDUNYA_TOKEN || '';
  const mode = (process.env.PAYDUNYA_MODE || 'test') as 'live' | 'test';
  
  const currency = (process.env.CURRENCY || 'XOF') as Currency;

  return {
    port,
    paydunya: {
      masterKey,
      privateKey,
      publicKey,
      token,
      mode,
    },
    currency,
  };
}

/**
 * Exported typed configuration object
 */
export const config: Config = loadConfig();
