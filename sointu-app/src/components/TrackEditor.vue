<template>
<div>
    <table tabindex="1" @keydown="keydown">
        <thead>

<draggable v-model="tracks" tag="tr">
             <th class="cell" :key="-1">
              #
            </th>
            <th class="cell" v-for="(item, index) in tracks" :key="index" scope="col">
              {{ index }}
              V:{{item.voices}}
            </th>
</draggable>
        </thead>
        <tr v-for="row in Array(songLength).keys()" :key="row">
            <td class="rownumber">{{row}}</td>
            <td class="cell" 
                :class="{active:row==currentPattern && index==currentTrack}" 
                v-for="(item, index) in tracks"
                :key="index"
            >{{patternToString(item.sequence[row])}}</td>
        </tr>
    </table>
    <button @click="$store.commit('setSongLength',songLength+1)">Add</button>
</div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'tracks', 'songLength', 'currentPattern','currentTrack'
  ]),
  components: {
    draggable
  },
  methods: {
    patternToString(patternNumber) {
      if (patternNumber <= 9) {
        return String(patternNumber)
      } else if (patternNumber <= 35) {
        return String.fromCharCode(patternNumber + 55) // 65 = A, 90 = Z
      } else {
        const higher = patternToString(Math.floor(patternNumber / 36))
        const lower = patternToString(patternNumber % 36)
        return higher + lower
      }
    },
    keydown (event) {
      if (event.ctrlKey) {
        if (event.keyCode == 37) {
          this.$store.commit('setCurrentTrack', 0)
        } else if (event.keyCode == 39) {
          this.$store.commit('setCurrentTrack', this.tracks.length - 1)
        } else if (event.keyCode == 38) {
          this.$store.commit('setCurrentPattern', 0)
        } else if (event.keyCode == 40) {
          this.$store.commit('setCurrentPattern', this.songLength - 1)
        } else {
          return
        }
      } else {
        if (event.keyCode == 37) {
          this.$store.commit('setCurrentTrack', this.currentTrack - 1)
        } else if (event.keyCode == 39) {
          this.$store.commit('setCurrentTrack', this.currentTrack + 1)
        } else if (event.keyCode == 38) {
          this.$store.commit('setCurrentPattern', this.currentPattern - 1)
        } else if (event.keyCode == 40) {
          this.$store.commit('setCurrentPattern', this.currentPattern + 1)
        } else if (event.keyCode >= 48 && event.keyCode <= 57) { // 48 = 0, 49 = 1, ..., 57 = 9
          this.$store.commit('setPattern',event.keyCode - 48)
        } else if (event.keyCode >= 65 && event.keyCode <= 90) { // 65 = A, 66 = B, ..., 90 = Z
          this.$store.commit('setPattern',event.keyCode - 55) // A = 10
        } else {
          return
        }
      }
      event.preventDefault()
    }
  }
}
</script>

<style scoped>

thead th {
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  top: 0;
}

thead th:first-child {
  left: 0;
  z-index: 2;
}

tr td:first-child {
      position: -webkit-sticky; /* for Safari */
  position: sticky;
  left: 0;
  z-index: 1;
}

thead th {
  background: #000;
  color: #FFF;
}

tbody td {
  background: #FFF;
  border-right: 1px solid #CCC;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
}

td,
th {
  padding: 0.5em;
  font: "DejaVu Sans Mono",monospace;
  font-size: 10pt;
}

td.active {
  background: #FFF;
}

.rownumber {
    background-color: #AAA;
}

.cell {
    background-color: #888;
}
</style>
