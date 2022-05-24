import { Encrypted } from '@/interface/app-config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigDefaultService {
  getDefaultEncrypted(): Encrypted {
    return {
      token: {
        access: '7jWGaGgMxAKy6IaphwHopuPMqSq3EXSz',
        refresh: 'zlIgZjw8NlHOjD6O6ekYZ793mJxBpz3B',
        passKey:
          'EMH#!Xj7aPaEyE4RVg4aOsUB^r%H0R4DVT89hzE4*kSU@FdU&6myuP8AorQ7dmVs7IJslDljtv@#e#J%g0yQ5F9a%&X%iPkr%9%',
      },
      app: {
        key: '?99|232={2-+]94?-13<A.225>7[464[',
        iv: 'cLKIHvnWLbiVXnSncLKIHvnWLbiVXnSn',
      },
    };
  }

  getDefaultMail(): any {
    return {
      host: '',
      port: 465,
      logger: true,
      connectionTimeout: 10000,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '', // generated ethereal user
        pass: '', // generated ethereal password
      },
    };
  }
}
