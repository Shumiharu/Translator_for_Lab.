FROM mariadb:latest

COPY ./default.conf /etc/mariadb/conf.d/default.conf

COPY init_db.sql /docker-entrypoint-initdb.d/01_init_db.sql