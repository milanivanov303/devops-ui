FROM avitohol.codixfr.private:5000/apache:2.4.39-v3

# Copy apache vhost file
COPY httpd-vhosts.conf conf/extra/httpd-vhosts.conf

# Install cron
RUN apt-get update && apt-get -y install cron

# Set crontab
COPY apache_graceful_cron /etc/cron.d/apache_graceful_cron
RUN chmod 0644 /etc/cron.d/apache_graceful_cron
RUN crontab /etc/cron.d/apache_graceful_cron

# Copy and give rights to reload script
COPY reload.sh /usr/local/bin/reload
RUN chmod 777 /usr/local/bin/reload

# Copy and give rights to entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint
RUN chmod 777 /usr/local/bin/entrypoint
