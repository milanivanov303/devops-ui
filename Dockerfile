FROM gitlab.codixfr.private:5005/enterpriseapps/images/nodejs:1.0 AS base

# ---------- Builder ----------
FROM base AS builder

COPY --chown=node:node .npmrc ./package*.json ./

RUN npm set progress=false \
  && npm config set depth 0 \
  && npm ci

RUN npx browserslist@latest --update-db

COPY --chown=node:node . .

RUN npm run lint \
  && npm run build \
  && npm prune --production \
  && npm cache clear --force

# ---------- Web ----------
FROM gitlab.codixfr.private:5005/enterpriseapps/images/nginx:2.0 AS web

COPY --from=builder --chown=nginx:nginx /app/dist ./public
COPY --from=builder --chown=nginx:nginx /app/docker/nginx/default.conf /etc/nginx/conf.d/
COPY --from=builder --chown=nginx:nginx /app/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint
COPY --from=builder --chown=nginx:nginx /app/docker/nginx/reload.sh /usr/local/bin/reload

RUN chmod 777 /usr/local/bin/entrypoint
RUN chmod 777 /usr/local/bin/reload

ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["nginx", "-g", "daemon off;"]
