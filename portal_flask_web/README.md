## PROJECT PORTAL FLASK WEB


## LOCAL CONFIGURATION 

**CREATE FILE .env**

```.env
API_REST_HOST=127.0.0.1
API_REST_PORT=8900
APP_WEB_HOST=0.0.0.0
APP_WEB_PORT=9000
```


## DOCKER DEPLOY

## BUILD IMAGE

```shell
 docker build -t portal-flask-web:0.0.1 .
 ```

## BUILD CONTAINER FROM BUILDING IMAGE

```shell
 docker run -dit --name portal-flask-web-container -p 9000:9000 -v $PWD:/opt/app/portal_flask_web portal-flask-web:0.0.1
 ```

## PORTAL FLASK WEB URL

[portal-web](http://127.0.0.1:9000/)