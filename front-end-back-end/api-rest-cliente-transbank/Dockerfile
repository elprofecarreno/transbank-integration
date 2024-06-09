FROM alpine:3.19
ENV APP_DIRECTORY api-rest-cliente-transbank
# INSTALL TZDATA
RUN apk add --update --no-cache tzdata
# INSTALL PYTHON 3
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# INSTALL PIP
RUN apk add --update --no-cache py3-pip
# CREATE DIRECTORY TRANSBANK
RUN mkdir -p /opt/app/$APP_DIRECTORY
COPY . /opt/app/$APP_DIRECTORY
# CHANGE DIRECTORY
WORKDIR /opt/app/
# COPY DEPENDENCIES
COPY requirements.txt .
# INSTALL DEPENDENCIES
RUN python3 -m venv env
RUN source env/bin/activate && python -m pip install -r requirements.txt
# RUN APP
CMD  source env/bin/activate && python $APP_DIRECTORY/manage.py