<template>
  <div class="mt-5 ml-10 mr-10" id="no-homework">
    <h2 class="mb-3">No Homework Report</h2>
    <v-col>
      <v-row class="mb-0 d-flex no-homework-select">
        <v-select
          class="mr-2"
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
        <!-- 
        <v-text-field
          type="date"
          v-model="date"
          outlined
          @input="dateChange"
          lable="Select date"
          :style="{ width: '150px' }"
          :class="'input-select ml-1'"
          dense
        /> -->

        <div :style="{ zIndex: 4 }" :class="'datepicker '" class="datapicker-with-label mr-2">
          <p>Select date</p>

          <date-picker
            v-model="date"
            :format="'DD/MM/YYYY'"
            @input="dateChange"
            placeholder="Select month"
          ></date-picker>
        </div>
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
    <h3 md="4" class="d-flex align-center mt-3">Total : {{ filtered.length }} Students</h3>
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <!-- <v-progress-linear v-if="isLoading" indeterminate color="primary" class="my-10"></v-progress-linear> -->
          <v-data-table
            v-if="!isloading"
            :headers="headers"
            :items="filtered"
            :items-per-page="100000000000000000000000000000"
            hide-default-footer
            hide-default-header
            @page-count="pageCount = $event"
            class="elevation-0 hidden-detail-input"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header header-nohomework">
                <tr>
                  <th v-for="header in props.headers" :key="header.value">
                    <p v-if="header.value === 'no'" :style="{ width: '20px' }">{{ header.text }}</p>
                    <p v-else-if="header.value === 'stuCode'" :style="{ width: '100px' }">
                      {{ header.text }}
                    </p>
                    <p v-else>{{ header.text }}</p>
                  </th>
                </tr>

                <tr class="fixed-row-filter">
                  <th
                    :style="{
                      background: '#fff',
                      width: header.value === 'stuCode' ? '100px' : '',
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
            <template v-slot:[`item.no`]="{ index }">
              <td>
                <p :style="{ width: '20px' }">{{ index + 1 }}</p>
              </td>
            </template>
            <template v-slot:[`item.stuCode`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.stuUserID)" class="text-left w-100 mr-4 link">
                  {{ item.stuCode }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.stuName`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.stuUserID)" class="text-left w-150 mr-4 link">
                  {{ item.stuName }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.phone`]="{ item }">
              <td>
                <p class="text-left w-150 mr-4">{{ item.phone }}</p>
              </td>
            </template>
            <template v-slot:[`item.classCode`]="{ item }">
              <td>
                <p
                  @click="viewDetailClass(item.classID)"
                  :style="{ width: '100%' }"
                  class="text-center mr-4 w-100 link"
                >
                  {{ item.classCode }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.time`]="{ item }">
              <td>
                <p class="text-center mr-4 w-100">{{ item.time }}</p>
              </td>
            </template>
            <template v-slot:[`item.qcName`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.qcUserID)" class="text-left mr-4 w-150 link">
                  {{ item.qcName }}
                </p>
              </td>
            </template>
            <template v-slot:[`item.ecName`]="{ item }">
              <td>
                <p @click="viewDetailProfile(item.ecUserID)" class="text-left mr-4 w-150 link">
                  {{ item.ecName }}
                </p>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
// import Multiselect from "vue-multiselect";
import DatePicker from 'vue2-datepicker'

import 'vue2-datepicker/index.css'
import { no_homework } from '@/api/no-homework.js'
import dayjs from 'dayjs'

export default {
  components: {
    Autocomplete,
    'date-picker': DatePicker,
  },
  data() {
    return {
      page: 1,
      locationID: parseInt(localStorage.getItem('currentCenter')),
      listNoHomework: [],
      locationList: [],
      isLoading: false,
      date: new Date(),

      locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,

      headers: [
        {
          text: 'No',
          value: 'no',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Stu  Code',
          value: 'stuCode',
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
          text: 'Mobile Phone',
          value: 'phone',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Class code',
          value: 'classCode',
          color: '#A0D589',
          sortable: false,
        },

        {
          text: 'Time',
          value: 'time',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qcName',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'ecName',
          color: '#FFCF53',
          sortable: false,
        },
      ],
      listVisit: [],
      filters: {
        stuCode: [],

        stuName: [],

        phone: [],

        classCode: [],

        mobilePhone: [],

        time: [],

        ecName: [],

        qcName: [],
      },
    }
  },

  computed: {
    filtered() {
      const listReport = this.listNoHomework.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listReport
    },
  },
  created() {
    console.log(no_homework)
    if (localStorage.getItem('noHwCenter')) {
      this.locationID = JSON.parse(localStorage.getItem('noHwCenter'))
    }
    if (localStorage.getItem('noHwDate')) {
      this.date = new Date(dayjs(localStorage.getItem('noHwDate')))
    }

    if (localStorage.getItem('noHwFilter')) {
      this.filters = JSON.parse(localStorage.getItem('noHwFilter'))
    }
    this.getNoHomeWork()
  },
  watch: {},
  methods: {
    // changeFilter() {
    //   localStorage.setItem('VisFilter', JSON.stringify(this.filters))
    // },

    async getNoHomeWork() {
      await no_homework
        .getNoHomeWork(this.locationID, dayjs(this.date).format('YYYY-MM-DD'))
        .then(res => {
          this.listNoHomework = res
        })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('noHwFilter', JSON.stringify(this.filters))
    },
    resetFilter() {
      this.filters = {
        stuCode: [],

        stuName: [],

        phone: [],

        classCode: [],

        mobilePhone: [],

        time: [],

        ecName: [],

        qcName: [],
      }
    },
    dateChange(val) {
      this.date = val
      localStorage.setItem('noHwDate', val)
      this.getNoHomeWork()
    },
    locationChange() {
      localStorage.setItem('noHwCenter', this.locationID)
      this.getNoHomeWork()
      this.resetFilter()
    },
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },

    groupColumnValueList(val) {
      return this.listNoHomework.map(d => d[val]).filter(x => x)
    },

    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.header-nohomework p {
  margin-right: 2.5rem;
  text-align: center;
}
tbody tr:nth-of-type(odd) td {
  background-color: #d2eefc !important;
}
.no-homework-select {
  width: 400px;
  flex-wrap: nowrap !important;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
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
th:nth-of-type(4),
th:nth-of-type(6) {
  width: 100px;
}
.w-100 {
  width: 100px;
}
.text-center {
  text-align: center;
  margin: 0 auto;
}
</style>
