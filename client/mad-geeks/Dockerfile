FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"] #cache invalidation 
RUN npm install 
COPY . .
EXPOSE 3000
RUN chown -R node /app
USER node 
CMD ["npm", "start"]
