<template>
    <table>
        <tr>
            <td>Waveform</td>
            <td><Slider :convert="convertAttack"/></td>
        </tr>
        <tr>
            <td>Transpose</td>
            <td><Slider :ticks="[0,52,64,76,128]"/></td>
        </tr>
        <tr>
            <td>Detune</td>
            <td><Slider/></td>
        </tr>    
        <tr>
            <td>Phase</td>
            <td><Slider/></td>
        </tr>
        <tr>
            <td>Color</td>
            <td><Slider/></td>
        </tr>   
        <tr>
            <td>Gain</td>
            <td><Slider/></td>
        </tr>    
        <tr>
            <td>Unison</td>
            <td>Fooo</td>
        </tr>                     
    </table>
</template>

<script>
import Slider from './Slider.vue'

export default {
  name: 'Oscillator',
  components: {
    Slider
  }
}
</script>

<style scoped>
</style>
