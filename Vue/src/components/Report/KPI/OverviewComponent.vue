<template>
  <div class="table-data-kpi">
    <v-row justify="space-between" align="center" class="top"> </v-row>
    <v-row align="end"> </v-row>
    <v-data-table
      v-if="!isLoading"
      :headers="headers"
      :items="filtered"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-header
      hide-default-footer
      @page-count="pageCount = $event"
      class="elevation-0 table"
      fixed-header
      height="70vh"
    >
      <template v-slot:header="{ props }">
        <thead style="border-radius: 20px" class="v-data-table-header">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              style="background: #0b2585; color: #fff"
            >
              {{ header.text }}
            </th>
          </tr>
          <tr class="fixed-row-filter">
            <th v-for="header in props.headers" class="select-table" :key="header.text">
              <div v-if="filters.hasOwnProperty(header.value)">
                <v-autocomplete
                  outlined
                  dense
                  v-model="filters[header.value]"
                  :items="groupColumnValueList(header.value)"
                  multiple
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @mousedown.prevent @click="toggle(header.value)">
                      <v-list-item-action>
                        <v-icon
                          v-if="
                            filters[header.value].length ==
                            listRender
                              .map(d => d[header.value])
                              .reduce(function (accumulator, element) {
                                if (accumulator.indexOf(element) === -1) {
                                  accumulator.push(element)
                                }
                                return accumulator
                              }, []).length
                          "
                        >
                          mdi-close-box
                        </v-icon>
                        <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Select All </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ index }">
                    <span v-if="index == 0"> {{ filters[header.value].length }} selected </span>
                  </template>
                </v-autocomplete>
              </div>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.location }}</td>
            <td>{{ item.stopStuPCt }}</td>
            <td>{{ item.revenueArchivedPct }}</td>
            <td>{{ item.salesArchivedPct }}</td>
            <td>{{ item.avgStdPct }}</td>
            <td>{{ item.customCare }}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { kpi_report } from '@/api/kpi_report.js'
export default {
  setup() {
    return {}
  },
  methods: {
    async init() {
      const month = new Date(this.date).getMonth() + 1
      const year = new Date(this.date).getFullYear()
      await kpi_report.getOverview(month, year).then(res => {
        this.listRender = res.map(item => {
          return {
            revenueArchivedPct: Number(item.revenueArchivedPct).toFixed(2) + ' %',
            avgStdPct: Number(item.avgStdPct).toFixed(2) + ' %',
            location: item.location,
            salesArchivedPct: Number(item.salesArchivedPct).toFixed(2) + ' %',
            stopStuPCt: Number(item.stopStuPCt).toFixed(2) + ' %',
            customCare: Number(item.customerCarePct).toFixed(2) + ' %',
          }
        })
      })
    },
    groupColumnValueList(val) {
      return this.listRender.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listRender
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
          this.filters[value] = this.listRender
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
  },
  data() {
    return {
      isLoading: false,
      page: 1,
      location: '',
      pageCount: 0,
      itemsPerPage: 20,
      listLocationSelect: [],
      headers: [
        {
          text: 'Center',
          value: 'center',
          sortable: false,
        },
        {
          text: 'Revenue',
          value: 'revenue',
          width: '12%',
          sortable: false,
        },

        {
          text: 'Stopped Students',
          value: 'stoppedStudents',
          sortable: false,
        },
        {
          text: 'New sale',
          value: 'newSale',
          sortable: false,
        },
        {
          text: 'Average student',
          value: 'averStu',
          sortable: false,
        },
        {
          text: 'Customer care',
          value: 'cusCare',
          sortable: false,
        },
      ],
      listRender: [
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
        {
          studentCode: '12121',
          studentName: 'Nguyễn Van Hiếu',
          dueDate: '22/10/2000',
          outstanding: 2000000,
          ec: 'Ec Hiếu',
        },
      ],
      filters: {},
    }
  },
  props: {
    date: {
      type: String,
    },
  },
  watch: {
    listLocation: function (newListLocation) {
      if (newListLocation.length !== 0) {
        this.location = newListLocation[0].locationID
        this.listLocationSelect = newListLocation.map(item => {
          return item.location
        })
      }
    },
    date: function () {
      this.init()
    },
    location: function () {},
  },
  created() {
    this.init()
  },

  computed: {
    filtered() {
      const listReport = this.listRender.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listReport
    },
  },
}
</script>

<style lang="scss" scoped>


.v-data-table-header {
  border-radius: 30px;
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

tr td {
  text-align: center;
}

tr td:nth-of-type(1) {
  text-align: left;
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
  padding-top: 0;
}

.link a {
  display: block;
  text-align: right;
}
</style>
