<template>
  <div :class="'sale-byqcec'">
    <v-data-table
      :headers="listForTable"
      :items="saleListQc"
      hide-default-header
      hide-default-footer
      class="elevation-0 table-sale-byqcec"
      fixed-header
      max-height="60vh"
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
        <tbody>
          <tr class="row-sale" v-for="(itemSale, index) in saleListQc" :key="index">
            <td>
              {{ itemSale.counselorName }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{ itemSale.perNSTarget === 0 ? '-' : numberWithCommas(itemSale.perNSTarget) }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{ itemSale.perNSAmount === 0 ? '-' : numberWithCommas(itemSale.perNSAmount) }}
            </td>
            <td>
              {{
                itemSale.perPctSalesRate.toFixed(2) === 0
                  ? '-'
                  : itemSale.perPctSalesRate.toFixed(2) + ' %'
              }}
            </td>
            <td>
              {{ itemSale.perQtyTarget === 0 ? '-' : itemSale.perQtyTarget }}
            </td>
            <td>
              {{ itemSale.perNbrStu === 0 ? '-' : itemSale.perNbrStu }}
            </td>
            <td>
              {{
                itemSale.perPctQTyRate === 0
                  ? '-'
                  : numberWithCommas(itemSale.perPctQTyRate.toFixed(2)) + ' %'
              }}
            </td>
            <td>
              {{ itemSale.perComCalRate === 0 ? '-' : numberWithCommas(itemSale.perComCalRate) }}
            </td>
            <td>
              {{ itemSale.perComRate === 0 ? '-' : numberWithCommas(itemSale.perComRate) }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{ itemSale.cenTargetSales === 0 ? '-' : numberWithCommas(itemSale.cenTargetSales) }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{ itemSale.cenActualSales === 0 ? '-' : numberWithCommas(itemSale.cenActualSales) }}
            </td>
            <td>
              {{ itemSale.cenSalesRate === 0 ? '-' : itemSale.cenSalesRate.toFixed(2) + ' %' }}
            </td>
            <td>
              {{ itemSale.cenTargetQty === 0 ? '-' : itemSale.cenTargetQty }}
            </td>
            <td>
              {{ itemSale.cenActualQty === 0 ? '-' : itemSale.cenActualQty }}
            </td>
            <td>
              {{ itemSale.cenPerQtyRate === 0 ? '-' : itemSale.cenPerQtyRate.toFixed(2) + ' %' }}
            </td>
            <td>
              {{
                itemSale.cenComRate === 0 ? '-' : numberWithCommas(parseInt(itemSale.cenComRate))
              }}
            </td>
            <td>
              {{ itemSale.cenComCalRate === 0 ? '-' : numberWithCommas(itemSale.cenComCalRate) }}
            </td>

            <td>
              {{ itemSale.cenOrigCom === 0 ? '-' : numberWithCommas(itemSale.cenOrigCom) }}
            </td>
            <td>
              {{ itemSale.cenRecCom === 0 ? '-' : numberWithCommas(itemSale.cenRecCom) }}
            </td>
          </tr>
          <!-- <tr :style="{ background: '#FFDB7E' }">
              <td >l - Front Office</td>
  
              <td
                :style="{ textAlign: 'right' }"
            
              >
                {{ numberWithCommas(subItem.totalPerNSTarget) }}
              </td>
              <td
                :style="{ textAlign: 'right' }"
            
              >
                {{ numberWithCommas(subItem.totalPerNSAmount) }}
              </td>
              <td>
                {{ (subItem.perPctSalesRate / subItem.dataSale.length).toFixed(2) }} %
              </td>
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
            </tr> -->
          <tr :style="{ position: 'sticky', bottom: 0, background: ' rgb(255, 83, 89)' }">
            <td>Grand Total</td>
            <td :style="{ textAlign: 'right' }">
              {{ totalSale.perNSTarget === 0 ? '-' : numberWithCommas(totalSale.perNSTarget) }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{ totalSale.perNSAmount === 0 ? '-' : numberWithCommas(totalSale.perNSAmount) }}
            </td>
            <td></td>
            <td>
              {{ totalSale.perQtyTarget === 0 ? '-' : totalSale.perQtyTarget }}
            </td>
            <td>
              {{ totalSale.perNbrStu === 0 ? '-' : totalSale.perNbrStu }}
            </td>
            <td></td>
            <td>
              {{ totalSale.perComCalRate === 0 ? '-' : numberWithCommas(totalSale.perComCalRate) }}
            </td>
            <td>
              {{ totalSale.perComRate === 0 ? '-' : numberWithCommas(totalSale.perComRate) }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{
                totalSale.cenTargetSales === 0 ? '-' : numberWithCommas(totalSale.cenTargetSales)
              }}
            </td>
            <td :style="{ textAlign: 'right' }">
              {{
                totalSale.cenActualSales === 0 ? '-' : numberWithCommas(totalSale.cenActualSales)
              }}
            </td>
            <td></td>
            <td>
              {{ totalSale.cenTargetQty === 0 ? '-' : totalSale.cenTargetQty }}
            </td>
            <td>
              {{ totalSale.cenActualQty === 0 ? '-' : totalSale.cenActualQty }}
            </td>
            <td></td>
            <td>
              {{ totalSale.cenComRate === 0 ? '-' : numberWithCommas(totalSale.cenComRate) }}
            </td>
            <td>
              {{ totalSale.cenComCalRate === 0 ? '-' : numberWithCommas(totalSale.cenComCalRate) }}
            </td>

            <td>
              {{ totalSale.cenOrigCom === 0 ? '-' : numberWithCommas(totalSale.cenOrigCom) }}
            </td>
            <td>
              {{ totalSale.cenRecCom === 0 ? '-' : numberWithCommas(totalSale.cenRecCom) }}
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:foot="{}"> </template>
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
            { text: 'Commission calculationrate ', bgColor: '#FFCF53' },
          ],
        },
        { text: 'Original commission', bgColor: '#F6B91A', children: [] },
        { text: 'Received commission', bgColor: '#F6B91A', children: [] },
      ],
      saleListQc: [],
      saleListSup: [],
      totalSale: [],
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
    async init() {
      if (!this.errorDate) {
        const dateToArray = this.date.split('-')
        await sale_report
          .getSaleReportByEQC(this.locationID, dateToArray[1], dateToArray[0])
          .then(res => {
            const listQc = res.filter(item => item.position === 'QC')
            //   let listOfficAndSup = res.filter(item => item.position !== 'QC')
            this.saleListQc = listQc
            let totalSale = {
              perNSTarget: 0,
              perNSAmount: 0,

              perQtyTarget: 0,
              perNbrStu: 0,
              perComRate: 0,
              perComCalRate: 0,
              cenTargetSales: 0,
              cenActualSales: 0,
              cenTargetQty: 0,
              cenActualQty: 0,
              cenComRate: 0,
              cenComCalRate: 0,
              cenOrigCom: 0,
              cenRecCom: 0,
            }
            listQc.forEach(re => {
              totalSale.perNSTarget += re.perNSTarget
              totalSale.perNSAmount += re.perQtyTarget

              totalSale.perQtyTarget += re.perQtyTarget
              totalSale.perNbrStu += re.perNbrStu
              totalSale.perComRate += re.perComRate
              totalSale.perComCalRate += re.perComCalRate
              totalSale.cenTargetSales += re.cenTargetSales
              totalSale.cenActualSales += re.cenActualSales
              totalSale.cenTargetQty += re.cenTargetQty
              totalSale.cenActualQty += re.cenActualQty
              totalSale.cenComRate += parseInt(re.cenComRate)
              totalSale.cenComCalRate += re.cenComCalRate
              totalSale.cenOrigCom += re.cenOrigCom
              totalSale.cenRecCom += re.cenRecCom
            })
            this.totalSale = totalSale
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
.sale-byqcec {
  margin-top: 28px;
}
.row-sale:nth-of-type(odd) {
  background: #bde6fbb0;
}
</style>
