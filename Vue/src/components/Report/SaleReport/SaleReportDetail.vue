<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filtered"
      :items-per-page="2222222222222222222222"
      hide-default-header
      hide-default-footer
      class="elevation-0 table-sale-byqcec mt-5"
      fixed-header
      max-height="70vh"
    >
      <template v-slot:header="{ props }">
        <thead>
          <tr>
            <th v-for="(header, index) in props.headers" :key="index">
              <p>{{ header.text }}</p>
            </th>
          </tr>
        </thead>
        <tr class="fixed-row-filter">
          <th v-for="header in props.headers" :key="header.text">
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
      <template v-slot:item="{ item }">
        <tr class="row-sale">
          <td
            :class="header.value === 'classCode' && 'link'"
            @click="header.value === 'classCode' && viewDetailClass(item.classID)"
            :style="{ textAlign: header.align }"
            v-for="(header, index) in headers"
            :key="index"
          >
            {{
              header.isMoney === true ? numberWithCommas(item[header.value]) : item[header.value]
            }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { sale_report } from '@/api/sale-report'
import Autocomplete from '@/components/Utils/Autocomplete.vue'

export default {
  components: { Autocomplete },
  computed: {
    filtered() {
      return this.saleList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  data() {
    return {
      saleList: [],
      headers: [
        {
          text: 'Counselor Name',
          value: 'counselorName',
          align: 'left',
          isMoney: false,
        },
        {
          text: 'Student Code',
          value: 'studentCode',
          align: 'left',
          isMoney: false,
        },
        {
          text: 'Student Name',
          value: 'fullName',
          align: 'left',
          isMoney: false,
        },
        {
          text: 'NS Amount',
          value: 'paidAmt',
          align: 'right',
          isMoney: true,
        },
        {
          text: 'Payment Date',
          value: 'paymentDate',
          align: 'right',
          isMoney: false,
        },
        {
          text: 'Actual Start Date',
          value: 'actStartDate',
          align: 'right',
          isMoney: false,
        },
        {
          text: 'Class Code',
          value: 'classCode',
          isMoney: false,
        },
        {
          text: 'Remarks',
          value: 'remarks',
          align: 'left',
          isMoney: false,
        },
      ],
      filters: {
        classCode: [],
        actStartDate: [],
        fullName: [],
        paymentDate: [],
        studentCode: [],
        counselorName: [],
      },
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
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    async init() {
      if (!this.errorDate) {
        const dateToArray = this.date.split('-')
        await sale_report
          .getSaleReportDetail(this.locationID, dateToArray[1], dateToArray[0])
          .then(res => {
            this.saleList = res
          })
      }
    },
    groupColumnValueList(val) {
      return this.saleList.map(d => d[val]).filter(y => y)
    },
    viewDetailClass(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID, fromSale: true },
      })
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.saleList
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
          this.filters[value] = this.saleList
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
    numberWithCommas(number) {
      var parts = parseInt(number).toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join(',')
    },
  },
  watch: {
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
}
</script>

<style lang="scss" scoped>
.link {
  cursor: pointer;

  color: #427df2 !important;
}
.row-sale:nth-of-type(even) {
  background: #bde6fbb0;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
