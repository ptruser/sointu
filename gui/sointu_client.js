const COMMAND = {
    'RENDER': 0,
    'TRIGGER': 1,
    'RELEASE': 2,
    'SET_COMMANDS': 3,
    'SET_VALUES': 4,
    'SET_POLYPHONY': 5,
    'SET_NUMVOICES': 6,
    'RESET': 7
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context;

document.addEventListener('click', function() {
     context = new AudioContext();
     playSound(floatBuf);
  });

function playSound(buf) {
    var buffer = context.createBuffer(2, buf.length, context.sampleRate)
    buffer.copyToChannel(buf, 0)
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  }

var floatBuf;

function start(websocketServerLocation) {
    ws = new WebSocket(websocketServerLocation);

    ws.onmessage = function (event) {
        var buf = new ArrayBuffer(event.data.size);
        var abuf = event.data.arrayBuffer();

        event.data.arrayBuffer().then(buffer => {
            floatBuf = new Float32Array(buffer);
        });
    };

    ws.onopen  = function () {
        ws.send(new Uint8Array([COMMAND.SET_COMMANDS,2,4,6,8,11,0]));
        ws.send(new Uint8Array([COMMAND.SET_VALUES,64,64,64,64,64,64,64,64,64,64,64,32,64]));
        ws.send(new Uint8Array([COMMAND.TRIGGER,0,80]));
        ws.send(new Uint8Array([COMMAND.RENDER,0,0,6]))
        ws.send(new Uint8Array([COMMAND.RELEASE,0])); 
        ws.send(new Uint8Array([COMMAND.RENDER,0,0,6])) 
    };

    ws.onclose = function () {
    };
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

$(document).ready(function(){
    var ip = get('ip') || "127.0.0.1"
    var port = get('port') || "80"
    start("ws://"+ip+":"+port+"/")
})