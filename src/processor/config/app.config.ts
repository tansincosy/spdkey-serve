const dataDir = process.env.APP_DATA_DIR || 'app_data';

export const AppConfigLoader = () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  name: process.env.APP_NAME || 'app',
  version: process.env.APP_VERSION || '0.0.0',
  author: 'yy921010',
  dataDir,
  env: process.env.APP_ENV || 'dev',
  log: {
    level: process.env.LOG_LEVEL || 'info',
    dir: `${dataDir}/logs`,
  },
  cache: {
    host: process.env.CACHE_STORE_HOST || '',
    port: parseInt(process.env.CACHE_STORE_PORT, 10),
    pass: process.env.CACHE_STORE_PASS || '',
  },
  encrypted: {
    key: process.env.ENCRYPTED_KEY || '2A9ul1is8Fiu2BC4D20p7Bxgkqo9n4cj',
    iv: process.env.ENCRYPTED_IV || 'v8bE3xv5owoA116yB4E0svn88Bn4xm3g',
  },
  token: {
    secret: process.env.TOKEN_SECRET || '7jWGaGgMxAKy6IaphwHopuPMqSq3EXSz',
    refresh: process.env.TOKEN_REFRESH || 'zlIgZjw8NlHOjD6O6ekYZ793mJxBpz3B',
    access: process.env.TOKEN_ACCESS || '7jWGaGgMxAKy6IaphwHopuPMqSq3EXSz',
  },
  mail: {
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT, 10) || 456,
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASSWORD || '',
    redirect: process.env.MAIL_PORT || '',
    secure: process.env.MAIL_SECURE || false,
  },
  channel: {
    m3uPath: `${dataDir}/channel/m3u`,
    logoPath: `${dataDir}/channel/logo`,
    programXMLPath: `${dataDir}/channel/program`,
    allowChannelPath: `${dataDir}/channel/_tmp`,
  },
});
