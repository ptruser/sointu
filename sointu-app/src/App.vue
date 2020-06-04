<template>
  <div id="app" class="scroll">
    <div class="trackEditor scroll"><TrackEditor/></div>
    <div class="patternEditor">FOOOOOOO</div>
    <div class="instrumentEditor scroll"><InstrumentEditor/></div>
  </div>
</template>

<script>
import Oscillator from './components/Oscillator.vue'
import InstrumentEditor from './components/InstrumentEditor.vue'
import TrackEditor from './components/TrackEditor.vue'
import ElementUI from 'element-ui'
import Vue from 'vue'

Vue.use(ElementUI)

export default {
  name: 'App',
  components: {
    Oscillator,
    InstrumentEditor,
    TrackEditor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
   width: 100%;
     display: flex;
     flex-wrap: wrap;
}

div.trackEditor{
  max-width: 500px;
  height: 0%;
  max-height: 95vh;
    border: solid 1px black;
      overflow: scroll;
}

div.patternEditor{
    width:400px;
     height: 50%;
    border: solid 1px black;
flex-grow: 1;
}

div.instrumentEditor{ width: 20%;
    width:400px;
     height: 80vh;
    border: solid 1px black;
    overflow-y: scroll;
}

.scroll::-webkit-scrollbar {
  width: 14px;
}

.scroll::-webkit-scrollbar-track {
  background:rgba(0, 0, 0, 0);
}

.scroll::-webkit-scrollbar-thumb {
  background: #888;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: #333;
}
</style>
