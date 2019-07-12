FROM node:10.16.0-slim
LABEL maintainer="Enterprise Apps"

# Set timezone
ARG timezone
RUN ln -snf /usr/share/zoneinfo/${timezone} /etc/localtime && echo ${timezone} > /etc/timezone

# Install dependencies
RUN apt-get update && apt-get -y install vim git procps openssh-server sudo

RUN npm install -g @vue/cli

# Chnage node user uid
RUN usermod -u 2000 node \
    && groupmod -g 2000 node

# Create a group and user
RUN useradd --system --create-home --home-dir /home/enterprise enterprise \
    && usermod --uid 1000 --gid www-data --shell /bin/bash enterprise \
    && groupmod -g 1000 www-data
RUN echo 'enterprise:devenv' | chpasswd

# Allow enterprise to start ssh deamon
RUN echo "Cmnd_Alias START_SSH = /etc/init.d/ssh start" >> /etc/sudoers
RUN echo "enterprise ALL=(ALL) NOPASSWD: START_SSH" >> /etc/sudoers

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint
RUN chmod 777 /usr/local/bin/entrypoint

# Switch to enterprise user
USER enterprise

ENTRYPOINT ["/usr/local/bin/entrypoint"]
