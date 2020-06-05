<template>
    <table tabindex="1">
        <thead>

<draggable v-model="tracks" tag="tr">
             <th class="cell" :key="-1">
              #
            </th>
            <th class="cell" v-for="(item, index) in tracks" :key="index" scope="col">
              {{ index }}
              V:{{item.voices}}
            </th>
</draggable>
        </thead>
        <tr v-for="row in Array(songLength).keys()" :key="row">
            <td class="rownumber">{{row}}</td>
            <td class="cell" v-for="(item, index) in tracks" :key="index" >{{item.sequence[row]}}</td>
        </tr>
    </table>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'tracks', 'songLength'
  ]),
  components: {
    draggable
  }
}
</script>

<style scoped>

thead th {
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  top: 0;
}

thead th:first-child {
  left: 0;
  z-index: 2;
}

tr td:first-child {
      position: -webkit-sticky; /* for Safari */
  position: sticky;
  left: 0;
  z-index: 1;
}

thead th {
  background: #000;
  color: #FFF;
}

tbody td {
  background: #FFF;
  border-right: 1px solid #CCC;
}

table {
  border-collapse: collapse;
}

td,
th {
  padding: 0.5em;
}
.rownumber {
    background-color: #AAA;
}

.cell {
    background-color: #888;
}
</style>
