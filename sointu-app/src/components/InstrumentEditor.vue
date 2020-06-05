<template>
  <div class="row">
    <el-tabs type="card" addable>
  <el-tab-pane
    v-for="(item, index) in instruments"
    :key="item.name"
    :label="item.name+index"
    :name="'tab'+index"/>
  {{index}}
</el-tabs>
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
  </el-tab-pane>

    <div class="col-3" @click="foo">
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
    </div>

  </div>
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
    foo() {
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
