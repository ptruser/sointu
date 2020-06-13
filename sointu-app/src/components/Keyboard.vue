<template>
  <div id="container" class="sidePane">
    <div id="titleContainer" @click="collapsed=!collapsed">
       <div class="titleElement paneTitle">Keyboard</div>        
      <div class="titleElement">
        <el-tooltip content="Decrease octave. Shortcut: <" :open-delay="1000" placement="top">
          <i class="icon el-icon-caret-left" @click.stop="octave--"/>
        </el-tooltip>
      </div>
      <div class="titleElement paneTitle">Octave: {{octave}}</div>
      <div class="titleElement">
        <el-tooltip content="Increase octave. Shortcut: >" :open-delay="1000" placement="top">
          <i class="icon el-icon-caret-right" @click.stop="octave++"/>
        </el-tooltip>
      </div>      
      <div class="titleElement">
        <el-tooltip content="Collapse" :open-delay="1000" placement="top">
          <i :class="{collapsed:collapsed}" class="collapseIcon icon el-icon-arrow-down"/>
        </el-tooltip>
      </div>      
    </div>
    <div id="keyboardFrame" :class="{collapsed:collapsed}">
      <div id="keyboard" :style="`left: ${keyboardPosition}px`">
        <div
          v-for="(key,index) in keys"
          class="key"
          :class="{black: key.black, white: !key.black}"
          :key="index"
          :style="`left: ${key.left}px; top: 0px; width: ${key.width}px; height: ${key.height}px`"
        >{{key.label}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import mod from '../helpers'

const octaveKeys = [
  { left: 0, width: 40, height: 150, black: false }, // C
  { left: 25, width: 23, height: 100, black: true }, // C#
  { left: 40, width: 40, height: 150, black: false }, // D
  { left: 72, width: 23, height: 100, black: true }, // D#  
  { left: 80, width: 40, height: 150, black: false }, // E
  { left: 120, width: 40, height: 150, black: false }, // F
  { left: 143, width: 23, height: 100, black: true }, // F#    
  { left: 160, width: 40, height: 150, black: false }, // G
  { left: 188.5, width: 23, height: 100, black: true }, // F#    
  { left: 200, width: 40, height: 150, black: false }, // A
  { left: 234, width: 23, height: 100, black: true }, // F#      
  { left: 240, width: 40, height: 150, black: false }, // B
]

const keyboardShortCuts = ['Z','S','X','D','C','V','G','B','H','N','J','M','Q','2','W','3','E','R','5','T','6','Y','7','U','I','9','O','0','P']

export default {
  name: 'Keyboard',
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
    octave: {
      get () {
        return this.$store.state.octave
      },
      set (value) {
        value = Math.min(Math.max(value,0),20)
        this.$store.commit('setOctave', value)
      }
    },
    keyboardPosition: function() {
      return -(this.$store.state.octave-1)*280
    },
    keys: function() {
      return _.range(this.$store.state.holdNote+1,256).map(x => {
        const relKeyNo = mod(x,12)
        const octave = Math.floor((x-72)/12)+5 // 72 = middle C = C5
        const key = _.clone(octaveKeys[relKeyNo])
        key.left += octave*280
        const hint = keyboardShortCuts[(x-60)-(this.$store.state.octave-5)*12]
        key.label = (hint ? hint : '') + (relKeyNo == 0 ? 'C'+octave : '')
        return key
      })
    }
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  min-width: 320px;        
}

div.titleElement {
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
  margin-top: auto;
  margin-bottom: auto;
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

#titleContainer > :nth-child(5) {
  float: right;
}

#keyboardFrame {
  width: 100%;
  height: 150px;
  position: relative;
  padding: 0;
  margin: 0;
  transition: .5s height ease-in-out;
  background-color: ;
}

#keyboardFrame.collapsed {
  height: 0px;
}

#keyboard {
  position: absolute;
  transition: .5s left ease-in-out;
}

.key {
  position: absolute;
  border: 1px none black; 
  border-style: solid;  
  background-color: #fff;  
  text-align: center;
}

.key.white {
  padding-top: 130px;
}

.key.black {
  background-color: #111;
  z-index: 2;
}

</style>
