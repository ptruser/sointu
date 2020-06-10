<template>
  <div id="container">
    <div @click="collapsed=!collapsed">
      <div class="icon" id="arrow" :class="{collapsed:collapsed}"><i class="el-icon-arrow-right"/></div>
      <div class="icon"><i class="el-icon-s-fold"/></div>
      <div class="icon"><i class="el-icon-s-unfold"/></div>
      <div class="label">Instrument editor</div>
    </div>
    <div id="collapseDiv" :class="{collapsed:collapsed}">
      <div id="properties">
        <el-input id="instrumentName" placeholder="Unnamed instrument"/>
            <i class="icon el-icon-delete"/>

      </div>

      <splitpanes horizontal  class="default-theme units">

      <pane class="scrolling">
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
      </pane>

      <pane class="scrolling">
        <draggable
          class="dragArea list-group"
          :list="library"
          :clone="clone"  
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
        </pane>

      </splitpanes>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import 'splitpanes/dist/splitpanes.css'
import draggable from 'vuedraggable'
import Envelope from './Envelope'
import { Splitpanes, Pane } from 'splitpanes'
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  components: {
    draggable,
    Envelope,
    Splitpanes,
    Pane
  },
  data () {
    return {
      collapsed: false,
      runningId: 100,
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
    },
    clone: function(obj) {
      return { id: this.runningId++, title: obj.title }
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

.label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  height: 50%;
}

.icon {
  font-size: 30pt;
}

div.propertiesDiv {
  top: 0;
  background-color: #999;
  z-index: 2;
  width: 100%;
  display: block;
}

#container {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

#container > :first-child {
  flex: 0 0 auto;
  font-size: 14pt;
}

#collapseDiv {
  width: 500px;
  transition: .5s width ease-in-out;
  display: flex;
  flex-direction: column;  
  overflow: hidden;
}

#instrumentName {
  float: left;
  width: 100px;
}

#properties {
  flex: 0 0 auto;
}

#units {
  flex: 1 1 500px;
  min-width: 0px;  
}

.splitpanes__pane {
  display: flex;
  min-width: 0px;
  overflow-y: overlay;
  font-family: Helvetica, Arial, sans-serif;
}

#collapseDiv.collapsed {
  width: 0px;
}

#arrow {
  transition: .5s transform ease-in-out;
}

#arrow.collapsed {
  transform: rotate(-90deg);
}

</style>
