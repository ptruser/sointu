<template>
<div>

    <p>
        BPM:
    <el-input-number v-model="bpm" :max="300" :min="10"/>
        </p>
         <p>
    RPP:
    <el-input-number v-model="patternLength" :max="255" :min="1"/>
    </p>
    <p>
    HLD:
    <el-input-number v-model="holdNote" :max="255" :min="1"/>
    </p>
    <p>
    Clone patterns:
    <el-switch v-model="clonePatternwhenChanged"/>
    </p> 
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    patternLength: {
      get () {
        return this.$store.state.patternLength
      },
      set (value) {
        this.$store.commit('setPatternLength', value)
      }
    },
    bpm: {
      get () {
        return this.$store.state.bpm
      },
      set (value) {
        this.$store.commit('setBpm', value)
      }
    },
    holdNote: {
      get () {
        return this.$store.state.holdNote
      },
      set (value) {
        this.$store.commit('setHoldNote', value)
      }
    },
    clonePatternwhenChanged: {
      get () {
        return this.$store.state.clonePatternwhenChanged
      },
      set (value) {
        this.$store.commit('setClonePatternwhenChanged', value)
      }
    },
    ...mapState([
      'tracks', 'songLength', 'currentPattern', 'currentRow', 'currentTrack'
    ])
  }
}
</script>

<style scoped>
</style>
