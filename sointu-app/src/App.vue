<template>
  <splitpanes vertical  class="default-theme" style="width: 100%; height: calc(100vh - 10px)">
    <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane><div class="scrolling"><div class="centering"><TrackEditor/></div></div></pane>
        <pane><div class="scrolling"><div class="centering">1</div></div></pane>
      </splitpanes>
    </pane>
     <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane><PatternEditor/></pane>
        <pane><div class="scrolling"><div class="centering">Keyboard</div></div></pane>
      </splitpanes>
    </pane>
     <pane>
      <splitpanes horizontal  class="default-theme" style="height: 100vh - 10px">
        <pane><div class="scrolling"><div class="centering"><InstrumentEditor/></div></div></pane>
        <pane><div class="scrolling"><div class="centering"></div></div></pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<script>
import InstrumentEditor from './components/InstrumentEditor.vue'
import TrackEditor from './components/TrackEditor.vue'
import PatternEditor from './components/PatternEditor.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import store from './store.js'

export default {
  name: 'App',
  store,
  components: {
    InstrumentEditor,
    TrackEditor,
    PatternEditor,
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

.scrolling {
  overflow: overlay;
  display: flex; 
  width: 100%;
  height: 100%;
}

.centering {
 margin: auto;
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
  color: rgba(255, 255, 255, 0.6);
}

body {
    margin: 0px;
    padding: 5px;
    background-color: #555;
}



</style>
