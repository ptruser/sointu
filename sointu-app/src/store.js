import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import mod from './helpers'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const DEFAULT_INSTRUMENT = {
  voices: 3,
  name: 'Default Instrument',
  patch: [{ type: 'envelope', stereo: false, attack: 64, decay: 64, sustain: 64, release: 64, gain: 128 },
    { type: 'oscillator', stereo: false, transpose: 64, detune: 64, phase: 0, color: 128, shape: 64, gain: 128 },
    { type: 'mulp', stereo: false },
    { type: 'pan', stereo: false, panning: 64 },
    { type: 'out', stereo: true, gain: 64 }]
}

function isPatternUnique(state,pattern) {
  const flatTracks = state.tracks.map(x => x.sequence).flat()
  const counts = _.countBy(flatTracks)
  return counts[pattern] === 1
}

function firstFreePattern(state) {
  const arrmax = x => Math.max(...x)
  const max = arrmax(state.tracks.map(x => arrmax(x.sequence)))
  return max + 1
}

export default new Vuex.Store({
  state: {
    patterns: [new Array(16).fill(0)],
    tracks: [{ voices: 2, sequence: [0] }],
    instruments: [_.cloneDeep(DEFAULT_INSTRUMENT), _.cloneDeep(DEFAULT_INSTRUMENT)],
    songLength: 1,
    patternLength: 16,
    currentPattern: 0,
    currentRow: 0,
    currentTrack: 0,
    clonePatternwhenChanged: false,
    holdNote: 1,
    bpm: 120
  },
  mutations: {
    addInstrument (state) {
      state.instruments.push(_.cloneDeep(DEFAULT_INSTRUMENT))
    },
    addTrack (state) {
      state.tracks.push({ voices: 1, sequence: new Array(state.songLength).fill(0) })
    },
    setNote (state, note) {
      const seq = state.tracks[state.currentTrack].sequence
      const oldPtrn = seq[state.currentPattern]
      if (state.clonePatternwhenChanged && !isPatternUnique(state,oldPtrn)) {
        const newPtrn = firstFreePattern(state)
        Vue.set(seq, state.currentPattern, newPtrn)
        Vue.set(state.patterns, newPtrn, _.cloneDeep(state.patterns[oldPtrn]))
      }
      Vue.set(state.patterns[seq[state.currentPattern]],state.currentRow,note)
    },
    setCurrentRow (state, newRow) {
      state.currentRow = mod(newRow, state.patternLength)
    },
    setCurrentTrack (state, newTrack) {
      state.currentTrack = mod(newTrack, state.tracks.length)
    },
    setPatternLength (state, patternLength) {
      state.patternLength = patternLength
    },
    setClonePatternwhenChanged (state, value) {
      state.clonePatternwhenChanged = value
    },
    setHoldNote (state, holdNote) {
      state.holdNote = holdNote
    },
    setBpm (state, bpm) {
      state.bpm = bpm
    },
    setSongLength(state,value) {
      state.songLength = value
      state.tracks.forEach(x => {
        const seq = x.sequence
        if (seq.length < value) {
          const lastval = seq[seq.length-1]
          for(let j = seq.length;j < value;j++) {
            seq.push(lastval)   
          }
        }
      })
    }
  },
  strict: debug
})