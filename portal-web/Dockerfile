FROM alpine:3.19
ENV APP_DIRECTORY portal_web
ENV API_REST_HOST 172.17.0.2
ENV API_REST_PORT 8900
# INSTALL TZDATA
RUN apk add --update --no-cache tzdata
# INSTALL APACHE 2
RUN apk add --update --no-cache apache2 
RUN sed -i 's/Listen 80/Listen 0.0.0.0:80/' /etc/apache2/httpd.conf
# RUN APP
CMD httpd -D FOREGROUND