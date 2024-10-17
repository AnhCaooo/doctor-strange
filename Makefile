# AnhCao 2024
DOCKER_USERNAME = anhcaoo
DOCKER_IMAGE = doctor-strange
TAGGED_VERSION = 1.0.0
DOCKER_CONTAINER = ${DOCKER_IMAGE}:${TAGGED_VERSION} 

.PHONY: build tag push docker

build: 
	docker build --tag ${DOCKER_CONTAINER} .

tag: 
	docker tag ${DOCKER_CONTAINER} ${DOCKER_USERNAME}/${DOCKER_CONTAINER}

push: 
	docker push ${DOCKER_USERNAME}/${DOCKER_CONTAINER}

docker: build