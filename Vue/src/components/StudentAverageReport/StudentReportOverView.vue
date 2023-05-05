<template>
  <div>
    <v-row :align="'center'"> </v-row>
    <div class="d">
      <table>
        <thead>
          <tr>
            <th rowspan="2">Programme</th>
            <th colspan="3">System</th>
            <th colspan="3">
              {{ listLocation.find(item => item.id === locationId).name }}
            </th>
          </tr>
          <tr>
            <th>Num of Class</th>
            <th>Num of Student</th>
            <th>Average Student</th>
            <th>Num of Class</th>
            <th>Num of Student</th>
            <th>Average Student</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in systemAverage" :key="item.programme">
            <td>
              <span>{{ item.programme }} </span>
            </td>
            <td>{{ item.nbrClass }}</td>
            <td>{{ item.nbrStu }}</td>
            <td>{{ (item.nbrStu / item.nbrClass).toFixed(1) }}</td>
            <template v-if="locationArerage.some(itemI => itemI.programmeID === item.programmeID)">
              <td>
                {{ locationArerage.find(itemI => itemI.programmeID === item.programmeID).nbrClass }}
              </td>
              <td>
                {{ locationArerage.find(itemI => itemI.programmeID === item.programmeID).nbrStu }}
              </td>
              <td>
                {{
                  locationArerage
                    .find(itemI => itemI.programmeID === item.programmeID)
                    .average.toFixed(1)
                }}
              </td>
            </template>
            <template v-else>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </template>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><span>Grand total </span></td>
            <td>{{ totalAllSys.nbrClass }}</td>
            <td>{{ totalAllSys.nbrStu }}</td>
            <td :class="totalAllSys.color">{{ totalAllSys.average }}</td>
            <td>{{ totalAll.nbrClass }}</td>
            <td>{{ totalAll.nbrStu }}</td>
            <td :class="totalAll.color">{{ totalAll.average }}</td>
          </tr>
          <tr>
            <td><span>Total group class </span></td>
            <td>{{ totalGroupSys.nbrClass }}</td>
            <td>{{ totalGroupSys.nbrStu }}</td>
            <td :class="totalGroupSys.color">{{ totalGroupSys.average }}</td>
            <td>{{ totalGroup.nbrClass }}</td>
            <td>{{ totalGroup.nbrStu }}</td>
            <td :class="totalGroup.color">{{ totalGroup.average }}</td>
          </tr>
          <tr>
            <td><span>Standard Class </span></td>
            <td>{{ totalStandareSys.nbrClass }}</td>
            <td>{{ totalStandareSys.nbrStu }}</td>
            <td :class="totalStandareSys.color">{{ totalStandareSys.average }}</td>
            <td>{{ totalStandare.nbrClass }}</td>
            <td>{{ totalStandare.nbrStu }}</td>
            <td :class="totalStandare.color">{{ totalStandare.average }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
// import { student_information } from "@/api/student-information.js";
export default {
  data() {
    return {
      to: null,
      from: null,
      dataLocation: {},
      systemAverage: [],
      locationArerage: [],
      systemAverageOr: {},
      locationArerageOr: {},
      totalAllSys: {},
      totalStandareSys: {},
      totalGroupSys: {},
      totalAll: {},
      totalStandare: {},
      totalGroup: {},
    }
  },

  props: {
    listLocation: {
      type: Array,
    },
    locationId: {
      type: Number,
    },
    data: {
      type: Array,
    },
    target: Number,
  },

  mounted() {},
  updated() {},
  watch: {
    locationId: function (newLocation) {
      const locationData = this.data.find(element => element.locations.id === newLocation)
      let newLocationArerage = [
        ...locationData.locations.standardProgram,
        ...locationData.locations.noneStandardProgram,
      ]
      this.locationArerage = newLocationArerage
      this.locationArerageOr = newLocationArerage
      let basicGrammar = this.findBasicGrammar(newLocationArerage)

      this.totalAll = this.summaryAll(newLocationArerage)
      this.totalStandare = this.summaryAll(locationData.locations.standardProgram)
      this.totalGroup = this.summaryStandardAndBasicGrammar(this.totalStandare, basicGrammar)
      this.to = null
      this.from = null
      this.$emit('setExportData', newLocationArerage)
    },
    target: function () {
      this.reCalcul(this.data)
    },

    data: function (newData) {
      this.reCalcul(newData)
    },
  },
  created() {},

  methods: {
    reCalcul(newData) {
      if (newData === null || newData.length == 0) return
      let dataSystemAverage = []
      let sysStandardProgram = []
      const locationData = newData.find(element => element.locations.id === this.locationId)
      let newLocationArerage = [
        ...locationData.locations.standardProgram,
        ...locationData.locations.noneStandardProgram,
      ]
      this.locationArerage = newLocationArerage
      let newLocationArerageOr = {
        standardProgram: locationData.locations.standardProgram,
        noneStandardProgram: locationData.locations.noneStandardProgram,
      }
      this.locationArerageOr = newLocationArerageOr

      newData.forEach(element => {
        dataSystemAverage = [
          ...dataSystemAverage,
          ...element.locations.standardProgram,
          ...element.locations.noneStandardProgram,
        ]
        sysStandardProgram = [...sysStandardProgram, ...element.locations.standardProgram]
      })

      let basicGrammar = this.findBasicGrammar(newLocationArerage)
      let basicGrammarSys = this.findBasicGrammar(dataSystemAverage)

      this.systemAverage = this.removeSameProgramme(dataSystemAverage)
      this.totalAll = this.summaryAll(newLocationArerage)
      this.totalStandare = this.summaryAll(locationData.locations.standardProgram)
      this.totalGroup = this.summaryStandardAndBasicGrammar(this.totalStandare, basicGrammar)
      this.totalAllSys = this.summaryAll(dataSystemAverage)
      this.totalStandareSys = this.summaryAll(sysStandardProgram)
      this.totalGroupSys = this.summaryStandardAndBasicGrammar(
        this.totalStandareSys,
        basicGrammarSys
      )
      this.$emit('setExportData', newLocationArerage)
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
    findBasicGrammar: function (data) {
      let basicGrammar = { nbrStu: 0, nbrClass: 0 }
      data.forEach(element => {
        if (element.programme === 'Basic Grammar') {
          basicGrammar.nbrClass += element.nbrClass
          basicGrammar.nbrStu += element.nbrStu
        }
      })

      return basicGrammar
    },
    summaryAll: function (data) {
      let nbrStu = 0
      let nbrClass = 0
      let average = 0.0

      data.forEach(element => {
        nbrClass += element.nbrClass
        nbrStu += element.nbrStu
      })

      average = (nbrStu / nbrClass).toFixed(1)
      let color = this.checkClassColorAverage(average)
      return { nbrClass, nbrStu, average, color }
    },
    summaryAllIngorePrivate: function (data) {
      let nbrStu = 0
      let nbrClass = 0
      let average = 0.0

      data.forEach(element => {
        if (element.programme != 'Private') {
          nbrClass += element.nbrClass
          nbrStu += element.nbrStu
        }
      })

      average = (nbrStu / nbrClass).toFixed(1)
      let color = this.checkClassColorAverage(average)
      return { nbrClass, nbrStu, average, color }
    },
    summaryStandardAndBasicGrammar: function (standard, basicGrammar) {
      if (basicGrammar == null) return standard
      let nbrStu = standard.nbrStu + basicGrammar.nbrStu
      let nbrClass = standard.nbrClass + basicGrammar.nbrClass
      let average = (nbrStu / nbrClass).toFixed(1)
      let color = this.checkClassColorAverage(average)

      return { nbrClass, nbrStu, average, color }
    },
    removeSameProgramme: arr => {
      let newData = []
      arr.forEach(element => {
        if (
          newData.length === 0 ||
          !newData.some(elementSt => elementSt.programmeID === element.programmeID)
        ) {
          newData.push(element)
        } else {
          newData = newData.map(itemI => {
            return itemI.programmeID === element.programmeID
              ? {
                  ...itemI,
                  nbrClass: itemI.nbrClass + element.nbrClass,
                  nbrStu: itemI.nbrStu + element.nbrStu,
                }
              : itemI
          })
        }
      })

      return newData
    },
  },
}
</script>

<style lang="scss" scoped>
td,
th {
  border: 1px solid #dae3e8;
  padding: 7px 10px;
}

th {
  background: #0b2585;
  color: #ffff;
  font-weight: 100;
}

.d {
  overflow-x: scroll;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  margin-top: 40px;
}

tr td:nth-of-type(1) {
  text-align: left;
}

tr td:nth-of-type(1) span {
  display: inline-block;
  margin-left: 10px;
}

tbody tr:nth-of-type(even) td {
  background: #e1ebff;
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

tfoot tr:nth-of-type(1) td {
  background: #737373;
  color: #fff;
}
</style>
