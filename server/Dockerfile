FROM node:20
WORKDIR /app
COPY ./package.json /app
RUN npm install 
ENV NODE_ENV = development
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]