const config = require('config');
const NodeMediaServer = require('node-media-server');
const https = require('https');
const _ = require('lodash');

const mediaConfig = _.cloneDeep(config.get('media'));
let nms;

const api = config.get('api');
const req = https.request(api, res => {
    res.on('data', data => {
        const dataMock = {
            relay: {
                ffmpeg: '/usr/bin/ffmpeg',
                tasks: [
                    {
                        app: 'live',
                        mode: 'static',
                        edge: 'rtsp://admin:PastView@192.168.0.13:554',
                        name: 'cam1',
                        rtsp_transport: 'tcp'
                    }
                ]
            }
        };
        const mediaServer = {
            ...mediaConfig,
            ...dataMock
        };
        nms = new NodeMediaServer(mediaServer);
    });

    // The whole response has been received. Launch media server.
    res.on('end', () => {
        console.log("Starting Node Media Server...");
        nms.run();
    });
})

req.on('error', error => {
    console.error(error)
})

req.end();