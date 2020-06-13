<template>
<div id="main">
  <splitpanes vertical class="default-theme" style="width: 100%; height: calc(100vh - 10px)">
    <pane size="20">
      <div class="scrolling"><div class="centering"><TrackEditor/></div></div>
    </pane>
     <pane  size="90">
       <div id="mainContainer">
        <div>
          <div class="scrolling"><PatternEditor/></div>
          <div><Keyboard/></div>
        </div>
        <div class="scrolling"><InstrumentEditor/></div>
      </div>
    </pane>
  </splitpanes>
  </div>
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

// import 'element-ui/lib/theme-chalk/icon.css'
// import 'element-ui/lib/theme-chalk/input.css'
// import 'element-ui/lib/theme-chalk/input-number.css'
// import 'element-ui/lib/theme-chalk/popconfirm.css'
// import 'element-ui/lib/theme-chalk/popover.css'
// import 'element-ui/lib/theme-chalk/collapse-item.css'
// import 'element-ui/lib/theme-chalk/tooltip.css'

import 'element-ui/lib/theme-chalk/index.css'

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
* {
  box-sizing: border-box;
}

#main {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
   width: 100%;
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

.splitpanes.default-theme .splitpanes__splitter {
  background-color: #333;
}

body {
    margin: 0px;
    padding: 5px;
    background-color: #333;
}

#mainContainer {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  align-items: stretch;
}

#mainContainer > :nth-child(2) {
  flex: 0 0 auto;
  overflow-y: overlay;
  overflow-x: hidden;
}

#mainContainer > :first-child {
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  display: flex;
}

#mainContainer > :first-child > :first-child {
  overflow: overlay;
  flex: 1 1 auto;
}

#mainContainer > :first-child > :nth-child(2) {
  overflow: hidden;
  flex: 0 0 auto;
}

.icon {
  font-size: 30pt;
  color: #999;
}

.icon:hover {
  color: #fff;
}

.paneTitle {
  color: #999;
  font-size: 14pt;
  user-select: none;
}

.collapseIcon {
  transition: .5s transform ease-in-out;
}

.collapseIcon.collapsed {
  transform: rotate(-90deg);
}

.sidePane {
  background-color: #222;
}

</style>
