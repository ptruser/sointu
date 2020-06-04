<template>
    <table>
        <tr>
            <td>Attack</td>
            <td><Slider :convert="convertAttack"/></td>
        </tr>
        <tr>
            <td>Decay</td>
            <td><Slider ref="decay"/></td>
        </tr>
        <tr>
            <td>Sustain</td>
            <td><Slider ref="sustain" :convert="x=>Math.round(x/128*1000)/1000"/></td>
        </tr>
        <tr>
            <td>Release</td>
            <td><Slider/></td>
        </tr>
        <tr>
            <td>Gain</td>
            <td><Slider :convert="x=>Math.round(x/128*1000)/1000"/></td>
        </tr>
    </table>
</template>

<script>
import Slider from './Slider.vue'

export default {
  name: 'Envelope',
  components: {
    Slider
  },
  methods: {
    convertAttack (value) {
      return this.toUnits(1 / 2 ** (-24 * value / 128) / 44100)
    },
    toUnits (value) {
      if (value > 1) { return Number(value.toPrecision(3)) + ' s' } else if (value > 0.001) { return Number((value * 1e3).toPrecision(3)) + ' ms' } else { return Number((value * 1e6).toPrecision(3)) + ' us' }
    }
  }
}
</script>

<style scoped>
</style>
