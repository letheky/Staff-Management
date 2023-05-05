<template>
  <div :class="'sale-byqcec'">
    <v-data-table
      :headers="listForTable"
      :items="saleListSup"
      hide-default-header
      hide-default-footer
      class="elevation-0 table-sale-byqcec"
      fixed-header
      max-height="70vh"
    >
      <template v-slot:header="{}">
        <thead class="header-table-sale-byqcec">
          <tr>
            <th
              v-for="(header, index) in headers"
              :style="{ background: header.bgColor, color: '#000 !important' }"
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
                :style="{ background: headerChild.bgColor, color: '#000 !important' }"
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
        <tbody v-for="(subItem, index) in saleListSup" :key="index">
          <tr :style="{ background: '#D9E6FF' }">
            <td @click="changeHiddenSup(subItem.supName)" class="row-sup">
              <div :class="'d-flex align-center'">
                <span :style="{ width: '200px', background: '#D9E6FF', cursor: 'pointer' }">{{
                  subItem.supName
                }}</span>
                <v-icon :style="{ cursor: 'pointer' }" large
                  >{{
                    listHidden.includes(subItem.supName) ? 'mdi-chevron-down' : 'mdi-chevron-right'
                  }}
                </v-icon>
              </div>
            </td>
            <td :style="{ textAlign: 'right' }">
              {{ numberWithCommas(subItem.inforSup.perNSTarget) }}
            </td>
            <td :style="{ textAlign: 'right' }">{{ subItem.inforSup.perNSAmount }}</td>
            <td>{{ subItem.inforSup.perPctSalesRate.toFixed(2) }} %</td>
            <td v-for="(i, index) in 14" :key="index"></td>
            <td>{{ numberWithCommas(subItem.inforSup.cenRecCom) }}</td>
          </tr>
          <tr class="row-sale" v-for="(itemSale, index) in subItem.dataSale" :key="index">
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.counselorName }}
            </td>
            <td
              :style="{ textAlign: 'right' }"
              v-if="listHidden.includes(subItem.supName) === true"
            >
              {{ numberWithCommas(itemSale.perNSTarget) }}
            </td>
            <td
              :style="{ textAlign: 'right' }"
              v-if="listHidden.includes(subItem.supName) === true"
            >
              {{ numberWithCommas(itemSale.perNSAmount) }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.perPctSalesRate.toFixed(2) }} %
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.perQtyTarget }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.perNbrStu }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.perPctQTyRate.toFixed(2)) }} %
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.perComCalRate) }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.perComRate) }}
            </td>
            <td
              :style="{ textAlign: 'right' }"
              v-if="listHidden.includes(subItem.supName) === true"
            >
              {{ numberWithCommas(itemSale.cenTargetSales) }}
            </td>
            <td
              :style="{ textAlign: 'right' }"
              v-if="listHidden.includes(subItem.supName) === true"
            >
              {{ numberWithCommas(itemSale.cenActualSales) }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.cenSalesRate.toFixed(2) }} %
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.cenTargetQty }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.cenActualQty }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ itemSale.cenPerQtyRate.toFixed(2) }} %
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.cenComRate) }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.cenComCalRate) }}
            </td>

            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.cenOrigCom) }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(itemSale.cenRecCom) }}
            </td>
          </tr>
          <tr :style="{ background: '#FFDB7E' }">
            <td v-if="listHidden.includes(subItem.supName)">Sub total - Front Office</td>

            <td
              :style="{ textAlign: 'right' }"
              v-if="listHidden.includes(subItem.supName) === true"
            >
              {{ numberWithCommas(subItem.totalPerNSTarget - subItem.inforSup.perNSTarget) }}
            </td>
            <td
              :style="{ textAlign: 'right' }"
              v-if="listHidden.includes(subItem.supName) === true"
            >
              {{ numberWithCommas(subItem.totalPerNSAmount) }}
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ (subItem.perPctSalesRate / subItem.dataSale.length).toFixed(2) }} %
            </td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true"></td>
            <td v-if="listHidden.includes(subItem.supName) === true">
              {{ numberWithCommas(subItem.totalCenRecCom) }}
            </td>
          </tr>

          <tr :style="{ background: '#FF5359' }">
            <td>Grand Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              {{ numberWithCommas(grandTotal.totalCenRecCom) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { sale_report } from '@/api/sale-report'

export default {
  data() {
    return {
      listHidden: [],
      listForTable: [
        { text: 'Staff name', value: 'counselorName' },
        { text: 'Target sale', bgColor: '#FDE9D9', value: 'perNSTarget' },
        { text: 'Actual value', bgColor: '#FDE9D9', value: 'perNSAmount' },
        { text: 'Sale rate', bgColor: '#FDE9D9', value: 'perPctSalesRate' },
        { text: 'Target quantity', bgColor: '#FBD4B4', value: 'perQtyTarget' },
        { text: 'Actual quantity', bgColor: '#FBD4B4', value: 'perNbrStu' },
        { text: 'Quantity rate', bgColor: '#FBD4B4', value: 'perPctQTyRate' },
        { text: 'Personal commission rate', bgColor: '#FFCF53', value: 'perComRate' },
        { text: 'Commission calculation rate ', bgColor: '#FFCF53', value: 'perComCalRate' },
        { text: 'Central commission rate', bgColor: '#84BBFF' },
        { text: 'Target sale', bgColor: '#D9EAFF' },
        { text: 'Actual value', bgColor: '#D9EAFF' },
        { text: 'Sale rate', bgColor: '#D9EAFF' },
        { text: 'Target quantity', bgColor: '#B9D9FF' },
        { text: 'Actual quantity', bgColor: '#B9D9FF' },
        { text: 'Quantity rate', bgColor: '#B9D9FF' },
        { text: 'Personal commission rate', bgColor: '#FFCF53' },
        { text: 'Commission calculation rate ', bgColor: '#FFCF53' },
        { text: 'Original commission', bgColor: '#F6B91A', children: [] },
        { text: 'Received commission', bgColor: '#F6B91A', children: [] },
      ],
      headers: [
        { text: 'Staff name', value: 'counselorName', bgColor: '#DAE3E8', children: [] },
        {
          text: 'Personal commission rate',
          bgColor: '#FBD4B4',
          children: [
            { text: 'Target sale', bgColor: '#FDE9D9' },
            { text: 'Actual value', bgColor: '#FDE9D9' },
            { text: 'Sale rate', bgColor: '#FDE9D9', isFixW: true },
            { text: 'Target quantity', bgColor: '#FBD4B4' },
            { text: 'Actual quantity', bgColor: '#FBD4B4' },
            { text: 'Quantity rate', bgColor: '#FBD4B4' },
            { text: 'Personal commission rate', bgColor: '#FFCF53' },
            { text: 'Commission calculation rate ', bgColor: '#FFCF53' },
          ],
        },  
        {
          text: 'Central commission rate',
          bgColor: '#84BBFF',
          children: [
            { text: 'Target sale', bgColor: '#D9EAFF' },
            { text: 'Actual value', bgColor: '#D9EAFF' },
            { text: 'Sale rate', bgColor: '#D9EAFF', isFixW: true },
            { text: 'Target quantity', bgColor: '#B9D9FF' },
            { text: 'Actual quantity', bgColor: '#B9D9FF' },
            { text: 'Quantity rate', bgColor: '#B9D9FF' },
            { text: 'Personal commission rate', bgColor: '#FFCF53' },
            { text: 'Commission calculation rate ', bgColor: '#FFCF53' },
          ],
        },
        { text: 'Original commission', bgColor: '#F6B91A', children: [] },
        { text: 'Received commission', bgColor: '#F6B91A', children: [] },
      ],
      saleListQc: [],
      saleListSup: [],
      grandTotal: { totalCenRecCom: 0 },
    }
  },
  setup() {
    return {}
  },

  created() {
    this.init()
  },
  props: {
    locationID: {},
    date: {},
    errorDate: {},
  },
  watch: {
    listHidden: () => {},
    locationID: function () {
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
      return parts.join(',')
    },
    findSupervisorInList(subList, staff) {
      return subList.find(sub => sub.supID === staff.managerCounselorID)
    },
    groupColByStaff(data) {
      let supervisorList = []
      data.forEach(element => {
        if (element.isSup === 'Y') {
          this.grandTotal.totalCenRecCom += element.cenRecCom
          supervisorList.push({
            supID: element.counselorID,
            supName: element.counselorName,
            inforSup: element,
            totalCenActualSales: element.cenActualSales,
            totalPerNSTarget: element.perNSTarget,
            totalPerNSAmount: element.perNSAmount,
            perPctSalesRate: element.perPctSalesRate,
            totalCenRecCom: element.cenRecCom,
            dataSale: [],
          })
        }
      })
      data.forEach(staff => {
        if (staff.isSup !== 'Y') {
          this.grandTotal.totalCenRecCom += staff.cenRecCom
          let supervisor = this.findSupervisorInList(supervisorList, staff)
          if (!supervisor) {
            let sub1 = supervisorList.find(sub => sub.supID === -1)
            if (sub1) supervisor = sub1
            else {
              supervisor = {
                supID: -1,
                supName: 'Unknow Supervisor',
                totalPerNSTarget: 0,
                totalPerNSAmount: 0,
                perPctSalesRate: 0,
                totalCenActualSales: 0,
                totalCenRecCom: 0,
                dataSale: [],
              }
              supervisorList.push(supervisor)
            }
          }
          supervisor.totalPerNSTarget += staff?.perNSTarget
          supervisor.totalPerNSAmount += staff?.perNSAmount
          supervisor.perPctSalesRate += staff?.perPctSalesRate
          supervisor.totalCenActualSales += staff?.cenActualSales
          supervisor.totalCenRecCom += staff?.cenRecCom
          supervisor.dataSale = [...supervisor.dataSale, staff]
        }
      })
      return supervisorList
    },
    async init() {
      if (!this.errorDate) {
        const dateToArray = this.date.split('-')
        await sale_report
          .getSaleReportByEQC(this.locationID, dateToArray[1], dateToArray[0])
          .then(res => {
            const listQc = res.filter(item => item.position === 'QC')
            let listOfficAndSup = res.filter(item => item.position !== 'QC')
            this.saleListQc = listQc
            this.saleListSup = this.groupColByStaff(listOfficAndSup)
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header-table-sale-byqcec th {
  text-align: center !important;
  color: #000 !important;
}
.w-150 {
  width: 50px;
}
.row-sale:nth-of-type(odd) {
  background: #bde6fbb0;
}
.sale-byqcec {
  margin-top: 28px;
}
</style>
