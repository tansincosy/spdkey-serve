import { CacheModule } from '@nestjs/common';
import * as store from 'cache-manager-redis-store';
import yamlConfig from '../config/yaml.config';
const config = yamlConfig();
const host = config?.cache?.redis?.host;
const port = config?.cache?.redis?.port;
const getCacheConfig = () => {
  if (host && port) {
    return {
      port,
      host,
      store,
      isGlobal: true,
    };
  }
  return {
    isGlobal: true,
  };
};
const AppCacheModule = CacheModule.register(getCacheConfig());
export { AppCacheModule };
