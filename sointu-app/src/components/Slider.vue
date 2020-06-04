<template>
    <div class="container">
        <canvas class="sliderCanvas" ref="sliderCanvas" tabindex="1" @mousedown="mousedown" @keydown="keydown"></canvas>
        <div class="value">{{value}}</div>
        <div class="convertedValue" v-if="convert">{{convert(value)}}</div>
    </div>
</template>

<script>
function getPixelRatio (context) {
  const dpr = window.devicePixelRatio || 1
  const bsr = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1

  return dpr / bsr
}

export default {
  name: 'Slider',
  props: {
    ticks: { type: Array, default: () => [0, 16, 32, 48, 64, 80, 96, 112, 128] },
    max: { type: Number, default: 128 },
    min: { type: Number, default: 0 },
    largeStep: { type: Number, default: 16 },
    convert: { type: Function, default: undefined }
  },
  data: function () {
    return {
      dragging: false,
      message: 'Slider',
      vueCanvas: null,
      value: 64
    }
  },
  watch: {
    value: {
      handler () { this.refresh() }
    }
  },
  computed: {
    range: function () {
      return this.max - this.min
    }
  },
  mounted () {
    window.addEventListener('mousemove', this.mousemove)
    window.addEventListener('mouseup', this.mouseup)
    window.addEventListener('resize', this.refresh)
    this.refresh()
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mousemove)
    window.removeEventListener('mouseup', this.mouseup)
    window.removeEventListener('resize', this.refresh)
  },
  methods: {
    setValue (newValue) {
      this.value = Math.min(Math.max(Math.round(newValue), this.min), this.max)
    },
    keydown (event) {
      var dir
      if (event.keyCode === 37) { dir = -1 } else if (event.keyCode === 39) { dir = 1 } else { return }
      if (event.ctrlKey) { dir *= this.largeStep }
      var newVal = this.value + dir
      if (event.shiftKey) {
        const nextTicks = this.ticks.filter(x => (x - this.value) * dir > 0)
        const nextTick = dir > 0 ? Math.min.apply(Math, nextTicks) : Math.max.apply(Math, nextTicks)
        if (nextTick !== undefined) { newVal = nextTick }
      }
      this.setValue(newVal)
    },
    mousedown (event) {
      this.dragging = true
    },
    mousemove (event) {
      if (this.dragging) {
        const rect = this.$refs.sliderCanvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const val = x / rect.width * this.range + this.min
        this.setValue(val)
      }
    },
    mouseup (event) {
      this.dragging = false
    },

    refresh () {
      const canvas = this.$refs.sliderCanvas
      var ctx = this.$refs.sliderCanvas.getContext('2d')
      const pixelRatio = getPixelRatio(ctx)

      // get current size of the canvas
      const rect = canvas.getBoundingClientRect()

      // increase the actual size of our canvas
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio

      // scale everything down using CSS
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      ctx.save()
      ctx.scale(pixelRatio, pixelRatio)
      ctx.clearRect(0, 0, 263, 12)

      var grd = ctx.createLinearGradient(3, 0, 259, 0)
      grd.addColorStop(0, 'blue')
      grd.addColorStop(0.5, 'green')
      grd.addColorStop(1, 'red')

      ctx.beginPath()
      ctx.moveTo(3, 12)
      ctx.lineTo(259, 0)
      ctx.lineTo(259, 12)
      ctx.closePath()
      ctx.fillStyle = grd
      ctx.fill()

      ctx.restore()

      ctx.beginPath()
      const lineWidth2 = Math.round(pixelRatio)
      ctx.lineWidth = lineWidth2
      this.ticks.forEach((t, i) => {
        const x = Math.round(((t - this.min) / this.range * 256 + 3) * pixelRatio) + ((lineWidth2 % 2 === 0) ? pixelRatio / 2 : 0)
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
      })
      ctx.stroke()

      ctx.beginPath()
      const lineWidth = Math.round(pixelRatio)
      ctx.lineWidth = lineWidth
      const rx = Math.round(((this.value - this.min) / this.range * 256) * pixelRatio)
      ctx.rect(rx + lineWidth / 2, lineWidth / 2, Math.ceil(7 * pixelRatio), Math.ceil(11 * pixelRatio))
      ctx.fillStyle = 'white'
      ctx.fill()

      ctx.stroke()
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
  width: 400px;
  height: 12px;
  padding: 3px;
}

div {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
}

canvas {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 263px;
  height: 12px;
  padding: 0;
  margin: 0;
}

canvas:focus {
  background-color:blueviolet;
  outline: none;
}

.convertedValue {
   position: absolute;
  top: 0px;
  left: 290px;
  color: blue;
}

.value {
   position: absolute;
  top: 0px;
  left: 263px;
  padding: 0;
}
</style>
