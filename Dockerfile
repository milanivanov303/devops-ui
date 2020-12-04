# ---------- Builder ----------
FROM gitlab.codixfr.private:5005/enterpriseapps/images/nodejs:1.0 AS builder

RUN apk add --no-cache --virtual .gyp python make g++

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

RUN crontab /etc/nginx/conf.d/nginx_graceful_cron

CMD ["nginx", "-g", "daemon off;"]

# ---------- Webssh2 ----------
FROM gitlab.codixfr.private:5005/enterpriseapps/images/nodejs:1.0 AS webssh2

RUN apk update  && \
	apk add --no-cache --update git  && \
	git clone https://github.com/billchurch/WebSSH2.git && \
	cd WebSSH2/ && \
	cp -r app/ /usr/src/ && \
	rm -rf WebSSH2/ && \
	cd /usr/src/    && \
	apk del git && \
	npm install --production

# Copy config file
COPY docker/webssh2/config.json /usr/src/config.json

WORKDIR /usr/src
EXPOSE 2222
CMD npm run start
