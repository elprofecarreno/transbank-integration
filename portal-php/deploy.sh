#!/bin/bash
CONTAINER_ID=$(docker ps -a | grep portal-php | awk '{print $1}')

if [ -n "$CONTAINER_ID" ]; then
    echo "DELETE DOCKER CONTAINER $CONTAINER_ID"
    DOCKER_CONTAINER_DELETE=$(docker rm -f $CONTAINER_ID)
fi


IMAGE_ID=$(docker images | grep portal-php | awk '{print $3}')

if [ -n "$IMAGE_ID" ]; then
    echo "DELETE DOCKER IMAGE $IMAGE_ID"
    DOCKER_IMAGE_DELETE=$(docker rmi -f $IMAGE_ID)
fi

docker compose up