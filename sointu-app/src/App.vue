<template>
  <div id="app">
    <Envelope/>
    <Oscillator/> 
  </div>
</template>

<script>
import Envelope from './components/Envelope.vue'
import Oscillator from './components/Oscillator.vue'

export default {
  name: 'App',
  components: {
    Envelope,
    Oscillator
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
  margin-top: 60px;
}
</style>
