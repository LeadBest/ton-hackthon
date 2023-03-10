#!/bin/sh

# Inside Cloud Run container instances, the value of the PORT environment variable always reflects the port to which requests are sent. It defaults to 8080.
sed -i "s,LISTEN_PORT,$PORT,g" /etc/nginx/nginx.conf

php-fpm -D

while ! nc -w 1 -z 127.0.0.1 9000; do sleep 0.1; done;

nginx
