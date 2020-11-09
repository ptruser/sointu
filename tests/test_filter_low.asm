%define BPM 100

%include "sointu/header.inc"

BEGIN_PATTERNS
    PATTERN 64, 0, 68, 0, 32, 0, 0, 0,  75, 0, 78, 0,   0, 0, 0, 0
END_PATTERNS

BEGIN_TRACKS
    TRACK   VOICES(1),0
END_TRACKS

BEGIN_PATCH
    BEGIN_INSTRUMENT VOICES(1) ; Instrument0
        SU_ENVELOPE MONO,ATTACK(64),DECAY(64),SUSTAIN(64),RELEASE(72),GAIN(128)
        SU_OSCILLATOR MONO,TRANSPOSE(64),DETUNE(64),PHASE(0),COLOR(128),SHAPE(64),GAIN(128),TYPE(TRISAW),LFO(0),UNISON(0)
        SU_MULP     MONO
        SU_FILTER   MONO,FREQUENCY(32),RESONANCE(64),LOWPASS(1),BANDPASS(0),HIGHPASS(0),NEGBANDPASS(0),NEGHIGHPASS(0)
        SU_PAN      MONO,PANNING(64)
        SU_OUT      STEREO,GAIN(128)
    END_INSTRUMENT
END_PATCH

%include "sointu/footer.inc"
