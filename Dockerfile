# Stage 1: Build the Angular application
FROM node:18 as build-stage
WORKDIR /app
# Копирование файлов package.json и package-lock.json из поддиректории
COPY rectangles-angular-client/package*.json ./
RUN npm install
# Копирование всех остальных файлов проекта
COPY rectangles-angular-client/ ./
RUN npm run build --prod

# Stage 2: Copy built Angular static files to a directory
FROM node:18-alpine
WORKDIR /app
# Убедитесь, что путь к скомпилированным файлам соответствует пути сборки
COPY --from=build-stage /app/dist/rectangles-angular-client /app/public

# You can serve this using a simple static server or integrate with your existing backend
EXPOSE 3000
CMD ["npx", "serve", "/app/public"]
