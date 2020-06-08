<template>
  <splitpanes vertical  class="default-theme" style="width: 100%; height: calc(100vh - 10px)">
    <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane><div class="scrolling"><div class="centering"><TrackEditor/></div></div></pane>
        <pane><MainControls/></pane>
      </splitpanes>
    </pane>
     <pane>
       <div id="rowContainer">
        <div id="rowCellLeft">
          <div id="columnContainer">
            <div id="columnCellTop"><PatternEditor/></div>
            <div id="columnCellBottom"><Keyboard/></div>
          </div>
        </div>
        <div id="rowCellRight"><InstrumentEditor/></div>
      </div>
    </pane>
  </splitpanes>
</template>

<script>
import MainControls from './components/MainControls.vue'
import InstrumentEditor from './components/InstrumentEditor.vue'
import TrackEditor from './components/TrackEditor.vue'
import PatternEditor from './components/PatternEditor.vue'
import Keyboard from './components/Keyboard.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import store from './store.js'

export default {
  name: 'App',
  store,
  components: {
    MainControls,
    InstrumentEditor,
    TrackEditor,
    PatternEditor,
    Splitpanes,
    Keyboard,
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

.scrolling {
  overflow: overlay;
  display: flex;
  width: 100%;
  height: 100%;
}

.centering {
 margin: 0 auto;
}

.scrolling::-webkit-scrollbar {
  width: 14px;
}

.scrolling::-webkit-scrollbar-track {
  background:rgba(0, 0.5, 0, 0.5);
}

.scrolling::-webkit-scrollbar-thumb {
  background: #888;
}

.scrolling::-webkit-scrollbar-thumb:hover {
  background: #333;
}

.splitpanes__pane {
  display: flex;
  font-family: Helvetica, Arial, sans-serif;
}

body {
    margin: 0px;
    padding: 5px;
    background-color: #555;
}

#rowContainer {
  display: flex;  
  flex-direction: row;
  height: 100%;
  width: 100%;
  align-items: stretch;
}

#rowCellLeft {
  flex: 1 1 auto;  
}

#rowCellRight {
  flex: 0 0 auto;
}

#columnContainer {
  display: flex;  
  flex-direction: column;
  height: 100%;
  width: 100%;
}

#columnCellTop {
  flex: 1 1 auto;  
}

#columnCellBottom {
  flex: 0 0 auto;  
}

</style>
