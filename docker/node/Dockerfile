FROM node:10.16.0

# Set timezone
ARG timezone
RUN ln -snf /usr/share/zoneinfo/${timezone} /etc/localtime && echo ${timezone} > /etc/timezone

RUN npm install -g @vue/cli

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint

# Give rights to entrypoint script
RUN chmod u+x /usr/local/bin/entrypoint

# Run entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint"]
