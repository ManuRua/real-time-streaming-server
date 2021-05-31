FROM alpine:latest
LABEL maintainer: manuruaco@gmail.com

RUN mkdir -p /home/streaming-server && \
    cd tmp && \
    apk update && \
    apk add --no-cache bash npm ffmpeg pcre-dev make

WORKDIR /home/streaming-server
COPY package.json /home/streaming-server
RUN mkdir -p /home/streaming-server/media/streamvideo && \
    chmod 775 /home/streaming-server/media/streamvideo