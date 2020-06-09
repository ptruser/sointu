<template>
  <div id="container">
    <div @click="collapsed=!collapsed">
      <div class="icon" id="arrow" :class="{collapsed:collapsed}"><i class="el-icon-arrow-right"/></div>
      <div class="icon"><i class="el-icon-s-fold"/></div>      
      <div class="icon"><i class="el-icon-s-unfold"/></div>          
      <div class="label">Instrument editor</div>
    </div>
    <div id="collapseDiv" :class="{collapsed:collapsed}">
      <div class="propertiesDiv">
        <el-row :gutter="20">
          <el-col :span="6">Name</el-col>
          <el-col :span="18"><el-input
            placeholder="Unnamed instrument">
          </el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">Voices</el-col>
          <el-col :span="18"><el-input-number v-model="voices" :max="32" :min="1"/></el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <i class="el-icon-s-fold"/>
            <i class="el-icon-s-unfold"/>   
          </el-col>   
          <el-col :span="5">
            <i class="el-icon-delete"/>
          </el-col>

        </el-row>  

      </div>

      <div class="scrolling col-7">
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
      collapsed: false,
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

.label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  height: 50%;
}

.icon {
  font-size: 125%;
}

div.propertiesDiv {
  top: 0;
  background-color: #999;
  z-index: 2;
  width: 100%;
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
  width: 400px;
  transition: .5s width ease-in-out;    
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
