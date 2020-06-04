<template>
  <div class="row">
    <div class="col-3">
      <draggable
        class="dragArea list-group"
        :list="library"
        :group="{ name: 'opcodes', pull: 'clone', put: false }"
        @change="log"
      >
        <div
          class="list-group-item"
          v-for="element in library"
          :key="element.title"
        >
          {{ element.title }}
        </div>
             </draggable>
    </div>
    <div class="col-7">
      <draggable
        tag="el-collapse"
        :list="list"
        group="opcodes"
        :component-data="collapseComponentData"
         handle=".handle"
      >
        <el-collapse-item
          v-for="item in list"
          :key="item.id"
          :name="item.id"
        >
        <template slot="title">
          <div> <i class="fa fa-align-justify handle"></i></div>
          <div>{{ item.title }}</div><div class="title">Information TBW</div>
        </template>
          <Envelope :key="item.id+100"/>
        </el-collapse-item>
      </draggable>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import draggable from 'vuedraggable'
import Envelope from './Envelope'

export default {
  name: 'third-party',
  display: 'Third party',
  order: 10,
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
      },
      instruments: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  methods: {
    inputChanged (val) {
      this.activeNames = val
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
