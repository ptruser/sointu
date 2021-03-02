package vm_test

import (
	"bytes"
	"encoding/binary"
	"io/ioutil"
	"log"
	"math"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/vsariola/sointu"
	"github.com/vsariola/sointu/vm"
	"gopkg.in/yaml.v2"
)

func TestAllRegressionTests(t *testing.T) {
	_, myname, _, _ := runtime.Caller(0)
	files, err := filepath.Glob(path.Join(path.Dir(myname), "..", "tests", "*.yml"))
	if err != nil {
		t.Fatalf("cannot glob files in the test directory: %v", err)
	}
	for _, filename := range files {
		basename := filepath.Base(filename)
		testname := strings.TrimSuffix(basename, path.Ext(basename))
		t.Run(testname, func(t *testing.T) {
			if runtime.GOOS != "windows" && strings.Contains(testname, "sample") {
				t.Skip("Samples (gm.dls) available only on Windows")
				return
			}
			asmcode, err := ioutil.ReadFile(filename)
			if err != nil {
				t.Fatalf("cannot read the .asm file: %v", filename)
			}
			var song sointu.Song
			err = yaml.Unmarshal(asmcode, &song)
			if err != nil {
				t.Fatalf("could not parse the .yml file: %v", err)
			}
			synth, err := vm.Synth(song.Patch)
			if err != nil {
				t.Fatalf("Compiling patch failed: %v", err)
			}
			buffer, err := sointu.Play(synth, song)
			buffer = buffer[:song.Score.LengthInRows()*song.SamplesPerRow()*2] // extend to the nominal length always.
			if err != nil {
				t.Fatalf("Play failed: %v", err)
			}
			if os.Getenv("SOINTU_TEST_SAVE_OUTPUT") == "YES" {
				outputpath := path.Join(path.Dir(myname), "actual_output")
				if _, err := os.Stat(outputpath); os.IsNotExist(err) {
					os.Mkdir(outputpath, 0755)
				}
				outFileName := path.Join(path.Dir(myname), "actual_output", testname+".raw")
				outfile, err := os.OpenFile(outFileName, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
				defer outfile.Close()
				if err != nil {
					t.Fatalf("Creating file failed: %v", err)
				}
				var createdbuf bytes.Buffer
				err = binary.Write(&createdbuf, binary.LittleEndian, buffer)
				if err != nil {
					t.Fatalf("error converting buffer: %v", err)
				}
				_, err = outfile.Write(createdbuf.Bytes())
				if err != nil {
					log.Fatal(err)
				}
			}
			compareToRawFloat32(t, buffer, testname+".raw")
		})
	}
}

func TestStackUnderflow(t *testing.T) {
	patch := sointu.Patch{sointu.Instrument{NumVoices: 1, Units: []sointu.Unit{
		sointu.Unit{Type: "pop", Parameters: map[string]int{}},
	}}}
	synth, err := vm.Synth(patch)
	if err != nil {
		t.Fatalf("bridge compile error: %v", err)
	}
	buffer := make([]float32, 2)
	err = sointu.Render(synth, buffer)
	if err == nil {
		t.Fatalf("rendering should have failed due to stack underflow")
	}
}

func TestStackBalancing(t *testing.T) {
	patch := sointu.Patch{
		sointu.Instrument{NumVoices: 1, Units: []sointu.Unit{
			sointu.Unit{Type: "push", Parameters: map[string]int{}},
		}}}
	synth, err := vm.Synth(patch)
	if err != nil {
		t.Fatalf("bridge compile error: %v", err)
	}
	buffer := make([]float32, 2)
	err = sointu.Render(synth, buffer)
	if err == nil {
		t.Fatalf("rendering should have failed due to unbalanced stack push/pop")
	}
}

func TestDivideByZero(t *testing.T) {
	patch := sointu.Patch{sointu.Instrument{NumVoices: 1, Units: []sointu.Unit{
		sointu.Unit{Type: "loadval", Parameters: map[string]int{"value": 128}},
		sointu.Unit{Type: "invgain", Parameters: map[string]int{"invgain": 0}},
		sointu.Unit{Type: "pop", Parameters: map[string]int{}},
	}}}
	synth, err := vm.Synth(patch)
	if err != nil {
		t.Fatalf("bridge compile error: %v", err)
	}
	buffer := make([]float32, 2)
	err = sointu.Render(synth, buffer)
	if err == nil {
		t.Fatalf("rendering should have failed due to divide by zero")
	}
}

func compareToRawFloat32(t *testing.T, buffer []float32, rawname string) {
	_, filename, _, _ := runtime.Caller(0)
	expectedb, err := ioutil.ReadFile(path.Join(path.Dir(filename), "..", "tests", "expected_output", rawname))
	if err != nil {
		t.Fatalf("cannot read expected: %v", err)
	}
	expected := make([]float32, len(expectedb)/4)
	buf := bytes.NewReader(expectedb)
	err = binary.Read(buf, binary.LittleEndian, &expected)
	if err != nil {
		t.Fatalf("error converting expected buffer: %v", err)
	}
	if len(expected) != len(buffer) {
		t.Fatalf("buffer length mismatch, got %v, expected %v", len(buffer), len(expected))
	}
	firsterr := -1
	errs := 0
	for i, v := range expected {
		if math.IsNaN(float64(buffer[i])) || math.Abs(float64(v-buffer[i])) > 1e-2 {
			errs++
			if firsterr == -1 {
				firsterr = i
			}
			if errs > 20 {
				t.Fatalf("more than 20 errors bigger than 1e-2 detected, first at sample position %v", firsterr)
			}
		}
	}
}

func compareToRawInt16(t *testing.T, buffer []int16, rawname string) {
	_, filename, _, _ := runtime.Caller(0)
	expectedb, err := ioutil.ReadFile(path.Join(path.Dir(filename), "..", "tests", "expected_output", rawname))
	if err != nil {
		t.Fatalf("cannot read expected: %v", err)
	}
	expected := make([]int16, len(expectedb)/2)
	buf := bytes.NewReader(expectedb)
	err = binary.Read(buf, binary.LittleEndian, &expected)
	if err != nil {
		t.Fatalf("error converting expected buffer: %v", err)
	}
	if len(expected) != len(buffer) {
		t.Fatalf("buffer length mismatch, got %v, expected %v", len(buffer), len(expected))
	}
	for i, v := range expected {
		if math.IsNaN(float64(buffer[i])) || v != buffer[i] {
			t.Fatalf("error at sample position %v", i)
		}
	}
}

func convertToInt16Buffer(buffer []float32) []int16 {
	int16Buffer := make([]int16, len(buffer))
	for i, v := range buffer {
		int16Buffer[i] = int16(math.Round(math.Min(math.Max(float64(v), -1.0), 1.0) * 32767))
	}
	return int16Buffer
}
