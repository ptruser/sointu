package vm

import (
	"errors"
	"fmt"
	"math"

	"github.com/vsariola/sointu"
)

//go:generate go run generate/generate.go

type VM struct {
	bytePatch BytePatch
	stack     []float32
	synth     synth
}

type SynthService struct {
}

const MAX_VOICES = 32
const MAX_UNITS = 63

type unit struct {
	state [8]float32
	ports [8]float32
}

type voice struct {
	note    byte
	release bool
	units   [MAX_UNITS]unit
}

type synth struct {
	left     float32
	right    float32
	randSeed uint32
	voices   [MAX_VOICES]voice
}

const (
	envStateAttack = iota
	envStateDecay
	envStateSustain
	envStateRelease
)

func Synth(patch sointu.Patch) (sointu.Synth, error) {
	bytePatch, err := Encode(patch, AllFeatures{})
	if err != nil {
		return nil, fmt.Errorf("error compiling %v", err)
	}
	ret := &VM{bytePatch: *bytePatch, stack: make([]float32, 0, 4)}
	ret.synth.randSeed = 1
	return ret, nil
}

func (s SynthService) Compile(patch sointu.Patch) (sointu.Synth, error) {
	synth, err := Synth(patch)
	return synth, err
}

func (s *VM) Trigger(voiceIndex int, note byte) {
	s.synth.voices[voiceIndex] = voice{}
	s.synth.voices[voiceIndex].note = note
}

func (s *VM) Release(voiceIndex int) {
	s.synth.voices[voiceIndex].release = true
}

func (s *VM) Update(patch sointu.Patch) error {
	// TODO: update more gracefully
	bytePatch, err := Encode(patch, AllFeatures{})
	if err != nil {
		return fmt.Errorf("error compiling %v", err)
	}
	*s = VM{bytePatch: *bytePatch, stack: make([]float32, 0, 4)}
	s.synth.randSeed = 1
	return nil
}

func (s *VM) Render(buffer []float32, maxtime int) (samples int, time int, renderError error) {
	var params [8]float32
	stack := s.stack[:]
	stack = append(stack, []float32{0, 0, 0, 0}...)
	synth := &s.synth
	for time < maxtime && len(buffer) > 1 {
		commands := s.bytePatch.Commands
		values := s.bytePatch.Values
		voicesRemaining := s.bytePatch.NumVoices
		voices := s.synth.voices[:]
		units := voices[0].units[:]
		for voicesRemaining > 0 {
			if len(commands) == 0 {
				return samples, time, errors.New("command stream ended prematurely")
			}
			if len(voices) == 0 {
				return samples, time, errors.New("too many voices in patch")
			}
			if len(units) == 0 {
				return samples, time, errors.New("too many units in instrument")
			}
			op := commands[0]
			commands = commands[1:]
			stereo := op&1 == 1
			opNoStereo := (op & 0xFE) >> 1
			if opNoStereo == 0 {
				voices = voices[1:]
				units = voices[0].units[:]
				voicesRemaining--
				continue
			}
			tcount := transformCounts[opNoStereo-1]
			if len(values) < tcount {
				return samples, time, errors.New("value stream ended prematurely")
			}
			unit := &units[0]
			for i := 0; i < tcount; i++ {
				params[i] = float32(values[0])/128.0 + unit.ports[i]
				unit.ports[i] = 0
				values = values[1:]
			}
			l := len(stack)
			switch opNoStereo {
			case opAdd:
				if stereo {
					stack[l-1] += stack[l-3]
					stack[l-2] += stack[l-4]
				} else {
					stack[l-1] += stack[l-2]
				}
			case opAddp:
				if stereo {
					stack[l-3] += stack[l-1]
					stack[l-4] += stack[l-2]
					stack = stack[:l-2]
				} else {
					stack[l-2] += stack[l-1]
					stack = stack[:l-1]
				}
			case opMul:
				if stereo {
					stack[l-1] *= stack[l-3]
					stack[l-2] *= stack[l-4]
				} else {
					stack[l-1] *= stack[l-2]
				}
			case opMulp:
				if stereo {
					stack[l-3] *= stack[l-1]
					stack[l-4] *= stack[l-2]
					stack = stack[:l-2]
				} else {
					stack[l-2] *= stack[l-1]
					stack = stack[:l-1]
				}
			case opXch:
				if stereo {
					stack[l-3], stack[l-1] = stack[l-1], stack[l-3]
					stack[l-4], stack[l-2] = stack[l-2], stack[l-4]
				} else {
					stack[l-2], stack[l-1] = stack[l-1], stack[l-2]
				}
			case opPush:
				if stereo {
					stack = append(stack, stack[l-2])
				}
				stack = append(stack, stack[l-1])
			case opPop:
				if stereo {
					stack = stack[:l-2]
				} else {
					stack = stack[:l-1]
				}
			case opDistort:
				amount := params[0]
				if stereo {
					stack[l-2] = waveshape(stack[l-2], amount)
				}
				stack[l-1] = waveshape(stack[l-1], amount)
			case opLoadval:
				val := params[0]*2 - 1
				if stereo {
					stack = append(stack, val)
				}
				stack = append(stack, val)
			case opOut:
				if stereo {
					synth.left += params[0] * stack[l-1]
					synth.right += params[0] * stack[l-2]
					stack = stack[:l-2]
				} else {
					synth.left += params[0] * stack[l-1]
					stack = stack[:l-1]
				}
			case opEnvelope:
				if voices[0].release {
					unit.state[0] = envStateRelease // set state to release
				}
				state := unit.state[0]
				level := unit.state[1]
				switch state {
				case envStateAttack:
					level += nonLinearMap(params[0])
					if level >= 1 {
						level = 1
						state = envStateDecay
					}
				case envStateDecay:
					level -= nonLinearMap(params[1])
					if sustain := params[2]; level <= sustain {
						level = sustain
					}
				case envStateRelease:
					level -= nonLinearMap(params[3])
					if level <= 0 {
						level = 0
					}
				}
				unit.state[0] = state
				unit.state[1] = level
				output := level * params[4]
				stack = append(stack, output)
				if stereo {
					stack = append(stack, output)
				}
			case opNoise:
				if stereo {
					value := waveshape(synth.rand(), params[0]) * params[1]
					stack = append(stack, value)
				}
				value := waveshape(synth.rand(), params[0]) * params[1]
				stack = append(stack, value)
			default:
				return samples, time, errors.New("invalid / unimplemented opcode")
			}
			units = units[1:]
		}
		if len(stack) < 4 {
			return samples, time, errors.New("stack underflow")
		}
		buffer[0] = synth.left
		buffer[1] = synth.right
		synth.left = 0
		synth.right = 0
		buffer = buffer[2:]
		samples++
		time++
	}
	s.stack = stack[:0]
	return samples, time, nil
}

func (s *synth) rand() float32 {
	s.randSeed *= 16007
	return float32(int32(s.randSeed)) / -2147483648.0
}

func nonLinearMap(value float32) float32 {
	return float32(math.Pow(2, float64(-24*value)))
}

func waveshape(value, amount float32) float32 {
	absVal := value
	if absVal < 0 {
		absVal = -absVal
	}
	return value * amount / (1 - amount + (2*amount-1)*absVal)
}
