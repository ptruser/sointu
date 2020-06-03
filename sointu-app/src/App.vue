<template>
  <div id="app">
    <Slider :ticks="[0,4, 16,28,40,52, 64, 76, 88, 100, 112, 124, 128]" :convert="x=>x-64" :largeStep="12"/>
    <Slider/>
  </div>
</template>

<script>
import Slider from './components/Slider.vue'

export default {
  name: 'App',
  components: {
    Slider
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
