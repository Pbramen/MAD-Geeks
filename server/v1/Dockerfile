FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 4000
RUN chown -R node /app
USER node
CMD ["npm", "run", "dev--w"]
