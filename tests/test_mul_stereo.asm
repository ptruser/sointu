%define BPM 100
%define SINGLE_FILE
%define USE_SECTIONS

%include "../src/sointu.inc"

SU_BEGIN_PATTERNS
    PATTERN 64, HLD, HLD, HLD, HLD, HLD, HLD, HLD,  0, 0, 0, 0, 0, 0, 0, 0
SU_END_PATTERNS

SU_BEGIN_TRACKS
    TRACK   VOICES(1),0
SU_END_TRACKS

SU_BEGIN_PATCH
    SU_BEGIN_INSTRUMENT VOICES(1) ; Instrument0
        SU_LOADVAL MONO,VALUE(96)
        SU_LOADVAL MONO,VALUE(128)
        SU_LOADVAL MONO,VALUE(0)
        SU_LOADVAL MONO,VALUE(96)   
        SU_MUL     STEREO
        SU_XCH     STEREO
        SU_POP     MONO
        SU_POP     MONO
        SU_OUT     STEREO,GAIN(128)
    SU_END_INSTRUMENT
SU_END_PATCH

%include "../src/sointu.asm"
