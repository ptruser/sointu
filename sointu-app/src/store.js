import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const DEFAULT_INSTRUMENT = {
  voices: 1,
  patch: [{ type: 'envelope', stereo: false, attack: 64, decay: 64, sustain: 64, release: 64, gain: 128 },
    { type: 'oscillator', stereo: false, transpose: 64, detune: 64, phase: 0, color: 128, shape: 64, gain: 128 },
    { type: 'mulp', stereo: false },
    { type: 'pan', stereo: false, panning: 64 },
    { type: 'out', stereo: true, gain: 64 }]
}

function mod (n, m) { // ensures only positive values
  return ((n % m) + m) % m
}

export default new Vuex.Store({
  state: {
    patterns: [new Array(16).fill(0)],
    tracks: [{ voices: 1, sequence: [0] }],
    instruments: [_.cloneDeep(DEFAULT_INSTRUMENT)],
    songLength: 1,
    patternLength: 16,
    currentPattern: 0,
    currentRow: 0,
    currentTrack: 0
  },
  mutations: {
    addInstrument (state) {
      state.instruments.push(_.cloneDeep(DEFAULT_INSTRUMENT))
    },
    addTrack (state) {
      state.tracks.push({ voices: 1, sequence: [0] })
    },
    setCurrentRow (state, newRow) {
      state.currentRow = mod(newRow, state.patternLength)
    },
    setCurrentTrack (state, newTrack) {
      state.currentTrack = mod(newTrack, state.tracks.length)
    }
  },
  strict: debug
})
