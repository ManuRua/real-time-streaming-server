FROM alpine:latest
LABEL maintainer: imanurua@gmail.com
# ENV NGINX_VER=1.17.6

RUN mkdir nginx && \
    mkdir -p /home/streaming-server && \
    cd tmp && \
    apk update && \
    apk add --no-cache bash npm ffmpeg pcre-dev make
#     apk add --no-cache --virtual .git git && \
#     wget http://nginx.org/download/nginx-$NGINX_VER.tar.gz && \
#     tar -xzf nginx-$NGINX_VER.tar.gz && \
#     git clone https://github.com/winshining/nginx-http-flv-module.git && \
#     apk add --no-cache --virtual .buildenv gcc libc-dev linux-headers openssl-dev zlib-dev && \
#     cd nginx-$NGINX_VER && \
#     ./configure --prefix=/nginx --with-http_ssl_module --add-module=../nginx-http-flv-module && \
#     make && \
#     make install && \
#     cd /nginx && \
#     rm -r /tmp/* && \
#     apk del .git && \
#     apk del .buildenv && \
#     rm conf/nginx.conf
# WORKDIR /nginx
# COPY conf/* ./conf/
# COPY start.sh .
# RUN chmod +x ./start.sh
# VOLUME [ "/nginx" ]

WORKDIR /home/streaming-server
COPY package.json /home/streaming-server
RUN mkdir -p /home/streaming-server/media/streamvideo && \
    chmod 775 /home/streaming-server/media/streamvideo