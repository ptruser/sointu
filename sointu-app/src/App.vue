<template>
  <div id="app">
    <div class="trackEditor">    <Oscillator/></div>
    <div class="patternEditor">FOOOOOOO</div>
    <div class="instrumentEditor">    <InstrumentEditor/></div>
  </div>
</template>

<script>
import Envelope from './components/Envelope.vue'
import Oscillator from './components/Oscillator.vue'
import InstrumentEditor from './components/InstrumentEditor.vue'
import ElementUI from 'element-ui'
import Vue from 'vue'


Vue.use(ElementUI)

export default {
  name: 'App',
  components: {
    Oscillator,
    InstrumentEditor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
   width: 100%;  
}

div.trackEditor{ 
  width: 30%;
     height: 100%;
     min-height: 600px;
    border: solid 1px black;
        float:left;
}

div.patternEditor{
    min-width:200px;
     height: 100%;
    border: solid 1px black;
    float:left;
}

div.instrumentEditor{ width: 10%; 
    width:400px;
     height: 80vh;
    border: solid 1px black;
    float:left;
    overflow-y: scroll;  
}
</style>
