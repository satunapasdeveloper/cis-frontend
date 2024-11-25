FROM nginx:stable
WORKDIR /app
COPY dist/trijuna-retail-system /usr/share/nginx/html