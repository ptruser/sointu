<template>
<div id="main">
    <div id="titleContainer">
      <div class="titleElement paneTitle">Pattern editor</div>
      <div class="titleElement">
        <el-tooltip content="Add parallel track. Shortcut: ctrl-T" :open-delay="1000" placement="top">
          <i class="icon el-icon-document-add" @click.stop="$store.commit('addTrack')"/>
        </el-tooltip>
      </div>
      <div class="titleElement">
        <template>
        <el-popconfirm
          confirmButtonText='OK'
          cancelButtonText='No'
          icon="el-icon-info"
          iconColor="red"
          title="Are you sure to delete this track?"
          :disabled="tracks.length <= 1"
          @onConfirm="$store.commit('deleteTrack')"
        >
          <i slot="reference" class="icon el-icon-delete"/>
        </el-popconfirm>
        </template>
      </div>
      <div class="titleElement">
        BPM:<el-input-number class="input" size="mini" v-model="bpm" :max="300" :min="10" controls-position="right"/>
      </div>
      <div class="titleElement">
        RPP:<el-input-number class="input" size="mini" v-model="rpp" :max="300" :min="10"/>
      </div>
       <div class="titleElement">
        LPB:<el-input-number class="input" size="mini" v-model="lpp" :max="16" :min="2"/>
      </div>
    </div>

    <div id="instrumentTabs">
      <div>Instruments</div>
      <div v-for="(item, index) in instruments" :key="index" :style="{width: instrumentwidths[index]*30+'px'}">
        {{item.name}}
      </div>
    </div>

    <table tabindex="2" @keydown="keydown">
        <thead>
            <draggable v-model="tracks" tag="tr">
                <th class="cell" :key="-1">
                   #
                </th>
                <th class="cell" :colspan="item.voices"  v-for="(item, index) in tracks" :key="index" scope="col">
                {{ item.sequence[currentPattern] }}
                </th>
            </draggable>
        </thead>

        <tr v-for="row in Array(patternLength).keys()" :key="row">
            <td class="rownumber">{{row}}</td>
            <td class="cell"
                ref="notecell"
                v-for="(item, index) in tracks"
                :colspan="item.voices"
                :class="{active:row==currentRow && index==currentTrack,unique: !$store.getters.isPatternUnique(item.sequence[currentPattern])}"
                :key="index"
                @mousedown="mousedown(row,index)"
            >
              {{
                getNote(patterns[item.sequence[currentPattern]][row])
              }}
            </td>
        </tr>
    </table>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import mod from '../helpers'

const KEYMAP = {
  90: 60, // z = C-4
  83: 61, // s = C#4
  88: 62, // x = D-4
  68: 63, // d = D#4
  67: 64, // c = E-4
  86: 65, // v = F-4
  71: 66, // g = F#4
  66: 67, // b = G-4
  72: 68, // h = G#4
  78: 69, // n = A-4
  74: 70, // j = A#4
  77: 71, // m = B-4
  188: 72, // , = C-5
  76: 73, // l = C#5
  190: 74, // . = D-5
  192: 75, // ö/semicolon = D#5
  189: 78, // - = E#5
  81: 72, // q = C-5
  50: 73, // 2 = C#5
  87: 74, // w = D-5
  51: 75, // 3 = D#5
  69: 76, // e = E-5
  82: 77, // r = F-5
  53: 78, // 5 = F#5
  84: 79, // t = G-5
  54: 80, // 6 = G#5
  89: 81, // y = A-5
  55: 82, // 7 = A#5
  85: 83, // u = B-5
  73: 84, // i = C-6
  57: 85, // 9 = C#6
  79: 86, // o = D-6
  48: 87, // 0 = D#6
  80: 88, // p = E-6
  221: 89, // å = F-6
  219: 90, // ` = F#6
  186: 91 // ¨ = G-6
}

const NOTES_IN_OCTAVE = ['C-', 'C#', 'D-', 'D#', 'E-', 'E#', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-']

export default {
  computed: {
    instrumentwidths: function() {
      var ret = []
      var track = 0
      var voice = 0
      var base = 0
      return this.instruments.map(instrument => {
        voice += instrument.voices
        while (track < this.tracks.length && voice > this.tracks[track].voices) {
          voice -= this.tracks[track].voices          
          track++
        }
        var diff = track < this.tracks.length ? track + voice / this.tracks[track].voices - base : 1
        base += diff
        return diff
      })
    },
    ...mapState([
      'tracks', 'songLength', 'currentPattern', 'patternLength', 'currentRow', 'currentTrack', 'patterns', 'holdNote', 'instruments'
    ])
  },
  components: {
    draggable
  },
  watch: {
    currentRow: function (newRow) { this.scrollIntoView(newRow, this.currentTrack) },
    currentTrack: function (newTrack) { this.scrollIntoView(this.currentRow, newTrack) }
  },
  methods: {
    getNote (noteNumber) {
      if (noteNumber > this.holdNote) {
        const relNote = noteNumber - 72 // relative to 72 = C-5
        const relOctave = Math.floor(relNote / 12)
        const note = NOTES_IN_OCTAVE[mod(relNote, 12)]
        return note + (relOctave + 5)
      } else if (noteNumber === this.holdNote) {
        return ' '
      } else {
        return '---'
      }
    },
    mousedown (row, col) {
      this.$store.commit('setCurrentRow', row)
      this.$store.commit('setCurrentTrack', col)
    },
    scrollIntoView (row, col) {
      /* const el = this.$refs.notecell[col + row * this.tracks.length]
      const div = this.$refs.patternPane
      const m = 50
      const newTop = Math.min(Math.max(div.scrollTop, el.offsetTop + el.offsetHeight - div.offsetHeight), el.offsetTop)
      div.scrollTop = newTop
      const newLeft = Math.min(Math.max(div.scrollLeft, el.offsetLeft + el.offsetHeight - div.offsetWidth), el.offsetLeft)
      div.scrollLeft = newLeft */
    },
    keydown (event) {
      if (event.ctrlKey) {
        if (event.keyCode == 37) {
          this.$store.commit('setCurrentTrack', 0)
        } else if (event.keyCode == 39) {
          this.$store.commit('setCurrentTrack', this.tracks.length - 1)
        } else if (event.keyCode == 38) {
          this.$store.commit('setCurrentRow', 0)
        } else if (event.keyCode == 40) {
          this.$store.commit('setCurrentRow', this.patternLength - 1)
        } else {
          return
        }
      } else {
        if (event.keyCode == 37) {
          this.$store.commit('setCurrentTrack', this.currentTrack - 1)
        } else if (event.keyCode == 39) {
          this.$store.commit('setCurrentTrack', this.currentTrack + 1)
        } else if (event.keyCode == 38) {
          this.$store.commit('setCurrentRow', this.currentRow - 1)
        } else if (event.keyCode == 40) {
          this.$store.commit('setCurrentRow', this.currentRow + 1)
        } else if (KEYMAP[event.keyCode] !== undefined) {
          this.$store.commit('setNote', KEYMAP[event.keyCode])
        } else if (event.keyCode == 46) {
          this.$store.commit('setNote', this.$store.state.holdNote)
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

#main {
  width: 100%;
  height: 100%;
}

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
  border: 1px;
}

td,
th {
  padding: 0px 2px;
     font: monospace;
  font-size: 10pt;
  min-width: 30px;
  max-width: 30px;
 border: 1px solid black;
}

td.unique {
  background-color: blueviolet;
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

.instrumentLabel {
  font-size: 6pt;
}

#instrumentTabs {
  display: flex;
  flex-direction: row;
    width: 100%;
}

#instrumentTabs > div {
    flex: 0 0 auto;
    overflow-x: hidden;
    overflow-y: hidden; 
    white-space: nowrap;
    font-size: 10px;
}

#instrumentTabs > :first-child {
  width: 30px;
}

#titleContainer {
    white-space: nowrap;
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}

#titleContainer > :nth-child(1) {
  margin: 5px;
  margin-right: 20px;
}

div.titleElement {
    display: inline-block;
    vertical-align: middle;
    white-space: normal;
    margin-top: auto;
    margin-bottom: auto;
}

.input {
  width: 90px;
}

</style>
