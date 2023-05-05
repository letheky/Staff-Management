<template>
  <div id="book-inventory-i-o">
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <v-row> </v-row>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            v-if="!isLoading"
            :headers="headers"
            :items="filtered.data"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-header
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            fixed-header
            height="60vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th :style="{ background: '#0b2585' }" rowspan="2">Product code</th>
                  <th :style="{ background: '#0b2585' }" rowspan="2" :class="'th-2'">
                    Description
                  </th>
                  <th :style="{ background: '#0b2585' }" rowspan="2">Unit</th>
                  <th :style="{ background: '#0b2585' }" colspan="2">Beginning</th>
                  <th :style="{ background: '#0b2585' }" colspan="2">Input</th>
                  <th :style="{ background: '#0b2585' }" colspan="2">Output</th>
                  <th :style="{ background: '#0b2585' }" colspan="2">Ending</th>
                  <th :style="{ background: '#0b2585' }" rowspan="2">User Create</th>
                </tr>
                <tr>
                  <th :style="{ background: '#0b2585' }">Quantity</th>
                  <th :style="{ background: '#0b2585' }">Amount</th>
                  <th :style="{ background: '#0b2585' }">Quantity</th>
                  <th :style="{ background: '#0b2585' }">Amount</th>
                  <th :style="{ background: '#0b2585' }">Quantity</th>
                  <th :style="{ background: '#0b2585' }">Amount</th>
                  <th :style="{ background: '#0b2585' }">Quantity</th>
                  <th :style="{ background: '#0b2585' }">Amount</th>
                </tr>
              </thead>
              <tr class="fixed-row-filter">
                <th v-for="header in props.headers" class="select-book abc" :key="header.text">
                  <div v-if="filters.hasOwnProperty(header.value)">
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
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.productCode }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.bgQuantity === 0 ? '-' : item.bgQuantity }}</td>
                  <td align="right">
                    {{ item.bgAmount === 0 ? '-' : item.bgAmount.toLocaleString() }}
                  </td>
                  <td>{{ item.ipQuantity === 0 ? '-' : item.ipQuantity }}</td>
                  <td align="right">
                    {{ item.ipAmount === 0 ? '-' : item.ipAmount.toLocaleString() }}
                  </td>
                  <td>{{ item.outQuantity === 0 ? '-' : item.outQuantity }}</td>
                  <td align="right">
                    {{ item.outAmount === 0 ? '-' : item.outAmount.toLocaleString() }}
                  </td>
                  <td>{{ item.endQuantity === 0 ? '-' : item.endQuantity }}</td>
                  <td align="right">
                    {{ item.endAmount === 0 ? '-' : item.endAmount.toLocaleString() }}
                  </td>
                  <td>{{ item.userCreate }}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td>Grand total</td>
                  <td></td>
                  <td></td>
                  <td>{{ filtered.total.bgQuantity }}</td>
                  <td align="right">
                    {{ filtered.total.bgAmount.toLocaleString() }}
                  </td>
                  <td>{{ filtered.total.ipQuantity }}</td>
                  <td align="right">
                    {{ filtered.total.ipAmount.toLocaleString() }}
                  </td>
                  <td>{{ filtered.total.outQuantity }}</td>
                  <td align="right">
                    {{ filtered.total.outAmount.toLocaleString() }}
                  </td>
                  <td>{{ filtered.total.endQuantity }}</td>
                  <td align="right">
                    {{ filtered.total.endAmount.toLocaleString() }}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" class="w-100 fix pl-10 pr-10 footer">
      <v-row>
        <v-col md="2">
          <v-select
            outlined
            hide-details
            dense
            :value="itemsPerPage"
            :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)"
            style="height: 32px"
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end"> </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            elevation="0"
            :total-visible="7"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { book_management } from '@/api/book_management.js'
// import Multiselect from "vue-multiselect";
import Autocomplete from '@/components/Utils/Autocomplete.vue'

import dayjs from 'dayjs'

export default {
  components: {
    // Multiselect,
    Autocomplete,
  },
  data() {
    return {
      isLoading: false,
      page: 1,
      // searchInput: null,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          value: 'productCode',
          sortable: false,
        },
        {
          value: 'description',
          width: '12%',
          sortable: false,
        },

        {
          text: 'unit',
          value: 'unit',
          sortable: false,
        },
        {
          text: 'bgQuantity',
          value: 'bgQuantity',
          sortable: false,
        },
        {
          text: 'bgAmount',
          value: 'bgAmount',
          width: '15%',
          sortable: false,
          align: 'right',
        },
        {
          text: 'ipQuantity',
          value: 'ipQuantity',
          sortable: false,
        },
        {
          text: 'ipAmount',
          value: 'ipAmount',
          align: 'right',
          sortable: false,
        },
        {
          text: 'outQuantity',
          value: 'outQuantity',

          sortable: false,
        },
        {
          text: 'outAmount',
          value: 'outAmount',

          sortable: false,
        },
        {
          text: 'endQuantity',
          value: 'endQuantity',

          sortable: false,
        },
        {
          text: 'endAmount',
          value: 'endAmount',

          sortable: false,
        },
        {
          text: 'userCreate',
          value: 'userCreate',

          sortable: false,
          prent: false,
        },

        //{ text: "Action", value: "action", width: "7%", sortable: false },
      ],
      classList: [],
      filters: {
        productCode: [],
        userCreate: [],

        unit: [],
        description: [],
      },
      totalData: {
        endAmount: 0,
        endQuantity: 0,
        outAmount: 0,
        outQuantity: 0,
        ipAmount: 0,
        ipQuantity: 0,
        bgAmount: 0,
        bgQuantity: 0,
      },
    }
  },

  props: ['location', 'listLocation', 'month', 'year'],
  computed: {
    filtered() {
      let newTotalData = {
        endAmount: 0,
        endQuantity: 0,
        outAmount: 0,
        outQuantity: 0,
        ipAmount: 0,
        ipQuantity: 0,
        bgAmount: 0,
        bgQuantity: 0,
        unit: 0,
      }
      const listReport = this.classList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
      listReport.forEach(element => {
        newTotalData.endAmount = newTotalData.endAmount + element.endAmount
        newTotalData.endQuantity = newTotalData.endQuantity + element.endQuantity
        newTotalData.outAmount = newTotalData.outAmount + element.outAmount
        newTotalData.outQuantity = newTotalData.outQuantity + element.outQuantity
        newTotalData.ipAmount = newTotalData.ipAmount + element.ipAmount
        newTotalData.ipQuantity = newTotalData.ipQuantity + element.ipQuantity
        newTotalData.bgAmount = newTotalData.bgAmount + element.bgAmount
        newTotalData.bgQuantity = newTotalData.bgQuantity + element.bgQuantity
      })

      return { data: listReport, total: newTotalData }
    },
  },
  created() {
    this.init()
  },
  watch: {
    filters: function () {},
    listLocation: function () {
      this.init()
    },
    location: function () {
      this.init()
    },
    month: function () {
      this.init()
    },
    year: function () {
      this.init()
    },
    // searchInput: function (newSearch) {
    //   if
    //   this.searchInput = newSearch
    // }
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    async init() {
      this.isLoading = true
      this.isChangeDateField = false
      this.classList = []

      if (this.listLocation.length !== 0) {
        await book_management
          .getBookInventory(this.getLocationId(), this.month, this.year)
          .then(res => {
            if (res) {
              res.forEach(x => {
                this.classList.push({
                  productCode: x.productCode,
                  description: x.description,
                  unit: x.unit === 'Bộ' ? 'Bộ' : x.unit,
                  bgQuantity: x.begQty,
                  bgAmount: x.begAmt,
                  ipQuantity: x.iiCaQty,
                  ipAmount: x.iiCaAmt,
                  outQuantity: x.iiCaQty,
                  outAmount: x.adjCrAmt,
                  endQuantity: x.endQty,
                  endAmount: x.endAmt,
                  userCreate: '',
                })
              })

              this.isChooseDate = false
              this.isLoading = false
            } else {
              this.errorDialog = true
            }
          })
          .catch(() => {
            this.errorDialog = true
          })
      }
    },
    getLocationId() {
      return this.location
    },
    groupColumnValueList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    searchInput() {},
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.classList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1 && element === 'D1EX1') {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.classList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1 && element === 'D1EX1') {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    back() {
      window.history.back()
    },

    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
fieldset {
  display: none;
}

.select-book {
  padding: 0 !important;
}

.select-book * {
  margin: 0 !important;
}

#book-inventory-i-o {
  margin-top: 35px;
}

.select-item {
  height: 35px;
}

tfoot tr td {
  border: none !important;
  color: #000;
  background: #9e9e9e;
}

table {
  border-collapse: collapse;
}

.table-data {
  max-height: 70vh;
  overflow: scroll;
}

.th-2 {
  width: 400px;
}

.v-data-table-header tr:nth-of-type(1) th {
  background: #0b2585;
  color: #ffff;
}

.v-data-table-header tr:nth-of-type(2) th {
  background: #0b2585;
}

td,
th {
  border: 1px solid !important;
}

.v-data-table-header {
  position: relative;
  position: sticky;
  top: 0;
}

.v-data-table-header::before {
  content: '';
  top: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dae3e8;
}

tbody tr:nth-child(even) {
  background: #bde6fb;
}

thead tr th {
  position: -webkit-sticky;
  position: sticky;
  text-align: center !important;
  border: 1px solid #dae3e8;
  // background: #f8fafb;
}

th {
  z-index: 10000;
}

td,
th {
  border: 1px solid #dae3e8 !important;
  padding: 5px 20px;
  // text-align: left;
}

.v-data-table-header::before {
  content: '';
  top: 0;
  z-index: 1;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dae3e8;
}

.footer {
  padding: 0 !important;
  margin-top: 20px;
}

tfoot {
  position: sticky;
  bottom: 0;
}

.spendingTable tbody tr:nth-child(odd) {
  background-color: #bde6fbb0;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: #ffff;
  font-weight: 100;
}
</style>
