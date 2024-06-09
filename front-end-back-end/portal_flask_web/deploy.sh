#!/bin/bash
CONTAINER_ID=$(docker ps -a | grep portafolio-portal-web | awk '{print $1}')

if [ -n "$CONTAINER_ID" ]; then
    DOCKER_CONTAINER_DELETE=$(docker rm -f $CONTAINER_ID)
fi

CONTAINER_ID=$(docker ps -a | grep portafolio-mysql-db | awk '{print $1}')

if [ -n "$CONTAINER_ID" ]; then
    DOCKER_CONTAINER_DELETE=$(docker rm -f $CONTAINER_ID)
fi

IMAGE_ID=$(docker images | grep portafolio-portal-web | awk '{print $3}')

if [ -n "$IMAGE_ID" ]; then
    DOCKER_IMAGE_DELETE=$(docker rmi -f $IMAGE_ID)
fi

IMAGE_ID=$(docker images | grep portafolio-mysql-db | awk '{print $3}')

if [ -n "$IMAGE_ID" ]; then
    DOCKER_IMAGE_DELETE=$(docker rmi -f $IMAGE_ID)
fi

docker compose up