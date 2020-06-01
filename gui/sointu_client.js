window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context;

document.addEventListener('click', function() {
    context = new AudioContext();
    context.sampleRate = 44100; 
    playSound(floatBuf);
  });

function playSound(arr) {
    var left = new Float32Array(arr.length/2);
    var right = new Float32Array(arr.length/2);
    var buffer = context.createBuffer(2, arr.length/2, context.sampleRate)
    for (var i = 0;i < arr.length/2;i++) { // deinterleave the sound
        left[i] = arr[i*2];
        right[i] = arr[i*2+1];
    }
    buffer.copyToChannel(left, 0);
    buffer.copyToChannel(right, 1);
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
        ws.send(new Uint8Array([COMMAND.SET_VALUES,80,80,80,80,64,64,64,64,128,70,128,64,64,128]));
        ws.send(new Uint8Array([COMMAND.TRIGGER,0,60]));
        ws.send(new Uint8Array([COMMAND.RENDER,0,0,10]))
        ws.send(new Uint8Array([COMMAND.RENDER,0,0,10])) 
        ws.send(new Uint8Array([COMMAND.RELEASE,0])); 
        ws.send(new Uint8Array([COMMAND.RENDER,0,0,10])) 
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