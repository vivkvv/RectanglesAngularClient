# Stage 1: Build the Angular application
FROM node:18 as angular-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --outputPath=./dist/out

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=angular-build /app/dist/out/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
