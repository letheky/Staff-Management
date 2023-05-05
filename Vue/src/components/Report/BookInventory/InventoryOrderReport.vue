<template>
  <div id="book-inventory-i-o">
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <v-row> </v-row>
          <!-- <v-progress-linear v-if="isLoading" indeterminate color="primary" class="my-10"></v-progress-linear> -->
          <v-data-table
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
                  <th>Product code</th>
                  <th :class="'th-2'">Description</th>
                  <th>Unit</th>
                  <th>Input price</th>
                  <th>Total Order Quantity</th>
                  <th>Actual Order Quantity</th>
                  <th>Received Quantity</th>
                  <th>Return Quantity</th>
                  <th>Remain Quantity</th>
                </tr>

                <tr class="fixed-row-filter">
                  <th v-for="header in props.headers" class="select-book" :key="header.text">
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
              </thead>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.productCode }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.unit }}</td>
                  <td></td>
                  <td>{{ item.totQtyOrd === 0 ? '-' : item.totQtyOrd }}</td>
                  <td>{{ item.actualQty === 0 ? '-' : item.actualQty }}</td>
                  <td>{{ item.qtyRcvd === 0 ? '-' : item.qtyRcvd }}</td>
                  <td>{{ item.qtyReturned === 0 ? '-' : item.qtyReturned }}</td>
                  <td>{{ item.quantityRemain === 0 ? '-' : item.quantityRemain }}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td>Grand total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{ filtered.total.totQtyOrd }}</td>
                  <td>{{ filtered.total.actualQty }}</td>
                  <td>{{ filtered.total.qtyRcvd }}</td>
                  <td>{{ filtered.total.qtyReturned }}</td>

                  <td>{{ filtered.total.quantityRemain }}</td>
                </tr>
              </tfoot>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" :class="'w-100 fix pl-10 pr-10 footer'">
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
          text: 'Input price',
          value: 'iprice',
          sortable: false,
        },
        {
          text: 'Total Order quantity',
          value: ' totQtyOrd',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Actual Order Quantity',
          value: 'actualQty',
          sortable: false,
        },
        {
          text: 'Received quantity',
          value: 'qtyRcvd',
          sortable: false,
        },
        {
          text: 'Return Quantity',
          value: 'qtyReturned',

          sortable: false,
        },
        {
          text: 'Remain Quantity',
          value: 'quantityRemain',
          sortable: false,
        },
      ],
      bookList: [],
      filters: {
        productCode: [],
        unit: [],
        description: [],
      },
      totalData: {
        totQtyOrd: 0,
        actualQty: 0,
        qtyRcvd: 0,
        qtyReturned: 0,
        quantityRemain: 0,
      },
    }
  },

  props: ['location', 'listLocation', 'month', 'year'],
  computed: {
    filtered() {
      let newTotalData = {
        totQtyOrd: 0,
        actualQty: 0,
        qtyRcvd: 0,
        qtyReturned: 0,
        quantityRemain: 0,
      }
      const listReport = this.bookList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
      listReport.forEach(element => {
        newTotalData.actualQty = newTotalData.actualQty + element.actualQty
        newTotalData.qtyRcvd = newTotalData.qtyRcvd + element.qtyRcvd
        newTotalData.qtyReturned = newTotalData.qtyReturned + element.qtyReturned
        newTotalData.totQtyOrd = newTotalData.totQtyOrd + element.totQtyOrd
        newTotalData.quantityRemain = newTotalData.quantityRemain + element.quantityRemain
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
      this.bookList = []

      if (this.listLocation.length !== 0) {
        let fromDate = this.year + '-' + this.month + '-01'
        let toDate =
          this.year + '-' + this.month + '-' + new Date(this.year, this.month, 0).getDate()
        await book_management
          .getInvtOrderByCenter(this.getLocationId(), fromDate, toDate)
          .then(res => {
            if (res) {
              res.forEach(x => {
                this.bookList.push({
                  productCode: x.productCode,

                  totQtyOrd: x.totQtyOrd,
                  actualQty: x.actualQty,
                  qtyRcvd: x.qtyRcvd,
                  qtyReturned: x.qtyReturned,
                  unit: x.unit === 'Bộ' ? 'Bộ' : x.unit,
                  description: x.description,

                  quantityRemain: x.actualQty - x.qtyRcvd,
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
      return this.bookList.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.bookList
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
          this.filters[value] = this.bookList
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
  background-color: #ffff !important;
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
}

.v-data-table-header tr:nth-of-type(2) th {
  background: #f8fafb;
}

td,
th {
  border: 1px solid !important;
  text-align: center !important;
}

.v-data-table-header {
  position: relative;
  position: sticky;
  top: 0;
}

.v-data-table-header::before {
  content: '';
  top: 0;
  left: 0;
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
  background: #f8fafb;
}

th {
  z-index: 10000;
}

td,
th {
  border: 1px solid #dae3e8 !important;
  padding: 5px 20px;
  text-align: left !important;
}

.footer {
  padding: 0 !important;
  margin-top: 20px;
}

tfoot {
  position: sticky;
  bottom: 0;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: #ffff;
  font-weight: 100;
}
</style>
