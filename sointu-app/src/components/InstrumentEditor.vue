<template>
  <div id="container" class="sidePane">
    <div @click="collapsed=!collapsed">
      <div class="icon"><i :class="{collapsed:collapsed}" class="collapseIcon el-icon-arrow-right"/></div>
      <div class="icon" @click.stop="fold"><i class="el-icon-s-fold"/></div>
      <div class="icon" @click.stop="unfold"><i class="el-icon-s-unfold"/></div>
      <div class="icon" @click.stop="addInstrument"><i class="el-icon-document-add"/></div>
      <div class="icon" @click.stop="deleteInstrument">
        <template>
        <el-popconfirm
          confirmButtonText='OK'
          cancelButtonText='No'
          icon="el-icon-info"
          iconColor="red"
          title="Are you sure to delete this instrument?"
        >
          <i slot="reference" class="el-icon-delete"/>
        </el-popconfirm>
        </template>
      </div>
      <div class="label paneTitle">Instrument editor</div>
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
              <div><i class="fa fa-align-justify handle"></i></div>
              <div>{{ unitTitle(item) }}</div>
              <div class="title">{{ titleForItem(item) }}</div>
              <div v-if="'stereo' in item" class="stereo" @click="stopPropagation"><el-switch v-model="item.stereo"/></div>   
            </template>
            <table>
              <tr v-for="(value,key,index) in valsForItem(item)" :key="index">
                <td>{{titleForKey(key)}}</td>
                <td><component :is="componentForKey(key)" v-bind:value.sync="item[key]"/></td>
              </tr>
            </table>
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

import draggable from 'vuedraggable'
import Slider from './Slider'
import { Splitpanes, Pane } from 'splitpanes'
import { mapState } from 'vuex'
import _ from 'lodash'
import Vue from 'vue'
import { defaultUnits, defaultInstrument } from '../units'

var startingInstrument = _.cloneDeep(defaultInstrument)
startingInstrument.forEach((x, i) => {
  startingInstrument[i].id = i
})

export default {
  components: {
    draggable,
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
      library: _.cloneDeep(defaultUnits)
    }
  },
  computed: {
    unitComponents: function() {
      return this.units.map(x => componentMapping[x.type])
    },
    ...mapState([
    'instruments'
  ])},
  methods: {
    inputChanged (val) {
      this.activeNames = val
    },
    foo () {
      console.log(this.instruments)
    },
    clone: function (key) {
      console.log(key)
      return {
        id: this.runningId++, 
        ...this.library[key]
      }
    },
    fold () {
      while (this.activeNames.length > 0) { this.activeNames.pop() }
      this.collapsed = false
    },
    unfold () {
      this.fold()
      this.units.forEach(unit => {
        this.activeNames.push(unit.id)
      })
    },
    unitTitle(unit) {
      return _.capitalize(unit.type)
    },
    titleForKey(key) {
      return _.capitalize(key)
    },
    componentForKey(key) {
      return Slider
    },
    valsForItem(item) {
      return _.omit(item,['title','stereo','id','type'])
    },
    titleForItem(item) {
      return Object.entries(_.omit(item,['title','stereo','id','type'])).map(([key,val]) => key[0].toUpperCase() + val).join(" ");
    },
    stopPropagation(e) {
      e.stopPropagation()
    },
    addInstrument () {

    },
    deleteInstrument () {

    }
  }
}
</script>
<style scoped>
.handle {
  float: left;
}

.title {
  color: #999;
}

.label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  margin: auto;
}

.unit {
  width: 405px;
  border-radius: 5px;
  background-color: #999;
  margin: 2px 0px;
}

#container {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

#container > :first-child {
  flex: 0 0 auto;
  border: 1px none black;
  border-left-style: solid;
}

#collapseDiv {
  width: 420px;
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

</style>
