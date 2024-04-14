## PROJECT API REST CLIENTE TRANSBANK


## DOCKER DEPLOY

## BUILD IMAGE

```shell
 docker build -t api-rest-cliente-transbank:0.0.1 .
 ```

## BUILD CONTAINER FROM BUILDING IMAGE

```shell
 docker run -dit --name api-rest-cliente-transbank-container -p 8900:8900 -v $PWD:/opt/app/api-rest-cliente-transbank api-rest-cliente-transbank:0.0.1
 ```