FROM nginx:alpine

# Copy static assets to Nginx default directory
COPY . /usr/share/nginx/html

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Configure Nginx to listen on 8080 instead of 80
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
