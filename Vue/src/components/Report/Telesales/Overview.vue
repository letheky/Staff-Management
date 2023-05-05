<template>
  <div class="mt-5 ml-10 mr-10" id="vis-detail">
    <h2 class="mb-6">Telesales Report</h2>

    <v-col>
      <v-row class="mb-0 ml-1">
        <v-row class="mb-0">
          <v-select
            class="mr-1"
            :items="locationPermissions"
            item-text="location"
            item-value="locationID"
            append-icon="keyboard_arrow_down"
            outlined
            @change="locationChange"
            dense
            :class="'input-select'"
            hide-details
            placeholder="Center"
            label="Center"
            v-model="locationID"
          >
          </v-select>
          <div :style="{ zIndex: 4 }" :class="'datepicker-h '" class="datapicker-with-label mr-2">
            <p>From date</p>

            <date-picker
              v-model="fromDate"
              :format="'DD/MM/YYYY'"
              @input="fromChange"
              placeholder="Select month"
            ></date-picker>
          </div>
          <div :style="{ zIndex: 4 }" :class="'datepicker-h '" class="datapicker-with-label mr-2">
            <p>To date</p>

            <date-picker
              v-model="toDate"
              :format="'DD/MM/YYYY'"
              @input="toChange"
              placeholder="Select month"
            ></date-picker>
          </div>
        </v-row>
      </v-row>
      <!-- <v-autocomplete
              v-model="select"
              :items="classStatus"
              label="Class status"
              item-text="classStatus"
              item-value="classStatusID"
              outlined
              dense
            ></v-autocomplete> -->
    </v-col>
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <h3 md="4" class="d-flex align-center mt-3">Total : {{ filtered.length }} Records</h3>
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <!-- <v-progress-linear v-if="isLoading" indeterminate color="primary" class="my-10"></v-progress-linear> -->
          <v-data-table
            v-if="!isloading"
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            hide-default-header
            @page-count="pageCount = $event"
            class="elevation-0 hidden-detail-input"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header header-telesales">
                <tr>
                  <th v-for="header in props.headers" :key="header.value">
                    <p>{{ header.text }}</p>
                  </th>
                </tr>

                <tr class="fixed-row-filter">
                  <th
                    :style="{
                      background: '#fff',
                    }"
                    v-for="header in props.headers"
                    class="select-book"
                    :key="header.text"
                  >
                    <Autocomplete
                      @setFilter="setFilter"
                      :keyFilter="header.value"
                      :selectedInit="filters[header.value]"
                      :listItem="groupColumnValueList(header.value)"
                    />
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:[`item.crtdUser`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.createUserId)" class="text-left mr-4 w-100 link">
                  {{ item.crtdUser }}
                </p>
              </td>
            </template>

            <template v-slot:[`item.studentCode`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.stuUserID)" class="text-left mr-4 w-80 link">
                  {{ item.studentCode }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.crtdDate`]="{ item }">
              <td>
                <p class="text-left mr-4 w-80">
                  {{ item.crtdDate }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.studentCode`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.stuUserID)" class="text-left mr-4 w-80 link">
                  {{ item.studentCode }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.stuName`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.stuUserID)" class="text-left mr-4 w-150 link">
                  {{ item.stuName }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.classCode`]="{ item }">
              <td>
                <p @click="viewDetailClass(item.classID)" class="text-left mr-4 w-100 link">
                  {{ item.classCode }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.counselorNote`]="{ item }">
              <td>
                <p class="text-left mr-4 w-300">
                  {{ item.counselorNote }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.reminderDate`]="{ item }">
              <td>
                <p class="text-left mr-4 w-100">
                  {{ item.reminderDate }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.customerNote`]="{ item }">
              <td>
                <p class="text-left mr-4 w-300">
                  {{ item.customerNote }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.phone`]="{ item }">
              <td>
                <p class="text-left mr-4 w-100">
                  {{ item.phone }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.purpose`]="{ item }">
              <td>
                <p class="text-left mr-4 w-100">
                  {{ item.purpose }}
                </p>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-col>
      <div v-if="!isLoading" color="#fff" :class="' footer-telesale fix pl-0 mt-4 pr-0 '">
        <v-row>
          <v-col md="6">
            <v-select
              outlined
              hide-details
              dense
              :value="itemsPerPage"
              :items="[20, 50, 100, 200]"
              @change="itemsPerPage = parseInt($event, 10)"
              :style="{ height: '32px', width: '150px' }"
            ></v-select>
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
    </v-row>
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
// import Multiselect from "vue-multiselect";
import dayjs from 'dayjs'
import DatePicker from 'vue2-datepicker'
import { telesale } from '@/api/telesale.js'
import 'vue2-datepicker/index.css'
export default {
  components: {
    Autocomplete,
    'date-picker': DatePicker,
  },
  data() {
    return {
      page: 1,
      locationID: parseInt(localStorage.getItem('currentCenter')),
      listTelesales: [],
      locationList: [],
      isLoading: false,
      pageCount: 0,
      itemsPerPage: 20,
      fromDate: new Date(dayjs(new Date()).subtract(1, 'days').format('YYYY-MM-DD')),
      toDate: new Date(),
      locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,

      headers: [
        {
          text: 'Create User',
          value: 'crtdUser',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Create Date',
          value: 'crtdDate',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Student  Code',
          value: 'studentCode',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Student name',
          value: 'stuName',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Mobile phone',
          value: 'phone',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Class Code',
          value: 'classCode',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Purpose',
          value: 'purpose',
          color: '#A0D589',
          sortable: false,
        },

        {
          text: 'Counselor note',
          value: 'counselorNote',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Customer note',
          value: 'customerNote',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Remider Date',
          value: 'reminderDate',
          color: '#FFCF53',
          sortable: false,
        },
      ],

      filters: {
        crtdDate: [],
        crtdUser: [],
        createUserId: [],
        studentCode: [],
        stuUserID: [],
        stuName: [],
        phone: [],
        classCode: [],
        classID: [],
        purpose: [],
        customerNote: [],
        counselorNote: [],
        reminderDate: [],
      },
    }
  },

  computed: {
    filtered() {
      const listReport = this.listTelesales.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listReport
    },
  },
  created() {
    console.log('object')

    if (localStorage.getItem('telesaleCenter'))
      this.locationID = JSON.parse(localStorage.getItem('telesaleCenter'))
    if (localStorage.getItem('telesaleFromDate'))
      this.fromDate = new Date(localStorage.getItem('telesaleFromDate'))
    if (localStorage.getItem('telesaleToDate'))
      this.toDate = new Date(localStorage.getItem('telesaleToDate'))
    if (localStorage.getItem('telesaleFilter')) {
      this.filters = JSON.parse(localStorage.getItem('telesaleFilter'))
    }
    this.getListTelesale()
  },
  watch: {
    locationID: function () {},
  },
  methods: {
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    // changeFilter() {
    //   localStorage.setItem('VisFilter', JSON.stringify(this.filters))
    // },
    fromChange() {
      localStorage.setItem('telesaleFromDate', this.fromDate)
      this.getListTelesale()
    },
    toChange() {
      localStorage.setItem('telesaleToDate', this.toDate)

      this.getListTelesale()
    },

    async getListTelesale() {
      this.isLoading = true
      await telesale
        .getTelesale(
          this.locationID,
          dayjs(this.fromDate).format('YYYY-MM-DD'),
          dayjs(this.toDate).format('YYYY-MM-DD')
        )
        .then(res => {
          this.listTelesales = res.map(item => {
            return {
              ...item,
              crtdDate: dayjs(item.crtdDate).format('DD/MM/YYYY'),
              reminderDate: dayjs(item.reminderDate).format('DD/MM/YYYY'),
            }
          })
          this.isLoading = false
        })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('telesaleFilter', JSON.stringify(this.filters))
    },
    resetFilter() {
      this.filters = {
        crtdDate: [],
        crtdUser: [],
        createUserId: [],
        studentCode: [],
        stuUserID: [],
        stuName: [],
        phone: [],
        classCode: [],
        classID: [],
        purpose: [],
        customerNote: [],
        counselorNote: [],
        reminderDate: [],
      }
    },

    locationChange() {
      localStorage.setItem('telesaleCenter', this.locationID)
      this.getListTelesale()
    },

    groupColumnValueList(val) {
      console.log(val)
      return this.listTelesales.map(d => d[val]).filter(y => y)
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
.input-select {
  max-width: 190px;
}
.header-telesales p {
  margin-right: 2.5rem;
  text-align: center;
}
.no-homework-select {
  width: 400px;
  flex-wrap: nowrap !important;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}
tbody tr:nth-of-type(odd) td {
  background-color: #d2eefc !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.w-300 {
  width: 300px;
}
.w-80 {
  width: 80px;
}
.w-150 {
  width: 150px;
}
.datapicker-with-label {
  position: relative;
  p {
    position: absolute;
    top: -7px;
    z-index: 100;
    left: 10px;
    font-size: 10px;
    background: #fff;
  }
}
.w-150 {
  width: 150px;
}
.footer-telesale {
  width: 100%;
}
th:nth-of-type(4),
th:nth-of-type(6) {
  width: 100px;
}
.w-100 {
  text-align: right;
  width: 100px;
}
</style>
