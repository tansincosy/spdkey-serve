import { registerAs } from '@nestjs/config';

export interface CryptoConfig {
  accessToken: string;
  refreshToken: string;
  passToken: string;
  encryptedKey: string;
  encryptedIV: string;
}

export const CryptoConfig = registerAs('crypto', () => ({
  accessToken: process.env.token_access || '7jWGaGgMxAKy6IaphwHopuPMqSq3EXSz',
  refreshToken: process.env.token_refresh || 'zlIgZjw8NlHOjD6O6ekYZ793mJxBpz3B',
  passToken:
    process.env.token_pass ||
    'EMH#!Xj7aPaEyE4RVg4aOsUB^r%H0R4DVT89hzE4*kSU@FdU&6myuP8AorQ7dmVs7IJslDljtv@#e#J%g0yQ5F9a%&X%iPkr%9%',
  encryptedKey: process.env.encrypted_key || '?99|232={2-+]94?-13<A.225>7[464[',
  encryptedIV: process.env.encrypted_iv || 'cLKIHvnWLbiVXnSncLKIHvnWLbiVXnSn',
}));
