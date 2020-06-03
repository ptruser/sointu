<template>
  <div id="app">
    <Slider :ticks="[0,10, 20, 30,128]"/>
    <Slider :ticks="[0,10, 20, 30,128]"/>  
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Slider from './components/Slider.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
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
