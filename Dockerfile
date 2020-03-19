FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8080
USER 1001
CMD [ "node", "bin/www" ]