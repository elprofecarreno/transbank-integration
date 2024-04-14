## PROJECT PORTAL WEB


## LOCAL CONFIGURATION 

## DOCKER DEPLOY

## BUILD IMAGE

```shell
 docker build -t portal-web:0.0.1 .
 ```

## BUILD CONTAINER FROM BUILDING IMAGE

```shell
 docker run -dit --name portal-web-container -p 9100:80 -v $PWD:/var/www/localhost/htdocs/portal-web portal-web:0.0.1
 ```

 ## PORTAL FLASK WEB URL

[http://localhost:9100/portal-web](http://localhost:9100/portal-web)