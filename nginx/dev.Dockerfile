FROM nginx:stable-alpine
COPY nginx-dev.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
