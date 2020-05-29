function start(websocketServerLocation) {
    ws = new WebSocket(websocketServerLocation);

    ws.onmessage = function (event) {
    };

    ws.onopen  = function () {
        const typedArray1 = new Int8Array(8);
        typedArray1[0] = 1;
        ws.send(typedArray1);
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