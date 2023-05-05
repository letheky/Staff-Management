<template>
  <div class="mt-5 mr-10 ml-10">
    <div>
      <div>
        <h2 class="mb-3">Activity report</h2>
      </div>
      <div style="width: 100%" class="d-flex justify-space-between align-center mb-2">
        <div>
          <v-autocomplete
            v-model="activityID"
            :items="activityList"
            style="width: 160px"
            item-text="activityCode"
            item-value="activityID"
            lable="Activity"
            @change="get"
            outlined
            dense
            :class="'pb-0 pt-0 hidden-detail-err'"
          />
        </div>

        <v-btn color="primary" @click="dialog = true">Set target</v-btn>
      </div>
    </div>

    <v-data-table
      :headers="listForTable"
      :items="[]"
      hide-default-header
      hide-default-footer
      class="elevation-0 table-sale-byqcec"
      fixed-header
      max-height="60vh"
    >
      <template v-slot:header="{}">
        <thead class="header-report-activity">
          <tr>
            <th
              v-for="(header, index) in headers"
              :style="{
                background: header.bgColor,
                border: '1px solid #ffff',
                color: '#ffff !important',
              }"
              :key="index"
              :colspan="header.children.length === 0 ? 1 : header.children.length"
              :rowspan="header.children.length === 0 ? 2 : 1"
            >
              {{ header.text }}
            </th>
          </tr>
          <tr>
            <template v-for="(header, index) in headers">
              <th
                :key="index + headerChild.text"
                v-for="(headerChild, index2) in header.children"
                :style="{
                  background: headerChild.bgColor,
                  border: '1px solid #ffff',
                  color: '#ffff !important',
                }"
              >
                <p :class="headerChild.isFixW === true ? 'w-150' : ''" :key="index2">
                  {{ headerChild.text }}
                </p>
              </th>
            </template>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{}">
        <tbody
          :set="
            (listTable = headers.reduce((arr, el) => {
              el.children.length === 0 ? arr.push(el) : arr.push(...el.children)
              return arr
            }, []))
          "
        >
          <tr v-for="center in activityListReport" :key="center.locationID">
            <td v-for="header in listTable" :key="header.value">
              <p
                :style="{
                  textAlign: header.isMoney
                    ? 'right'
                    : header.value === 'location'
                    ? 'left'
                    : 'center',
                }"
              >
                {{
                  center[header.value]
                    ? header.isPer
                      ? center[header.value] + ' %'
                      : header.isMoney
                      ? numberWithCommas(center[header.value])
                      : center[header.value]
                    : '-'
                }}
              </p>
            </td>
          </tr>

          <tr :style="{ position: 'sticky', bottom: 0, background: ' #FFECBA' }">
            <td v-for="header in listTable" :key="header.value">
              <p v-if="header.value === 'location'">Total</p>
              <p :style="{ textAlign: header.isMoney ? 'right' : 'center' }" v-else>
                {{ calTotal(header) }}
              </p>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:foot="{}"> </template>
    </v-data-table>
    <TargetTable
      v-if="dialog"
      :dialog="dialog"
      @setLog="setLog"
      :idUp="activityID"
      @callData="getReport()"
      :code="activityList.find(e => e.activityID === activityID).activityCode"
      :target="activityListReport"
    />
  </div>
</template>

<script>
import { activities } from '@/api/activities'
import { center_managerment } from '@/api/center-management'
import TargetTable from './TargetTable.vue'

export default {
  components: { TargetTable },
  data() {
    return {
      listHidden: [],
      activityID: null,
      dialog: false,
      activityList: [],
      locationListAll: [],
      headers: [
        { text: 'Center', value: 'location', bgColor: '#0B2585', children: [] },
        {
          text: 'Target',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'targetNum', bgColor: '#0B2585' },
            { text: 'Value', value: 'targetValue', bgColor: '#0B2585', isMoney: true },
          ],
        },
        {
          text: 'Actual',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'actualNum', bgColor: '#0B2585' },
            { text: 'Value', value: 'actualValue', bgColor: '#0B2585', isMoney: true },
          ],
        },
        {
          text: ' Actual/ Target rate',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'numRate', bgColor: '#0B2585', isPer: true },
            { text: 'Value', value: 'valueRate', bgColor: '#0B2585', isPer: true },
          ],
        },
        {
          text: 'Registration status',
          bgColor: '#0B2585',
          children: [
            { text: 'Registered', value: 'potentialNum', bgColor: '#0B2585' },
            { text: 'Potential', value: 'registeredNum', bgColor: '#0B2585' },
            { text: 'No response', value: 'noResponse', bgColor: '#0B2585' },
          ],
        },
        {
          text: 'Advance paid',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'advanceNum', bgColor: '#0B2585' },
            { text: 'Value', value: 'advanceValue', bgColor: '#0B2585', isMoney: true },
          ],
        },
        {
          text: 'Full paid',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'fullNum', bgColor: '#0B2585' },
            { text: 'Value', value: 'fullValue', bgColor: '#0B2585', isMoney: true },
          ],
        },
      ],
      activityListReport: [],
      saleListSup: [],
      totalSale: [],
      grandTotal: { totalCenRecCom: 0 },
    }
  },
  setup() {
    return {}
  },

  created() {
    this.getReport()
    this.getAllLotation()
    this.getListActivity()
  },
  props: {
    locationID: {},
    date: {},
    errorDate: {},
  },
  watch: {
    locationListAll: function () {
      this.getListActivity()
    },
    listHidden: () => {},
    activityID: function () {
      localStorage.setItem('acitvityIDReport', JSON.stringify(this.activityID))
      this.getReport()
      this.init()
    },
    date: function () {
      this.init()
    },
    errorDate: function () {
      this.init()
    },
  },

  methods: {
    async getAllLotation() {
      this.loadingLocation = true

      await center_managerment
        .getAllCenter()
        .then(res => {
          this.locationListAll = res
          this.loadingLocation = false
        })
        .catch(() => {
          this.locationListAll = []
          this.loadingLocation = false
        })
    },
    async getListActivity() {
      this.loadingActivity = true
      if (this.locationListAll.length !== 0) {
        const stringSearch = this.locationListAll.map(e => e.locationID)?.join(',')
        await activities
          .getListActivitiesSearch(stringSearch)
          .then(res => {
            this.activityList = res
            this.activityID = res.length !== 0 ? res[0].activityID : null
            if (localStorage.getItem('``1aw2se2s2``')) {
              this.activityID = JSON.parse(localStorage.getItem('acitvityIDReport'))
            }
            this.loadingActivity = false
          })
          .catch(() => {
            // this.activityList = []
            this.activityID = 0
            this.loadingActivity = false
          })
      }
    },
    async getReport() {
      this.loading = true
      await activities
        .getListTarget(this.activityID)
        .then(res => {
          this.loading = false
          this.activityListReport = res
        })
        .catch(() => {
          this.loading = false
        })
    },
    calTotal(header) {
      let total = this.activityListReport.reduce(function (total, value) {
        return (
          total +
          (value[header.value] && !isNaN(value[header.value]) ? parseFloat(value[header.value]) : 0)
        )
      }, 0)

      total = header.isMoney ? this.numberWithCommas(total) : total
      return header.isPer ? (total / this.activityListReport.length).toFixed(1) + ' %' : total
    },
    setLog(value) {
      this.dialog = value
    },
    changeHiddenSup(subItem) {
      if (this.listHidden.includes(subItem)) {
        this.listHidden = this.listHidden.filter(function (item) {
          return item !== subItem
        })
      } else {
        this.listHidden = [...this.listHidden, subItem]
      }
    },
    numberWithCommas(number) {
      var parts = parseInt(number).toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return number && parts.join(',')
    },
    findSupervisorInList(subList, staff) {
      return subList.find(sub => sub.supID === staff.managerCounselorID)
    },
  },
}
</script>

<style lang="scss" scoped>
.header-report-activity th {
  border: '1px solid #ffff';
  text-align: center !important;
  color: #ffffff !important;
}
.w-150 {
  width: 50px;
}
.sale-byqcec {
  margin-top: 28px;
}
.row-sale:nth-of-type(odd) {
  background: #bde6fbb0;
}
tbody tr:nth-of-type(even) {
  background: #d1eeff;
}
</style>
