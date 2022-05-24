import { registerAs } from '@nestjs/config';
import Config from './yaml.config';
import { Encrypted } from '@/common';

const appConfig = Config();

const token = appConfig?.encrypted?.token || {};
const app = appConfig?.encrypted?.app || {};
export const CryptoConfig = registerAs<Encrypted>('crypto', () => ({
  token: {
    access: '7jWGaGgMxAKy6IaphwHopuPMqSq3EXSz',
    refresh: 'zlIgZjw8NlHOjD6O6ekYZ793mJxBpz3B',
    passKey:
      'EMH#!Xj7aPaEyE4RVg4aOsUB^r%H0R4DVT89hzE4*kSU@FdU&6myuP8AorQ7dmVs7IJslDljtv@#e#J%g0yQ5F9a%&X%iPkr%9%',
    ...token,
  },
  app: {
    key: '?99|232={2-+]94?-13<A.225>7[464[',
    iv: 'cLKIHvnWLbiVXnSncLKIHvnWLbiVXnSn',
    ...app,
  },
}));
