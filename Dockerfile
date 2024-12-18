# AnhCao 2024
FROM --platform=linux/amd64 node:alpine

LABEL maintainer="Anh Cao <anhcao4922@gmail.com>"

# create the directory inside the container
WORKDIR /usr/src/

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# After installing the dependencies, we need to copy the src folder from our local file into the base image
COPY src ./src

# Copy tsconfig.json to base image too
COPY tsconfig.json ./tsconfig.json

# COPY dotenv file  
COPY .env ./.env

# Then, run the build command, this will compile the ts files into javascript files
RUN npm run build

# our api gateway server is running on port 5002 within the container, so need to expose it
EXPOSE 5002

# the command that starts our api gateway server
CMD ["node", "dist/index.js"]