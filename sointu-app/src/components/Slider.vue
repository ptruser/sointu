<template>
    <div class="container">
        <canvas ref="labelCanvas" width="263" height="12"/>
        <canvas ref="sliderCanvas" width="263" height="12" tabindex="1" @mousedown="mousedown"/>
        <div class="two">{{value}}</div>
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
    ticks: Array,
    max: { type: Number, default: 128 },
    min: { type: Number, default: 0 }
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
      handler: function (n, o) { this.refresh() }
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
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mousemove)
    window.removeEventListener('mouseup', this.mouseup)
  },
  methods: {
    addWidth () {
      this.value += 10
    },
    subWidth () {
      this.value -= 10
    },
    mousedown (event) {
      this.dragging = true
    },
    mousemove (event) {
      if (this.dragging) {
        const rect = this.$refs.sliderCanvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const val = Math.round(x / rect.width * this.range + this.min)
        this.value = Math.min(Math.max(val, this.min), this.max)
      }
    },
    mouseup (event) {
      this.dragging = false
    },

    refresh () {
      const canvas = this.$refs.sliderCanvas
      var ctx = this.$refs.sliderCanvas.getContext('2d')
      var txt = this.$refs.labelCanvas.getContext('2d')
      const pixelRatio = getPixelRatio(ctx)

      // get current size of the canvas
      const rect = canvas.getBoundingClientRect()

      // increase the actual size of our canvas
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio

      // ensure all drawing operations are scaled
      // ctx.scale(getPixelRatio(ctx), getPixelRatio(ctx))

      // scale everything down using CSS
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      ctx.save()
      ctx.scale(getPixelRatio(ctx), getPixelRatio(ctx))
      ctx.clearRect(0, 0, 263, 12)

      var grd = ctx.createLinearGradient(3, 0, 259, 0)
      grd.addColorStop(0, 'blue')
      grd.addColorStop(0.5, 'green')
      grd.addColorStop(1, 'red')

      ctx.beginPath()
      ctx.moveTo(3, 12)
         ctx.lineTo(3, 0)   
      ctx.lineTo(259, 0)
      ctx.lineTo(259, 12)
      ctx.closePath()
      ctx.fillStyle = grd
      ctx.fill()

      ctx.restore()

      ctx.beginPath()
      const lineWidth2 = Math.round(pixelRatio)
      ctx.lineWidth = lineWidth2
      txt.font = '12px Arial'
      txt.textAlign = 'center'
      this.ticks.forEach((t, i) => {
        const x = Math.round(((t - this.min) / this.range * 256 + 3) * pixelRatio) + ((lineWidth2 % 2 == 0) ? pixelRatio / 2 : 0)
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        txt.fillText(t, t, 0)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 400px;
  height: 24px;
}

.slider {
  width: 201px;
  height: 12px;
  padding: 0;
  margin: 0;
}

</style>
