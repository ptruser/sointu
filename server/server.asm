%include "../src/sointu.inc"

USE_ENVELOPE
USE_OSCILLAT
USE_MULP
USE_PAN
USE_OUT

%define INCLUDE_TRISAW
%define INCLUDE_SINE
%define INCLUDE_PULSE
%define INCLUDE_GATE
%define INCLUDE_STEREO_OSCILLAT
%define INCLUDE_STEREO_ENVELOPE
%define INCLUDE_STEREO_OUT

%include "../src/sointu.asm"

section .text

struc su_synth_state
    .synth      resb    su_synth.size
    .delaywrks  resb    su_delayline_wrk.size * 64
    .commands   resb    32 * 64
    .values     resb    32 * 64 * 8
    .polyphony  resd    1
    .numvoices  resd    1
    .randseed   resd    1
    .globaltime resd    1
    .rowtick    resd    1
endstruc

SECT_TEXT(sutick)


EXPORT MANGLE_FUNC(su_tick,PTRSIZE)
%if BITS == 32  ; stdcall
    mov     ecx, [esp + 4]
    pushad
%else
    %ifidn __OUTPUT_FORMAT__,win64 ; win64, following registers are volatile, RCX already our pointer
        push_registers rbx, rbp, rdi, rsi, rsp
    %else
        push_registers rbx, rbp
        mov     rcx, rdi
    %endif
%endif
    push    _CX
    mov     eax, [_CX + su_synth_state.randseed]
    push    _AX                             ; randseed
    mov     eax, [_CX + su_synth_state.globaltime]
    push    _AX                        ; global tick time
    push    0       ; dummy row
    mov     eax, [_CX + su_synth_state.rowtick]
    push    _AX                        ;rowtick
    mov     eax, [_CX + su_synth_state.polyphony]
    push    _AX                        ;polyphony
    mov     eax, [_CX + su_synth_state.numvoices]
    push    _AX                        ;numvoices
    lea     _DX, [_CX+ su_synth_state.synth] 
    lea     COM, [_CX+ su_synth_state.commands] 
    lea     VAL, [_CX+ su_synth_state.values] 
    lea     WRK, [_DX + su_synth.voices]  
    lea     _CX, [_CX+ su_synth_state.delaywrks - su_delayline_wrk.filtstate] 
    call    MANGLE_FUNC(su_run_vm,0)
    mov     eax, [_SP + PTRSIZE*2]
    mov     edx, [_SP + PTRSIZE*5]
    add     _SP,PTRSIZE * 6
    pop     _CX
    mov     [_CX + su_synth_state.rowtick], eax
    mov     [_CX + su_synth_state.randseed], edx
%if BITS == 32  ; stdcall
    popad
    ret 4
%else
    %ifidn __OUTPUT_FORMAT__,win64 ; win64, following registers are volatile, RCX already our pointer
        pop_registers rbx, rbp, rdi, rsi, rsp
    %else
        pop_registers rbx, rbp
    %endif
    ret
%endif
