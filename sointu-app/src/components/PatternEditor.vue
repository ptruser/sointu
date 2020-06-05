<template>
<div class="scrolling" ref="patternPane"><div class="centering">
    <table tabindex="2" @keydown="keydown">
        <thead>
            <draggable v-model="tracks" tag="tr">
                <th class="cell" :key="-1">
                   #
                </th>
                <th class="cell" v-for="(item, index) in tracks" :key="index" scope="col">
                {{ index }}
                </th>
                <th class="cell" :key="124125">
                    <button @click="$store.commit('addTrack')">Add</button>
                 </th>
            </draggable>
        </thead>
        <tr v-for="row in Array(patternLength).keys()" :key="row">
            <td class="rownumber">{{row}}</td>
            <td class="cell" ref="notecell" v-for="(item, index) in tracks" :class="{active:row==currentRow && index==currentTrack}"  :key="index" @mousedown="mousedown(row,index)">{{item[row]}}</td>
        </tr>
    </table>
    </div></div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'tracks', 'songLength', 'currentPattern', 'patternLength', 'currentRow', 'currentTrack'
  ]),
  components: {
    draggable
  },
  watch: {
    currentRow: function (newRow) { this.scrollIntoView(newRow, this.currentTrack) },
    currentTrack: function (newTrack) { this.scrollIntoView(this.currentRow, newTrack) }
  },
  methods: {
    mousedown (row, col) {
      this.$store.commit('setCurrentRow', row)
      this.$store.commit('setCurrentTrack', col)
    },
    scrollIntoView (row, col) {
      const el = this.$refs.notecell[col + row * this.tracks.length]
      const div = this.$refs.patternPane
      const m = 50
      const newTop = Math.min(Math.max(div.scrollTop, el.offsetTop + el.offsetHeight - div.offsetHeight), el.offsetTop)
      div.scrollTop = newTop
      const newLeft = Math.min(Math.max(div.scrollLeft, el.offsetLeft + el.offsetHeight - div.offsetWidth), el.offsetLeft)
      div.scrollLeft = newLeft
    },
    keydown (event) {
      if (event.ctrlKey) {
        if (event.keyCode == 37) { this.$store.commit('setCurrentTrack', 0) } else if (event.keyCode == 39) { this.$store.commit('setCurrentTrack', this.tracks.length - 1) } else if (event.keyCode == 38) { this.$store.commit('setCurrentRow', 0) } else if (event.keyCode == 40) { this.$store.commit('setCurrentRow', this.patternLength - 1) } else { return }
      } else {
        if (event.keyCode == 37) { this.$store.commit('setCurrentTrack', this.currentTrack - 1) } else if (event.keyCode == 39) { this.$store.commit('setCurrentTrack', this.currentTrack + 1) } else if (event.keyCode == 38) { this.$store.commit('setCurrentRow', this.currentRow - 1) } else if (event.keyCode == 40) { this.$store.commit('setCurrentRow', this.currentRow + 1) } else { return }
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
}

.active {
border: 1px solid black;
}

td,
th {
  padding: 0.5em;
}
.rownumber {
    background-color: #AAA;
}

.cell {
    background-color: #888;
}
</style>
