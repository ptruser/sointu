<template>
  <div id="container">
    <div class="alignCenter" @click="collapsed=!collapsed">
      <div class="alignMiddle">
        <el-tooltip content="Decrease octave. Shortcut: <" open-delay="1000" placement="top">
          <i class="el-icon-caret-left" @click.stop="octave--"/>
        </el-tooltip>
      </div>
      <div class="alignMiddle" style="width: 70px">Octave: {{octave}}</div>
      <div class="alignMiddle">
        <el-tooltip content="Increase octave. Shortcut: >" open-delay="1000" placement="top">
          <i class="el-icon-caret-right" @click.stop="octave++"/>
        </el-tooltip>
      </div>
      <div class="alignMiddle"><i class="el-icon-"/></div>
    </div>
    <canvas class="canvas" :class="{collapsed:collapsed}"/>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'

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

}

div.alignMiddle {
    float: left;
    margin-top: auto;
    margin-bottom: auto;
}

div.alignCenter {
    margin-left: auto;
    margin-right: auto;
    background-color: cornflowerblue;
}

canvas {
    width: 100%;
    height: 150px;
    padding: 0;
    margin: 0;
    transition: .3s height ease-in-out;
    background-color: brown;
}

canvas.collapsed {
  height: 0px;
}

</style>
