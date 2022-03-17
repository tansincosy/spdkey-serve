import { registerAs } from '@nestjs/config';

export interface CryptoConfig {
  accessToken: string;
  refreshToken: string;
  passToken: string;
  aesKey: string;
  aesIV: string;
}

export default registerAs('crypto', () => ({
  accessToken: process.env.TOKEN_ACCESS || '',
  refreshToken: process.env.TOKEN_REFRESH || '',
  passToken: process.env.TOKEN_PASS || '',
  aesKey: process.env.AES_KEY || 'cLKIHvnWLbiVXnSn',
  aesIV: process.env.AES_IV || 'pHenBAGKuZLaZpXl',
}));
