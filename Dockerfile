FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV SERVICE_NAME=service-test
CMD ["node", "dist/main"]
