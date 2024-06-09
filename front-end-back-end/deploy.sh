#!/bin/bash
removeContainerAndDeleteImage() {
    NAME=$1

    CONTAINER_ID=$(docker ps -a | grep $NAME | awk '{print $1}')
    if [ -n "$CONTAINER_ID" ]; then
        echo "DELETE DOCKER CONTAINER $CONTAINER_ID"
        DOCKER_CONTAINER_DELETE=$(docker rm -f $CONTAINER_ID)
    fi

    IMAGE_ID=$(docker images | grep $NAME | awk '{print $3}')
    if [ -n "$IMAGE_ID" ]; then
        echo "DELETE DOCKER IMAGE $IMAGE_ID"
        DOCKER_IMAGE_DELETE=$(docker rmi -f $IMAGE_ID)
    fi
}

removeContainerAndDeleteImage "api-rest-cliente-transbank"
removeContainerAndDeleteImage "portal-flask-web"
removeContainerAndDeleteImage "portal-web"

docker compose up