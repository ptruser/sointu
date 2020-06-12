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
    <canvas class="canvas" :class="{collapsed:collapsed}"/>
  </div>
</template>

<script>

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
        this.$store.commit('setOctave', value)
      }
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

canvas {
    width: 100%;
    height: 150px;
    padding: 0;
    margin: 0;
    transition: .5s height ease-in-out;
    background-color: brown;
}

canvas.collapsed {
  height: 0px;
}

</style>
