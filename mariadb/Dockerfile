FROM mariadb:latest

COPY ./etc/default.conf /etc/mariadb/conf.d/default.conf

COPY ./setup.sql /docker-entrypoint-initdb.d/setup.sql