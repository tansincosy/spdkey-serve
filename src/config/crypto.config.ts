import { registerAs } from '@nestjs/config';

export interface CryptoConfig {
  accessToken: string;
  refreshToken: string;
  passToken: string;
  encryptedKey: string;
  encryptedIV: string;
}

export const CryptoConfig = registerAs('crypto', () => ({
  accessToken: process.env.token_access || '',
  refreshToken: process.env.token_refresh || '',
  passToken: process.env.token_pass || '',
  encryptedKey: process.env.encrypted_key || '?99|232={2-+]94?-13<A.225>7[464[',
  encryptedIV: process.env.encrypted_iv || 'cLKIHvnWLbiVXnSncLKIHvnWLbiVXnSn',
}));
