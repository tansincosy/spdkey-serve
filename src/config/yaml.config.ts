import { readFileSync } from 'fs';
import * as yaml from 'yaml';
import { join } from 'path';
import { AppConfig } from '@/common';

const YAML_CONFIG_FILENAME = 'sources/config/application.yml';

export default () => {
  return yaml.parse(
    readFileSync(join(YAML_CONFIG_FILENAME), 'utf8'),
  ) as AppConfig;
};
