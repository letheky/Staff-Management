<template>
  <div>
    <!-- <v-autocomplete :items="listClassCode" v-model="listQcSelect" outlined dense multiple label="Select QC"
            @change="changeSelectQc">
            <template v-slot:selection="{ index }">
                <span v-if="index === 0">
                    {{
                    listQcSelect.length === 0
                    ? "Select QC"
                    : listQcSelect.includes("All")
                    ? listQcSelect.length - 1 + " selected"
                    : listQcSelect.length + " selected"
                    }}
                </span>
            </template>
        </v-autocomplete> -->
    <v-data-table
      :headers="headers"
      :items="filtered"
      item
      hide-default-header
      hide-default-footer
      :items-per-page="1000000000"
      class="elevation-0 event-table"
      fixed-header
      height="70vh"
    >
      <template v-slot:header="{ props }">
        <thead class="v-data-table-header">
          <tr>
            <th v-for="(prop, index) in props.headers" :key="index">{{ prop.text }}</th>
          </tr>
        </thead>
        <tr class="fixed-row-filter">
          <th
            v-for="header in props.headers"
            class="select-book abc filter-event"
            :key="header.text"
          >
            <div v-if="filters.hasOwnProperty(header.value)">
              <v-text-field
                class="text-field"
                placeholder="Search..."
                v-if="header.value === 'assignees'"
                :class="'task-management-select'"
                v-model="assignees"
                :items="selectLocation"
                dense
                outlined
              >
              </v-text-field>
              <v-text-field
                class="text-field"
                placeholder="Search..."
                v-else-if="header.value === 'descriptions'"
                :class="'task-management-select'"
                v-model="descriptions"
                :items="selectLocation"
                dense
                outlined
              >
              </v-text-field>
              <Autocomplete
                v-if="filters.hasOwnProperty(header.value)"
                @setFilter="setFilter"
                :styleBorder="'border-bottom'"
                :keyFilter="header.value"
                :selectedInit="filters[header.value]"
                :listItem="groupColumnValueList(header.value)"
              />
            </div>
          </th>
        </tr>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(classItem, index) in items" :key="index">
            <td>
              <span :class="'link'" @click="viewClassDetail(classItem.classID)">{{
                classItem.classCode
              }}</span>
            </td>

            <td>{{ classItem.note }}</td>
            <td>{{ classItem.qc }}</td>
            <td :class="classItem.color">
              <p :style="{ textAlign: 'center' }">{{ classItem.nbrStu }}</p>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <!-- <table>

            <thead>
                <tr>
                    <th>Class Code</th>
                    <th>Class Note</th>
                    <th>Number of Student</th>
                </tr>

            </thead>
            <tbody v-for="(item,index) in data" :key="index">

                <tr>
                    <td><span>{{item.classCode}}</span></td>

                    <td>{{item.note}}</td>
                    <td>{{item.nbrStu}}</td>



                </tr>
            </tbody>

        </table> -->
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management'
import Autocomplete from '@/components/Utils/Autocomplete.vue'

export default {
  components: { Autocomplete },
  data() {
    return {
      data: [],
      to: null,
      from: null,
      dataOr: [],
      listClassCode: [],
      filters: {
        classCode: [],
        nbrStu: [],
        qc: [],
        note: [],
      },
      headers: [
        {
          text: 'Class Code',
          value: 'classCode',
        },
        {
          text: 'Class Note',
          value: 'note',
        },
        {
          text: 'QC',
          value: 'qc',
        },
        {
          text: 'Number of Student',
          value: 'nbrStu',
        },
      ],
    }
  },
  computed: {
    filtered() {
      const listClass = this.data.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listClass
    },
  },
  props: ['listLocation', 'locationId', 'target'],
  methods: {
    changeFilter() {},
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('listFilterStuAveByClass', JSON.stringify(this.filters))
    },

    viewClassDetail(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: {
          classID: classID,
          fromAvege: true,
        },
      })
    },
    async init() {
      await class_managerment.StudentReportOverView(this.locationId).then(res => {
        if (res) {
          this.data = []
          res.forEach(element => {
            this.data.push({
              classCode: element.classCode,
              note: element.note,
              nbrStu: element.nbrStu,
              qc: element.qc,
              classID: element.classID,
              color: this.checkClassColorAverage(element.nbrStu),
            })
          })
         
        }
      })
    },
    groupColumnValueList(val) {
      let data = this.data
      if (val === 'nbrStu') {
        let temp = data[0]
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].nbrStu > data[j].nbrStu) {
              temp = data[i]
              data[i] = data[j]
              data[j] = temp
            }
          }
        }
        data.forEach(e => {
          e.nbrStu
        })
      }
      return data.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.data
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.data
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    formatToExport: function (data) {
      const newData = []
      data.forEach(element => {
        newData.push({
          classCode: element.classCode,
          note: element.note,
          nbrStu: element.nbrStu,
        })
      })
      return newData
    },
    checkClassColorAverage: function (data) {
      if (parseFloat(data) < parseFloat(this.target)) {
        return 'less-target'
      } else if (parseFloat(data) === parseFloat(this.target)) {
        return 'equal-target'
      } else {
        return 'bigger-target'
      }
    },
  },

  watch: {
    data: function () {},
    locationId: function () {
      this.init()
    },
    target: function () {
      this.init()
    },
  },

  created() {
    if(localStorage.getItem('listFilterStuAveByClass')){
      this.filters = JSON.parse(localStorage.getItem('listFilterStuAveByClass'))
    }
    // this.init()
    this.init()
  },
}
</script>

<style lang="scss" scoped>
// .btn-apply {
//     margin-left: auto;
//     width: fit-content;
// }

// .report-form-by-class {
//     display: flex;
//     align-items: center;
// }

// .average-number-select-item {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     margin-right: 14px;
// }

// .average-number-select-item>* {
//     width: 200px;
//     margin-top: 18px;
// }

// .list-input {
//     display: flex;
//     align-items: center;
// }

.v-data-table-header::before {
  content: '';
  top: 0;
  bottom: 0;
  position: absolute;
  width: 90%;
  height: 100px;
  background: #dae3e8;
}

td,
th {
  border: 1px solid #dae3e8;
}

.table {
  height: 60vh;
}

.v-data-table-header {
  border-radius: 30px;
}

thead tr:nth-of-type(1) th {
  background: #0b2585 !important;
  color: #ffff !important;
  font-weight: 100;
}

tbody tr:nth-child(odd) {
  background: #bde6fb;
}

thead th {
  text-align: center !important;
  padding: 0 !important;
  height: 44px;
}

.top > div {
  padding: 0;
  padding-top: 10px;
  padding-left: 10px;
}

.select-location {
  padding: 0;
  width: 150px;
  padding-left: 5px;
}

.v-data-table-header tr:nth-of-type(1) th:last-child {
  border-radius: 0 5px 0 0px;
}

.v-data-table-header tr:nth-of-type(2) th {
  height: 20px !important;
}

.v-data-table-header tr:nth-of-type(1) th:first-child {
  border-radius: 5px 0px 0 0px;
}

.link {
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.link a {
  display: block;
  width: fit-content;

  float: right;
}
.bigger-target {
  background: #27ae60 !important;
  color: #000000 !important;
}

.equal-target {
  background: #f0ad00 !important;
  color: black !important;
}

.less-target {
  background: #f44336 !important;
  color: white !important;
}

.less-target {
  background: red;
  color: white;
}
</style>
