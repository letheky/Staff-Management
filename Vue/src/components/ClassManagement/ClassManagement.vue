<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2 class="mb-10">Class Management</h2>
            <v-btn color="primary" @click="viewDailyClasses()">View class activities</v-btn>
          </div>
          <div class="d-flex">
            <v-row>
              <v-col md="3" style="background-color: rgba(196, 196, 196, 0.25)">
                <v-text-field
                  outlined
                  dense
                  placeholder="Search "
                  hide-details
                  v-model="searchClass"
                  counter
                  maxlength="100"
                  style="background: white"
                ></v-text-field>
              </v-col>
              <v-col md="3" style="background-color: rgba(196, 196, 196, 0.25)">
                <v-autocomplete
                  chips
                  small-chips
                  deletable-chips
                  hide-details
                  outlined
                  dense
                  multiple
                  label="Search center"
                  :items="centers"
                  item-text="location"
                  item-value="locationID"
                  v-model="center"
                  style="background: white"
                  @change="selectLocation"
                >
                </v-autocomplete>
              </v-col>
              <v-col md="2" style="background-color: rgba(196, 196, 196, 0.25)">
                <v-text-field
                  type="date"
                  label="From date"
                  style="background: white"
                  v-model="fromDate"
                  outlined
                  dense
                  hide-details
                  @change="selectFromDate"
                />
              </v-col>
              <v-col md="2" style="background-color: rgba(196, 196, 196, 0.25)">
                <v-text-field
                  type="date"
                  label="To date"
                  style="background: white"
                  v-model="toDate"
                  outlined
                  dense
                  hide-details
                  @change="selectToDate"
                />
              </v-col>
              <v-col md="2" style="display: grid; background-color: rgba(196, 196, 196, 0.25)">
                <v-btn
                  elevation="0"
                  height="36"
                  class="pl-5 pr-5"
                  color="primary"
                  @click="search()"
                  :disabled="!fromDate || !toDate"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            v-if="!isLoading"
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-header
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0 pt-5"
            style="overflow-x: scroll"
            fixed-header
            height="55vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                    role="columnheader"
                    scope="col"
                    aria-label="No"
                    class="text-start font-weight-bold"
                    :style="'width:' + header.width + '; min-width:' + header.width + ';'"
                  >
                    <span>{{ header.text }}</span>
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

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.classCode`]="{ item }">
              <div @click="viewDetail(item.classID)" style="color: cornflowerblue">
                <span class="link">{{ item.classCode }}</span>
              </div>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <!-- <img
                          v-bind="attrs"
                          v-on="on"
                          :style="{ width: '18px' }"
                          @click="viewDetail(item.classID)"
                          src="../../assets/images/carbon_view.svg"
                          alt=""
                        /> -->

              <v-icon size="18" @click="viewDetail(item.classID)" color="primary"
                >visibility
              </v-icon>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" class="w-100 pl-10 pr-10">
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
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} classes</h3>
          <h3 v-else>Total: {{ filtered.length }} class</h3>
        </v-col>
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
    <v-row justify="center">
      <v-dialog v-model="errorDialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined> Back </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import { account_managerment } from '@/api/account-management.js'
import dayjs from 'dayjs'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import message from '@/components/Utils/message'
export default {
  components: { Autocomplete },
  data() {
    return {
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          width: '50px',
          sortable: false,
        },
        {
          text: 'Center',
          value: 'location',
          width: '150px',
          sortable: false,
        },
        {
          text: 'Class code',
          value: 'classCode',
          width: '180px',
          sortable: false,
        },
        {
          text: 'Num of Students',
          value: 'nbrStu',
          width: '50px',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qc',
          width: '160px',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'ec',
          width: '160px',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'classStatus',
          width: '100px',
          sortable: false,
        },
        {
          text: 'Shift',
          value: 'classShiftName',
          width: '120px',
          sortable: false,
        },
        { text: 'Note', value: 'note', width: '300px', sortable: false },
        { text: 'Action', value: 'action', width: '60px', sortable: false },
      ],
      classList: [],
      // classGroup: [],
      // classStatus: [],
      programmes: [],
      programmeID: null,
      filters: {
        classCode: [],
        location: [],
        qc: [],
        ec: [],
        classStatus: [],
        classShiftName: [],
        note: [],
        nbrStu: [],
      },
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      searchClass: '',
      fromDate: dayjs().format('YYYY-MM-DD'),
      toDate: dayjs().format('YYYY-MM-DD'),
      centers: [],
      center: '',
      errorDialog: false,
      message: message,
    }
  },
  computed: {
    filtered() {
      return this.classList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    this.centers = [parseInt(localStorage.getItem('currentCenter'))]
    this.center = [parseInt(localStorage.getItem('currentCenter'))]

    if (localStorage.getItem('dailyClassCenterSearch')) {
      this.center = JSON.parse(localStorage.getItem('dailyClassCenterSearch'))
    }
    if (localStorage.getItem('dailyFromDateSearch')) {
      console.log(JSON.parse(localStorage.getItem('dailyFromDateSearch')))
      this.fromDate = dayjs(JSON.parse(localStorage.getItem('dailyFromDateSearch'))).format(
        'YYYY-MM-DD'
      )
    }
    if (localStorage.getItem('dailyToDateSearch')) {
      this.toDate = JSON.parse(localStorage.getItem('dailyToDateSearch'))
    }
    if (localStorage.getItem('filterClassManagement')) {
      this.filters = JSON.parse(localStorage.getItem('filterClassManagement'))
    }
    this.init()
  },
  watch: {
    fromDate: function (data) {
      console.log(data)
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('filterClassManagement', JSON.stringify(this.filters))
    },
    selectLocation(value) {
      localStorage.setItem('dailyClassCenterSearch', JSON.stringify(value))
    },
    selectFromDate(value) {
      localStorage.setItem('dailyFromDateSearch', JSON.stringify(value))
      console.log(value)
    },
    selectToDate(value) {
      localStorage.setItem('dailyToDateSearch', JSON.stringify(value))
    },
    async init() {
      this.isLoading = true
      // var today = new Date()
      // const currentYear = today.getFullYear()
      // const currentMonth = today.getMonth() + 1
      // var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      // this.fromDate = currentYear + '-' + this.checkTime(currentMonth) + '-' + '01'
      // this.toDate =
      //   currentYear +
      //   '-' +
      //   this.checkTime(currentMonth) +
      //   '-' +
      //   this.checkTime(this._dayjs(lastDayOfMonth).format('DD'))
      await account_managerment.getListCenter().then(res => {
        if (res) {
          this.centers = res
        }
      })
      const obj = {
        findKey: this.searchClass,
        locationID: this.center,
        fromDate: this.fromDate,
        toDate: this.toDate,
      }

      await class_managerment
        .searchClass(obj)
        .then(res => {
          if (res && !res.errors) {
            this.classList = res
          } else {
            this.errorDialog = true
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
      this.isLoading = false
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    groupColumnValueList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.classList
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
          this.filters[value] = this.classList
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
    viewDetail(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    editClass(classID) {
      this.$router.push({
        name: 'class-management-edit',
        params: { classID: classID },
      })
    },
    async search() {
      this.isLoading = true
      const obj = {
        findKey: this.searchClass,
        locationID: this.center.length > 0 ? this.center : '',
        fromDate: this.fromDate,
        toDate: this.toDate,
      }
      await class_managerment.searchClass(obj).then(res => {
        if (res) {
          this.classList = res
        }
      })
      this.isLoading = false
    },
    viewDailyClasses() {
      this.$router.push({ name: 'class-management-daily-classes' })
    },
    updateFromDate(event) {
      this.fromDate = event
    },
    updateToDate(event) {
      this.toDate = event
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.link {
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid #427df2;
  }
}
</style>
