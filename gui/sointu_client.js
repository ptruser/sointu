function start(websocketServerLocation) {
    ws = new WebSocket(websocketServerLocation);

    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        Object.keys(data).forEach(k => {
            if (k == "display") {
                var show = data[k] == true;
                document.getElementById("analyzing").style.opacity = !show ? 1 : 0;
                document.getElementById("results").style.opacity = show ? 1 : 0;
            } else {
                var element = document.getElementById(k)
                element.innerHTML = data[k] + "%";
                var x = (parseFloat(data[k]) - 50) / 50,
                    r = Math.round(255 - Math.max(x, 0) * 255),
                    g = Math.round(255 + Math.min(x, 0) * 255),
                    b = Math.round(255 - Math.abs(x) * 255),
                    c = `rgb(${r},${g},${b})`;
                element.style.color = c;
            }
        });
    };

    ws.onopen  = function () {
        document.getElementById("no_connection").style.opacity = 0;
        document.getElementById("analyzing").style.opacity = 0;
        document.getElementById("results").style.opacity = 1;
    };

    ws.onclose = function () {
        document.getElementById("no_connection").style.opacity = 1;
        document.getElementById("analyzing").style.opacity = 0;
        document.getElementById("results").style.opacity = 0;
        // Try to reconnect in 5 seconds
        setTimeout(function () { start(websocketServerLocation) }, 5000);
    };
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

window.onload = function () {
    var ip = get('ip') || "127.0.0.1"
    var port = get('port') || "80"
    start("ws://"+ip+":"+port+"/")
}