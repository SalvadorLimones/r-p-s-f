FROM node:14-alpine
ADD . /appDir
COPY .env.prod /appDir/.env
WORKDIR /appDir
CMD ["npm","start"]
EXPOSE 8080