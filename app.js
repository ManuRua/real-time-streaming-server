const NodeMediaServer = require('node-media-server');
const RtspServer = require('rtsp-streaming-server').default;

const config = {
    logType: 3,

    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        webroot: './www',
        mediaroot: './media/steamvideo',
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
            }
        ]
    }
    // relay: {
    //     ffmpeg: '/usr/bin/ffmpeg',
    //     tasks: [
    //         {
    //             app: 'rtsp',
    //             mode: 'pull',
    //             edge: 'rtsp://192.168.0.21',
    //             rtsp_transport: 'tcp'
    //         },
    //         {
    //             app: 'rtmp',
    //             mode: 'push',
    //             edge: 'rtmp://127.0.0.1/live',
    //             rtsp_transport: 'tcp'
    //         }
    //     ]
    // }
};

const nms = new NodeMediaServer(config)
const server = new RtspServer({
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 50,
    publishServerHooks: {
        checkMount
    },
    clientServerHooks: {
        checkMount,
        clientClose
    }
});

run();
nms.run();

async function run() {
    try {
        console.log("Starting RTSP server!")
        await server.start();
    } catch (e) {
        console.error(e);
    }
}

function checkMount(req) {
    try {
        const url = new URL(req.uri);
        console.log(url);

        return true;
    } catch (e) {
        console.error(e);
    }
}

function clientClose(mount) {
    try {
        console.log(`A client has disconnected from ${mount.path}`);
    } catch (e) {
        console.error(e);
    }
}