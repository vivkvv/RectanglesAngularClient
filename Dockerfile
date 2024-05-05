# Stage 1: Build the Angular application
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Copy built Angular static files to a directory
FROM node:18-alpine
WORKDIR /app
COPY --from=build-stage /app/dist/rectangles-angular-client /app/public

# You can serve this using a simple static server or integrate with your existing backend
EXPOSE 3000
CMD ["npx", "serve", "/app/public"]
