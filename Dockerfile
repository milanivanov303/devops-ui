FROM gitlab.codixfr.private:5005/enterpriseapps/images/nodejs:1.0 AS base

RUN apk add --no-cache --virtual .gyp python make g++

# ---------- Builder ----------
FROM base AS builder

COPY --chown=node:node .npmrc ./package*.json ./
COPY --chown=node:node .env.dev ./.env

RUN npm set progress=false \
  && npm config set depth 0 \
  && npm ci

COPY --chown=node:node . .

RUN npm run lint \
  && npm run build \
  && npm prune --production \
  && npm cache clear --force

# ---------- Web ----------
FROM gitlab.codixfr.private:5005/enterpriseapps/images/nginx:1.0 AS web

#RUN apk add --no-cache cron

COPY --from=builder --chown=nginx:nginx /app/dist ./public
COPY --from=builder --chown=nginx:nginx /app/docker/nginx/ /etc/nginx/conf.d
RUN chmod 777 /etc/nginx/conf.d/reload.sh

RUN crontab /etc/nginx/conf.d/nginx_graceful_cron

CMD ["nginx", "-g", "daemon off;"]
