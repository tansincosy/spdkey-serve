# 安装所有依赖
FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 拷贝资源
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn prebuild && yarn db:generate && yarn build:prod && yarn install --production --ignore-scripts --prefer-offline

# 构建生产环境镜像
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

RUN mkdir -p /app/logs
RUN chown -R nestjs:nodejs /app/logs

# 拷贝文件
COPY --from=builder /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder /app/graphql ./graphql
# COPY --from=builder /app/.env ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
