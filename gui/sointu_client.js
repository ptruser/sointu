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

var floatBuf = new Float32Array();

function start(serverUrl) {
    Synth.create(serverUrl,buffer => {
        var c = new Float32Array(floatBuf.length + buffer.length);
        c.set(floatBuf);
        c.set(buffer, floatBuf.length);
        floatBuf = c;
    }).then(synth => {
        synth.setCommands([2,4,6,8,11,0]);
        synth.setValues([80,80,80,80,64,64,64,64,128,70,128,64,64,128]);
        synth.trigger(0,60);
        synth.render(44100);
        synth.render(44100);
        synth.release(0);
        synth.render(44100);
    })
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