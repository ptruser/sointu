class Synth {
    COMMAND = {
        'RENDER': 0,
        'TRIGGER': 1,
        'RELEASE': 2,
        'SET_COMMANDS': 3,
        'SET_VALUES': 4,
        'SET_POLYPHONY': 5,
        'SET_NUMVOICES': 6,
        'RESET': 7
    }

    static create(serverUrl,callback) {
        return new Promise((resolve, reject) => {
            var ws = new WebSocket(serverUrl);
            var synth = new Synth(ws);
            synth.ws = ws;
            ws.onopen = () => {
                resolve(synth);
            }
            ws.onclose = () => {
                reject("Socket closed");
            }
            ws.onmessage = event => {
                var arrayBuf = new ArrayBuffer(event.data.size);     
                event.data.arrayBuffer().then(buffer => {
                    callback(new Float32Array(buffer));
                });
            };
        });
    }

    render(numSamples) {
        arr = new ArrayBuffer(5);
        view = new DataView(arr);
        view.setUint32(1, numSamples, true); // true = little-endian
        view.setUint8(0,COMMAND.RENDER)
        this.ws.send(cmd);
    }

    trigger(voiceno,note) {
        var cmd = new Uint8Array([COMMAND.TRIGGER,voiceno,note]);
        this.ws.send(cmd);
    }

    release(voiceno) {
        var cmd = new Uint8Array([COMMAND.RELEASE,voiceno]);
        this.ws.send(cmd);
    }

    setCommands(commands) {

    }

    setValues(values) {
        
    }

    setPolyphony(polyphony) {
        var cmd = new Uint8Array([COMMAND.SET_POLYPHONY,polyphony]);
        this.ws.send(cmd);
    }

    setNumVoices(numVoices) {
        var cmd = new Uint8Array([COMMAND.SET_NUMVOICES,numVoices]);
        this.ws.send(cmd);
    }

    reset() {
        var cmd = new Uint8Array([COMMAND.RESET]);
        this.ws.send(cmd);
    }
}