FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV SERVICE_NAME=tuvcb-service-test
CMD ["npm", "run", "start:dev"]
