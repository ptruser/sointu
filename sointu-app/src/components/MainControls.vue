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
    ...mapState([
      'tracks', 'songLength', 'currentPattern', 'currentRow', 'currentTrack'
    ])
  }
}
</script>

<style scoped>
</style>
