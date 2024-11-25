FROM nginx:stable
WORKDIR /app
COPY dist/frontend-cis /usr/share/nginx/html