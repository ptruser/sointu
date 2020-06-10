<template>
  <div id="container">
    <div @click="collapsed=!collapsed">
      <div class="icon" id="arrow" :class="{collapsed:collapsed}"><i class="el-icon-arrow-right"/></div>
      <div class="icon" @click.stop="fold"><i class="el-icon-s-fold"/></div>
      <div class="icon" @click.stop="unfold"><i class="el-icon-s-unfold"/></div>
      <div class="icon" @click.stop="addInstrument"><i class="el-icon-plus"/></div>      
      <div class="icon" @click.stop="deleteInstrument"><i class="el-icon-delete"/></div>       
      <div class="label">Instrument editor</div>
    </div>
    <div id="collapseDiv" :class="{collapsed:collapsed}">
      <div id="properties">
        <el-input id="instrumentName" placeholder="Unnamed instrument"/>
      </div>

      <splitpanes horizontal  class="default-theme units">

      <pane class="scrolling" id="instrumentPane">
        <draggable
          tag="el-collapse"
          :list="units"
          group="opcodes"
          :component-data="collapseComponentData"
          handle=".handle"
        >
          <el-collapse-item
            v-for="item in units"
            class="unit"
            :key="item.id"
            :name="item.id"
          >
              <template slot="title">
                <div> <i class="fa fa-align-justify handle"></i></div>
                <div>{{ item.type }}</div><div class="title">{{ item.attack }}</div>
              </template>
            <Envelope/>
          </el-collapse-item>
        </draggable>
      </pane>

      <pane class="scrolling" id="unitPane">
        <draggable
          class="dragArea list-group"
          :list="Object.keys(library)"
          :clone="clone"  
          :group="{ name: 'opcodes', pull: 'clone', put: false }"
        >
          <div
            class="list-group-item"
            v-for="element in Object.keys(library)"
            :key="element"
          >
            {{ element }}
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
import Vue from 'vue'
import { defaultUnits,defaultInstrument } from '../units'

var startingInstrument = _.cloneDeep(defaultInstrument)
startingInstrument.forEach((x,i) => {
  startingInstrument[i].id = i
})

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
      units: startingInstrument,
      activeNames: [1],
      collapseComponentData: {
        on: {
          input: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      },
      library: _.cloneDeep(defaultUnits),
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
    },
    fold() {
      while(this.activeNames.length > 0)
        this.activeNames.pop();
      this.collapsed = false;
    },
    unfold() {
      while(this.activeNames.length > 0)
        this.activeNames.pop();
      this.list.forEach(element => {
        this.activeNames.push(element.id)
      });
      this.collapsed = false;
    },
    addInstrument() {

    },
    deleteInstrument() {

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
  margin: auto;
  height: 50%;
  color: #999;
}

.icon {
  font-size: 30pt;
  color: #999;
}

.icon:hover {
  color: #fff;
}

.unit {
  width: 400px;
}

#container {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: #444;
}

#container > :first-child {
  flex: 0 0 auto;
  font-size: 14pt;
  border: 1px none black; 
  border-left-style: solid;  
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
  margin: 5px; 
}

#units {
  flex: 1 1 500px;
  min-width: 0px;   
}

#instrumentPane {
  background-color: #000;
}

.splitpanes__pane {
  display: flex;
  min-width: 0px;
  overflow-y: overlay;
  font-family: Helvetica, Arial, sans-serif;
}

#instrumentPane {
  background-color: #444;
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
