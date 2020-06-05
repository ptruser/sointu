<template>
  <splitpanes vertical  class="default-theme" style="width: 100%; height: calc(100vh - 10px)">
    <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane class="innerpane"><TrackEditor/></pane>
        <pane class="innerpane">1</pane>
      </splitpanes>
    </pane>
     <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane class="innerpane">PatternEditor</pane>
        <pane class="innerpane">Keyboard</pane>
      </splitpanes>
    </pane>
     <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane class="innerpane"><div class="centering"><InstrumentEditor/></div></pane>
        <pane class="innerpane"></pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<script>
import InstrumentEditor from './components/InstrumentEditor.vue'
import TrackEditor from './components/TrackEditor.vue'
import ElementUI from 'element-ui'
import Vue from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

Vue.use(ElementUI)

export default {
  name: 'App',
  components: {
    InstrumentEditor,
    TrackEditor,
    Splitpanes,
    Pane
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

.innerpane {
  overflow: overlay;
     box-sizing: padding-box; 
}

.innerpane::-webkit-scrollbar {
  width: 14px;
}

.innerpane::-webkit-scrollbar-track {
  background:rgba(0, 0.5, 0, 0.5);
}

.innerpane::-webkit-scrollbar-thumb {
  background: #888;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: #333;
}

.splitpanes__pane {
  display: flex;
  font-family: Helvetica, Arial, sans-serif;
  color: rgba(255, 255, 255, 0.6);
}

body {
    margin: 0px;
    padding: 5px;
    background-color: #555;
}

.centering {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;  
}

</style>
