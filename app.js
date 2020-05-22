const config = require('config');
const NodeMediaServer = require('node-media-server');
// const https = require('https');
const http = require('http');
const _ = require('lodash');

const mediaConfig = _.cloneDeep(config.get('media'));
let nms;

const api = config.get('api');
const req = http.request(api, res => {
    let cameras = [];
    res.on('data', data => {
        try {
            cameras = JSON.parse(data.toString());
        } catch (error) {
            console.error(`Problem parsing data: ${error.message}`)
        }
    });

    // The whole response has been received. Launch media server.
    res.on('end', () => {
        const tasks = cameras.map(cam => {
            return {
                app: 'live',
                mode: 'static',
                edge: cam.cameraIp,
                name: cam.name,
                rtsp_transport: 'tcp'
            };
        });
        console.log(tasks);
        const relay = {
            relay: {
                ffmpeg: '/usr/bin/ffmpeg',
                tasks
            }
        };

        const mediaServer = {
            ...mediaConfig,
            ...relay
        };
        nms = new NodeMediaServer(mediaServer);

        console.log("Starting Node Media Server...");
        nms.run();
    });
})

req.on('error', error => {
    console.error(`Problem with request: ${error.message}`)
})

req.end();