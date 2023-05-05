<template>
  <div class="student-report-by-qc">
    <div class="select-qc">
      <v-autocomplete
        :items="listQc"
        v-model="listQcSelect"
        outlined
        dense
        multiple
        label="Select QC"
        @change="changeSelectQc"
      >
        <template v-slot:selection="{ index }">
          <span v-if="index === 0">
            {{
              listQcSelect.length === 0
                ? 'Select QC'
                : listQcSelect.includes('All')
                ? listQcSelect.length - 1 + ' selected'
                : listQcSelect.length + ' selected'
            }}
          </span>
        </template>
      </v-autocomplete>
    </div>

    <table>
      <thead>
        <tr>
          <th>Programme</th>
          <th>Num of Class</th>
          <th>Num of Student</th>
          <th>Average Student</th>
        </tr>
      </thead>
      <tbody v-for="(value, index) in dataReport" :key="index">
        <template>
          <tr class="total-a-student">
            <td v-on:click="change(value.qc)">
              <span>{{ value.qc }}</span>
              <v-icon large
                >{{ open.includes(value.qc) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
              </v-icon>
            </td>
            <td>{{ value.total.nbrClass }}</td>
            <td>{{ value.total.nbrStu }}</td>
            <td
              :class="ckeckClassColorAverage((value.total.average / value.data.length).toFixed(1))"
            >
              {{ (value.total.average / value.data.length).toFixed(1) }}
            </td>
          </tr>

          <tr
            :class="'s'"
            v-for="(item, index) in value.data"
            :key="index"
            v-show="open.includes(value.qc)"
          >
            <td>
              <span>{{ item.programme }}</span>
            </td>
            <td>{{ item.nbrClass }}</td>
            <td>{{ item.nbrStu }}</td>
            <td>{{ item.average }}</td>
            <!-- <td :class="ckeckClassColorAverage(item.average)"> {{ item.average }}</td> -->
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td><span>Class total</span></td>
          <td>{{ totalAll.nbrClass.toFixed(1) }}</td>
          <td>{{ totalAll.nbrStu.toFixed(1) }}</td>
          <td :class="ckeckClassColorAverage((totalAll.nbrStu / totalAll.nbrClass).toFixed(1))">
            {{
              isNaN((totalAll.nbrStu / totalAll.nbrClass).toFixed(1))
                ? 0
                : (totalAll.nbrStu / totalAll.nbrClass).toFixed(1)
            }}
          </td>
        </tr>
        <tr>
          <td><span>Total group class</span></td>

          <td>{{ (totalAll.nbrClass - totalGroup.nbrClass).toFixed(1) }}</td>
          <td>{{ (totalAll.nbrStu - totalGroup.nbrStu).toFixed(1) }}</td>
          <td
            :class="
              ckeckClassColorAverage(
                (
                  (totalAll.nbrStu - totalGroup.nbrStu) /
                  (totalAll.nbrClass - totalGroup.nbrClass)
                ).toFixed(1)
              )
            "
          >
            {{
              isNaN(
                (
                  (totalAll.nbrStu - totalGroup.nbrStu) /
                  (totalAll.nbrClass - totalGroup.nbrClass)
                ).toFixed(1)
              )
                ? 0
                : (
                    (totalAll.nbrStu - totalGroup.nbrStu) /
                    (totalAll.nbrClass - totalGroup.nbrClass)
                  ).toFixed(1)
            }}
          </td>
        </tr>
        <tr>
          <td><span>Standard Class</span></td>

          <td>{{ (totalAll.nbrClass - totalStandare.nbrClass).toFixed(1) }}</td>
          <td>{{ (totalAll.nbrStu - totalStandare.nbrStu).toFixed(1) }}</td>
          <td
            :class="
              ckeckClassColorAverage(
                (
                  (totalAll.nbrStu - totalStandare.nbrStu) /
                  (totalAll.nbrClass - totalStandare.nbrClass)
                ).toFixed(1)
              )
            "
          >
            {{
              isNaN(
                (
                  (totalAll.nbrStu - totalStandare.nbrStu) /
                  (totalAll.nbrClass - totalStandare.nbrClass)
                ).toFixed(1)
              )
                ? 0
                : (
                    (totalAll.nbrStu - totalStandare.nbrStu) /
                    (totalAll.nbrClass - totalStandare.nbrClass)
                  ).toFixed(1)
            }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { student_information } from '@/api/student-information.js'

export default {
  data() {
    return {
      keySearch: '',
      open: [],

      listQcSelect: [],
      listOpen: [],
      listQc: [],
      dataReport: [],
      dataReportOr: [],
      selectAll: false,
      totalAll: {},
      totalStandare: {},
      totalGroup: {},
    }
  },
  props: ['listLocation', 'locationId', 'target'],
  watch: {
    location: function () {
      this.init()
    },
    listLocation: function () {
      this.init()
    },
    keySearch: function () {
      this.searchByQcName()
    },
    listQcSelect: function (data) {
      this.filterByQcName(data)
    },

    target: function () {},
  },
  methods: {
    async init() {
      if (this.listLocation.length != 0) {
        const locationId = this.locationId
        await student_information.getOverviewByQCWithLocation(locationId).then(res => {
          this.dataReport = res.byQC
          this.dataReportOr = res.byQC

          const listQc = ['All']
          let formatDataToQc = []
          res.byQC.forEach(element => {
            if (
              formatDataToQc.length === 0 ||
              !formatDataToQc.some(elementSt => elementSt.qc === element.qc)
            ) {
              if (element.qc === null) {
                listQc.push('Khong co')
              } else {
                listQc.push(element.qc)
              }

              formatDataToQc.push({
                qc: element.qc,
                data: [element],
                total: {
                  ...element,
                },
              })
            } else {
              formatDataToQc = formatDataToQc.map(itemI => {
                return itemI.qc === element.qc
                  ? {
                      ...itemI,
                      data: [...itemI.data, element],
                      total: {
                        average: itemI.total.average + element.average,
                        nbrClass: itemI.total.nbrClass + element.nbrClass,
                        nbrStu: itemI.total.nbrStu + element.nbrStu,
                      },
                    }
                  : itemI
              })
            }
          })

          let dataCombine = []
          formatDataToQc.forEach(element => {
            dataCombine = [...dataCombine, ...element.data]
          })
          const objectTotal = this.getTotal(dataCombine)
          this.listQc = listQc
          this.listQcSelect = []
          this.dataReport = formatDataToQc
          this.dataReportOr = formatDataToQc
          this.totalAll = objectTotal.totalAll
          this.totalStandare = objectTotal.standare
          this.totalGroup = objectTotal.group

          this.$emit('setExportData', this.formatToExport(formatDataToQc))
        })
      }
    },

    getTotal: function (data) {
      let totalAll = {
        nbrStu: 0,
        nbrClass: 0,
      }
      let standare = {
        nbrStu: 0,
        nbrClass: 0,
      }
      let group = {
        nbrStu: 0,
        nbrClass: 0,
      }
      data.forEach(element => {
        if (element.programme === 'Private') {
          group.nbrClass = group.nbrClass + element.nbrClass
          group.nbrStu = group.nbrStu + element.nbrStu
        }
        if (
          element.programme === 'Private' ||
          element.programme === 'Power Of Writing' ||
          element.programme === 'Short Course' ||
          element.programme === 'Summer camp'
        ) {
          standare.nbrClass = standare.nbrClass + element.nbrClass
          standare.nbrStu = standare.nbrStu + element.nbrStu
        }
        totalAll.nbrClass = totalAll.nbrClass + element.nbrClass
        totalAll.nbrStu = totalAll.nbrStu + element.nbrStu
      })
      return { totalAll, group, standare }
    },
    formatToExport: function (data) {
      let dataExport = []
      data.forEach(element => {
        element.data.forEach(item => {
          dataExport.push({ name: element.name, ...item })
        })
      })
      return dataExport
    },
    filterByQcName: function (data) {
      if (data.includes('All') || data.length === 0) {
        this.dataReport = this.dataReportOr
        let dataCombine = []
        this.dataReportOr.forEach(element => {
          dataCombine = [...dataCombine, ...element.data]
        })
        const objectTotal = this.getTotal(dataCombine)
        this.totalAll = objectTotal.totalAll
        this.totalStandare = objectTotal.standare
        this.totalGroup = objectTotal.group
        this.$emit('setExportData', this.formatToExport(this.dataReportOr))
      } else {
        const dataFilter = this.dataReportOr.filter(item => {
          return data.includes(item.qc)
        })
        this.dataReport = dataFilter
        let dataCombine = []
        dataFilter.forEach(element => {
          dataCombine = [...dataCombine, ...element.data]
        })
        const objectTotal = this.getTotal(dataCombine)
        this.totalAll = objectTotal.totalAll
        this.totalStandare = objectTotal.standare
        this.totalGroup = objectTotal.group

        this.$emit('setExportData', this.formatToExport(dataFilter))
      }
    },
    ckeckClassColorAverage: function (data) {
      if (parseFloat(data) < parseFloat(this.target)) {
        return 'less-target'
      } else if (parseFloat(data) === parseFloat(this.target)) {
        return 'equal-target'
      } else {
        return 'bigger-target'
      }
    },
    change: function (name) {
      if (this.open.includes(name)) {
        this.open = this.open.filter(item => {
          return item !== name
        })
      } else {
        this.open = [...this.open, name]
      }
    },
    changeSelectQc: function (data) {
      console.log()
      if (data.includes('All')) {
        if (data.length === 1) {
          this.listQcSelect = this.listQc
          this.selectAll = true
        } else if (
          data.length > 1 &&
          data.length < this.listQc.length &&
          this.selectAll === false
        ) {
          this.listQcSelect = this.listQc
          this.selectAll = true
        } else {
          this.listQcSelect = data.filter(item => item != 'All')
          this.selectAll = false
        }
      } else {
        if (this.selectAll === true) {
          this.listQcSelect = []
          this.selectAll = false
        } else {
          if (data.length >= 0 && data.length < this.listQc.length - 1) {
            this.listQcSelect = data
            this.selectAll = false
          } else {
            this.listQcSelect = this.listQc
            this.selectAll = true
          }
        }
      }
      this.dataReport = this.dataReportOr.filter(item => {
        return data.includes(item.qc)
      })
    },
  },

  updated() {},
  created() {
    this.init()
  },
}
</script>

<style lang="scss" scoped>
.s {
  font-size: 10px;
}

.select-search {
  margin-top: 18px;
}

.total-a-student {
  background: #f8fafb;
}

.total-a-student > td {
  border: none;
}
.s {
  font-size: 1rem;
}

.select-qc {
  max-width: 250px;
  margin-top: 16px;
}

.total-a-student > td span {
  margin-left: 16px !important;
}

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

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #dae3e8;
}

tbody tr td:nth-of-type(1),
tfoot tr td:nth-of-type(1) {
  text-align: left;
}

tbody tr td:nth-of-type(1) span {
  display: inline-block;
  margin-left: 30px;
}

tfoot td span {
  display: inline-block;
  margin-left: 16px;
}

.shadow-bar {
  box-shadow: 0px 2px 3.45px rgba(17, 41, 63, 0.12);
}

tfoot tr:nth-of-type(1) td {
  background: #737373;
  color: #fff;
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
.s:nth-child(odd) {
  background: #d2eefc;
}
</style>
