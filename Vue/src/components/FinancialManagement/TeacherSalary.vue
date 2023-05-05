<template>
  <div id="center-management">
    <v-row no-gutters class="pb-3">
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2>Teacher salary</h2>
            <v-row class="d-flex mb-3 justify-end">
              <v-btn
                outlined
                elevation="0"
                height="36"
                class="ml-5 pl-5 pr-5"
                color="warning"
                :loading="isExporting"
                :disabled="selected.length > 0 ? isDisable : true"
                @click="exportExcel()"
              >
                Download file excel
              </v-btn>
            </v-row>
          </div>
          <v-row class="mt-5 mb-5 pt-2" style="background-color: rgba(196, 196, 196, 0.25)">
            <v-col md="2">
              <v-text-field
                outlined
                dense
                placeholder="Teacher name"
                hide-details
                v-model="searchTeacher"
                counter
                maxlength="100"
                style="background: white"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-autocomplete
                label="Teacher group"
                v-model="teacherGroup"
                :items="teacherGroups"
                item-value="teacherGroupID"
                item-text="teacherGroup"
                style="background: white"
                hide-details
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col md="2">
              <v-autocomplete
                label="Teacher type"
                v-model="teacherType"
                :items="teacherTypes"
                item-text="teacherType"
                item-value="teacherTypeID"
                style="background: white"
                hide-details
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col md="2">
              <!-- <date-picker
                :model="fromDate"
                @update:model="updateFromDate"
                title="From date"
                style="background: white"
              ></date-picker> -->
              <v-text-field
                type="date"
                label="From date"
                style="background: white"
                v-model="fromDate"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col md="2">
              <!-- <date-picker
                :model="toDate"
                @update:model="updateToDate"
                title="To date"
                style="background: white"
              ></date-picker> -->
              <v-text-field
                type="date"
                label="To date"
                style="background: white"
                v-model="toDate"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col md="2">
              <v-btn elevation="0" height="36" class="pl-5 pr-5" color="primary" @click="search()">
                Search teacher
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="teacherSalary"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            show-select
            v-model="selected"
            item-key="stt"
            :id="tables"
            class="elevation-0 ttt"
            fixed-header
            height="55vh"
            hide-default-header
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
                    <!-- <v-autocomplete
                      class="ma-3 my-1"
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
                                teacherListFiltered
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
                    </v-autocomplete> -->
                  </div>
                </th>
              </tr>
            </template>

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <div class="text-center">
                <v-icon size="18" color="primary" @click="viewDetail(item.teacherID)">
                  mdi-eye
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <v-footer
      color="#fff"
      class="px-10 pb-2"
      padless
      :style="
        $store.state.isActiveSidebar ? 'width: calc(100% - 100px)' : 'width: calc(100% - 258px)'
      "
      style="display: flex; justify-content: space-between"
    >
      <div>
        <v-select
          outlined
          hide-details
          dense
          :value="itemsPerPage"
          :items="[20, 50, 100, 200, 500, 1000]"
          @change="itemsPerPage = parseInt($event, 10)"
          style="height: 32px"
        ></v-select>
      </div>
      <div>
        <h3 v-if="teacherSalary.length != 1">Total: {{ teacherSalary.length }} records</h3>
        <h3 v-else>Total: {{ teacherSalary.length }} record</h3>
      </div>
      <div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="7"
          elevation="0"
        ></v-pagination>
      </div>
    </v-footer>
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
import dayjs from 'dayjs'
import { teacher_information } from '@/api/teacher-information.js'
import { account_managerment } from '@/api/account-management.js'
import { financial } from '@/api/financial.js'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
const querystring = require('querystring')
import message from '@/components/Utils/message'
export default {
  components: { Autocomplete },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      selected: [],
      headers: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'User Name',
          value: 'userName',
          sortable: false,
        },
        {
          text: 'Teacher Name',
          value: 'teacherName',
          sortable: false,
        },
        { text: 'Teacher group', value: 'teacherGroup', sortable: false },
        {
          text: 'Teacher Type',
          value: 'teacherType',
          sortable: false,
        },
        { text: 'Action', value: 'action', sortable: false },
      ],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      teacherGroups: [],
      teacherTypes: [],
      searchTeacher: '',
      teacherGroup: '',
      teacherType: '',
      fromDate: '',
      toDate: '',
      tables: 'tables',
      name: 'teacher salary',
      isDisable: false,
      isExporting: false,
      teacherIDS: [],
      filters: {
        userName: [],
        teacherName: [],
        teacherGroup: [],
        teacherType: [],
      },
      teacherListFiltered: [],
      errorDialog: false,
      message: message,
    }
  },
  computed: {
    teacherSalary() {
      return this.teacherListFiltered.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    this.init()
  },
  watch: {
    selected: function (value) {
      console.log(value)
    },
  },
  methods: {
    async init() {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1
      const currentDate = new Date().getDate()
      this.fromDate = currentYear + '-' + this.checkTime(currentMonth) + '-' + '01'
      this.toDate =
        currentYear + '-' + this.checkTime(currentMonth) + '-' + this.checkTime(currentDate)
      this.searchTeacher =
        JSON.parse(localStorage.getItem('searchTeacher')) == null
          ? ''
          : JSON.parse(localStorage.getItem('searchTeacher'))
      this.teacherGroup =
        JSON.parse(localStorage.getItem('searchTeacherGroup')) == null
          ? ''
          : JSON.parse(localStorage.getItem('searchTeacherGroup'))
      this.teacherType =
        JSON.parse(localStorage.getItem('searchTeacherType')) == null
          ? ''
          : JSON.parse(localStorage.getItem('searchTeacherType'))
      await teacher_information.getListTeacherGroup().then(res => {
        if (res) {
          this.teacherGroups = res
        }
      })
      await teacher_information.getListTeacherType().then(res => {
        if (res) {
          this.teacherTypes = res
        }
      })
      await financial
        .getTeacherSalary(
          this.searchTeacher,
          this.teacherGroup,
          this.teacherType,
          this.fromDate,
          this.toDate
        )
        .then(res => {
          if (res.mess && res.mess.code == 200) {
            this.teacherListFiltered = res.listSalary
          } else {
            this.errorDialog = true
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
    },
    search() {
      localStorage.setItem('searchTeacher', JSON.stringify(this.searchTeacher))
      localStorage.setItem('searchTeacherGroup', JSON.stringify(this.teacherGroup))
      localStorage.setItem('searchTeacherType', JSON.stringify(this.teacherType))
      localStorage.setItem('searchFromDate', JSON.stringify(this.fromDate))
      localStorage.setItem('searchToDate', JSON.stringify(this.toDate))
      financial
        .getTeacherSalary(
          this.searchTeacher,
          this.teacherGroup,
          this.teacherType,
          this.fromDate,
          this.toDate
        )
        .then(res => {
          if (res) {
            this.teacherListFiltered = res.listSalary
          }
        })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    groupColumnValueList(val) {
      return this.teacherListFiltered.map(d => d[val])
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.teacherListFiltered
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
          this.filters[value] = this.teacherListFiltered
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
    viewDetail(teacherId) {
      localStorage.setItem('searchTeacher', JSON.stringify(this.searchTeacher))
      localStorage.setItem('searchTeacherGroup', JSON.stringify(this.teacherGroup))
      localStorage.setItem('searchTeacherType', JSON.stringify(this.teacherType))
      localStorage.setItem('searchFromDate', JSON.stringify(this.fromDate))
      localStorage.setItem('searchToDate', JSON.stringify(this.toDate))
      this.$router.push({
        name: 'financial-detail-teacher-salary',
        params: { teacherId: teacherId },
      })
    },
    async exportExcel() {
      this.teacherIDS = []

      for (var i = 0; i < this.selected.length; i++) {
        if (this.teacherIDS.indexOf(this.selected[i].teacherID) === -1) {
          this.teacherIDS.push(this.selected[i].teacherID)
        }
      }

      this.isDisable = true
      this.isExporting = true
      let body = {
        fromDate: this.fromDate,
        toDate: this.toDate,
      }
      await account_managerment
        .exportExcelTeacherSalary(this.teacherIDS, querystring.stringify(body))
        .then(data => {
          var fileURL = window.URL.createObjectURL(data)
          var fileLink = document.createElement('a')
          var today = new Date()
          var fileName = 'Teacher_salary' + today.getFullYear()
          ;+'-' + this.checkTime(today.getMonth() + 1) + '-' + this.checkTime(today.getDate())
          fileLink.href = fileURL
          fileLink.setAttribute('download', fileName + '.xls')
          document.body.appendChild(fileLink)

          fileLink.click()
          fileLink.remove()
        })
        .finally(() => {
          this.isExporting = false
          this.isDisable = false
        })
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // updateFromDate(event) {
    //   this.fromDate = event;
    // },
    // updateToDate(event) {
    //   this.toDate = event;
    // },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped></style>
