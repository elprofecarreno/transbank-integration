FROM alpine:3.19
ENV APP_DIRECTORY portal_flask_web
ENV API_REST_HOST 172.17.0.2
ENV API_REST_PORT 8900
ENV APP_WEB_HOST=0.0.0.0
ENV APP_WEB_PORT=9000
# INSTALL TZDATA
RUN apk add --update --no-cache tzdata
# INSTALL PYTHON 3
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# INSTALL PIP
RUN apk add --update --no-cache py3-pip
# CREATE DIRECTORY TRANSBANK
RUN mkdir -p /opt/app/$APP_DIRECTORY
# CHANGE DIRECTORY
WORKDIR /opt/app/
# COPY DEPENDENCIES
COPY requirements.txt .
# INSTALL DEPENDENCIES
RUN python3 -m venv env
RUN source env/bin/activate && python -m pip install -r requirements.txt
# CHANGE DIRECTORY
WORKDIR /opt/app/$APP_DIRECTORY
# RUN APP
CMD  source ../env/bin/activate && python manage.py