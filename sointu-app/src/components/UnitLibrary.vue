<template>
  <draggable
    class="dragArea list-group"
    :list="library"
    :group="{ name: 'opcodes', pull: 'clone', put: false }"
  >
        <div
          class="list-group-item"
          v-for="element in library"
          :key="element.title"
        >
          {{ element.title }}
        </div>
  </draggable>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import draggable from 'vuedraggable'
import Envelope from './Envelope'
import { mapState } from 'vuex'

export default {
  components: {
    draggable,
    Envelope
  },
  data () {
    return {
      list: [
        {
          title: 'Consistency',
          id: 1
        },
        {
          title: 'Feedback',
          id: 2
        },
        {
          title: 'Efficiency',
          id: 3
        },
        {
          title: 'Controllability',
          id: 4
        }
      ],
      library: [
        {
          title: 'Consistency',
          id: 1
        },
        {
          title: 'Feedback',
          id: 2
        },
        {
          title: 'Efficiency',
          id: 3
        },
        {
          title: 'Controllability',
          id: 4
        }
      ],
      activeNames: [1],
      collapseComponentData: {
        on: {
          input: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      }
    }
  },
  computed: mapState([
    'instruments'
  ]),
  methods: {
    inputChanged (val) {
      this.activeNames = val
    },
    foo () {
      console.log(this.instruments)
    }
  }
}
</script>
<style scoped>
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.title {
  color: #999;
}

</style>
