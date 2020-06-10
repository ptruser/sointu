const OscillatorFlags = {
    SAMPLE: 128,
    SINE: 64,
    TRISAW: 32,
    PULSE: 16,
    LFO: 8,
    GATE: 4,
    UNISON2: 1,
    UNISON3: 2,
    UNISON4: 3,
    UNISONS: 3
};

const FilterFlags = {
    LOWPASS: 64,
    BANDPASS: 32,
    HIGHPASS: 16,
    NEGBANDPASS: 8,
    NEGHIGHPASS: 4
};

const DelayState = {
    NORMAL: 1,
    NOTETRACKING: 2,
    BPMTRACKING: 3
};


const defaultUnits = {
    envelope: {
        stereo: false,
        attack: 64,
        decay: 64,
        sustain: 64,
        release: 64,
        gain: 64
    },
    oscillator: {
        stereo: false,
        transpose: 64,
        detune: 64,
        phaseofs: 64,
        color: 64,
        shape: 64,
        gain: 64,
        flags: OscillatorFlags.SINE
    },
    noise: {
        stereo: false,
        shape: 64,
        gain: 64
    },
    loadvalue: {
        stereo: false,
        value: 64
    },
    receive: { stereo: false },    
    input: {
        stereo: false,
        channel: 0
    },   
    filter: {
        stereo: false,
        frequency: 64,
        resonance: 64,
        flags: FilterFlags.BANDPASS
    },
    pan: {
        stereo: false,
        panning: 64
    },
    distort: {
        stereo: false,
        drive: 64
    },
    hold: {
        stereo: false,      
        frequency: 64
    },
    crush: {
        stereo: false,
        resolution: 64
    },
    gain: {
        stereo: false,
        amount: 64
    },
    invgain: {
        stereo: false,
        amount: 64
    },
    clip: {
        stereo: false
    },
    delay: {
        stereo: false,
        state: DelayState.BPMTRACKING,
        pregain: 64,
        dry: 64,
        feedback: 64,
        damp: 64,
        beats: 1
    },
    compressor: {
        stereo: false,
        attack: 64,
        release: 64,
        invgain: 64,
        threshold: 64,
        ratio: 64
    },
    pop: { stereo: false },
    add: { stereo: false },
    addpop: { stereo: false },  
    loadnote: { stereo: false },
    mul: { stereo: false },
    mulpop: { stereo: false},
    push: { stereo: false},
    exchange: { stereo: false}, 
    speed: { },
    out: { 
        stereo: true,
        gain: 64    
    },
    outaux: { 
        stereo: true,
        gain: 64,
        auxgain: 64   
    },
    aux: { 
        stereo: true,
        gain: 64,
        channel: 2    
    },
    send: { 
        stereo: false,
        amount: 64,
        port: undefined,
        pop: false, 
        global: false     
    }
}

Object.keys(defaultUnits).forEach(x => {
    defaultUnits[x].type = x;
})

const defaultInstrument = [
    defaultUnits.envelope,
    defaultUnits.oscillator,
    defaultUnits.mulpop,
    defaultUnits.delay,
    defaultUnits.pan,
    defaultUnits.out
]

export { defaultUnits, defaultInstrument }