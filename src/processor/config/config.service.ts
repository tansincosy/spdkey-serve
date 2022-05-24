import { isEmpty } from 'lodash';
import { YAML_CONFIG_FILENAME } from '@/constant/config.constant';
import { AppConfig, Encrypted } from '@/interface/app-config.interface';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import * as yaml from 'yaml';

@Injectable()
export class ConfigService implements OnModuleInit, OnModuleDestroy {
  private appConfig = {};
  onModuleInit() {
    this.appConfig = this.getConfigFromYaml();
  }

  getConfigFromYaml() {
    return yaml.parse(
      readFileSync(join(YAML_CONFIG_FILENAME), 'utf8'),
    ) as AppConfig;
  }

  onModuleDestroy() {
    this.appConfig = {};
  }

  get(configKey: keyof AppConfig) {
    if (isEmpty(this.appConfig)) {
      const allAppConfig = this.getConfigFromYaml() || {};
      return allAppConfig[configKey];
    }
    return this.appConfig[configKey];
  }

  private getConfigFromEnv(encrypted: Encrypted): Encrypted {
    const token = encrypted?.token || {};
    const app = encrypted?.app || {};
    return {
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
    };
  }
}
