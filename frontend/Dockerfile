FROM nginxinc/nginx-unprivileged:stable

USER root
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
    && chown -R nginx:nginx /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp
COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx . /usr/share/nginx/html/
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=3s --retries=3 CMD curl --fail --silent http://127.0.0.1:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
