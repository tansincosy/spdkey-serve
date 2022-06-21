import { createProxyMiddleware } from 'http-proxy-middleware';

export const oauth2Proxy = createProxyMiddleware({
  target: process.env.OAUTH_SERVER_URL,
  changeOrigin: true,
  pathRewrite: {
    [`^/oauth2`]: '',
  },
});
