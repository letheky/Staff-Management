<template>
  <div class="absent">
    <h2>Make-up lessons</h2>
    <v-row :class="'absent-header justify-space-between align-center'">
      <v-col>
        <div :class="' d-flex justify-start'">
          <v-select
            v-model="locationID"
            item-text="location"
            append-icon="keyboard_arrow_down"
            item-value="locationID"
            :items="listLocation"
            label="Center"
            outlined
            :class="'select-input'"
            dense
          ></v-select>

          <v-text-field
            type="date"
            v-model="fromDate"
            label="From date"
            :class="'select-input'"
            outlined
            dense
            hide-details
            @input="changeDate"
          />
          <v-text-field
            type="date"
            v-model="toDate"
            label="To date"
            :class="'select-input'"
            outlined
            dense
            hide-details
            @input="changeDate"
          /></div
      ></v-col>
    </v-row>
    <h4>Total : {{ listStudent.length }} students</h4>
    <template v-if="loading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template>
      <v-data-table
        :headers="headers"
        :items="filtered"
        v-if="!loading"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        hide-default-footer
        class="elevation-0 absent-table"
        :id="'absent-table'"
        fixed-header
        height="69vh"
      >
        <template v-slot:header="{ props }">
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

        <template v-slot:[`item.classCode`]="{ item }">
          <p class="link w-100" style="width: 100px" @click="viewClassDetail(item.classID)">
            {{ item.classCode }}
          </p>
        </template>
        <template v-slot:[`item.no`]="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template v-slot:[`item.classGroup`]="{ item }">
          <p :class="'type-makup lesson-type'">
            {{ item.classGroup }}
          </p>
        </template>
        <template v-slot:[`item.studentCode`]="{ item }">
          <p class="link w-80" @click="viewStudent(item.stuUserID)">{{ item.studentCode }}</p>
        </template>
        <template v-slot:[`item.makeUpShift`]="{ item }">
          <p class="w-80">{{ item.makeUpShift }}</p>
        </template>
        <template v-slot:[`item.classShift`]="{ item }">
          <p class="w-80">{{ item.classShift }}</p>
        </template>
        <template v-slot:[`item.studentName`]="{ item }">
          <p class="link w-150" @click="viewStudent(item.stuUserID)">{{ item.studentName }}</p>
        </template>
        <template v-slot:[`item.qc`]="{ item }">
          <p class="link w-150" @click="viewStaff(item.qcUserID)">{{ item.qc }}</p>
        </template>
        <template v-slot:[`item.makeUpClassCode`]="{ item }">
          <p class="link w-100" style="width: 100px" @click="viewClassDetail(item.makeUpClassID)">
            {{ item.makeUpClassCode }}
          </p>
        </template>
        <template v-slot:[`item.attendStatus`]="{ item }">
          <div
            :style="{
              width: 'fit-content',
              margin: '0 auto',
            }"
          >
            <img
              :style="{
                width: item.attendStatus === 'Absent' ? '34px' : '27px',
              }"
              :src="
                item.attendStatus === 'Absent'
                  ? require('../../../assets/images/icon-close-red.svg')
                  : item.attendStatus === 'Attended'
                  ? require('../../../assets/images/icon-done.svg')
                  : require('../../../assets/images/icon-pendding.svg')
              "
              alt=""
              srcset=""
            />
          </div>
        </template>
        <template v-slot:[`item.ec`]="{ item }">
          <p class="link w-150" @click="viewStudent(item.ecUserID)">{{ item.ec }}</p>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <img
                :style="{
                  opacity:
                    item.makeUpDate && dayjs().isBefore(dayjs(item.makeUpDateWithShift)) ? 1 : 0.4,
                }"
                v-bind="attrs"
                v-on="on"
                @click="
                  item.makeUpDate &&
                    dayjs().isBefore(dayjs(item.makeUpDateWithShift)) &&
                    openForm(item)
                "
                src="../../../assets/images/icon-edit-pen.svg"
              />
            </template>
            <span>
              {{
                item.makeUpDate && dayjs().isBefore(dayjs(item.makeUpDateWithShift))
                  ? 'Add/Edit'
                  : "Can't edit "
              }}</span
            >
          </v-tooltip>
        </template>
      </v-data-table>
      <div v-if="!isLoading" color="#fff" class="pl-10 mt-3 pr-10">
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
            <h3></h3>
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
      <FormMakeupLesson
        v-if="dialogForm"
        @setLog="setLog"
        @callData="callDataWithNoLoading"
        :makeupInfor="{
          ...makeupInfor,
          classDate: makeupInfor.classDate.split('/').reverse().join('-'),
        }"
        :dialog="dialogForm"
      />
    </template>
  </div>
</template>

<script>
import { makeuplesson } from '@/api/makeuplesson'

import Autocomplete from '@/components/Utils/Autocomplete.vue'
import FormMakeupLesson from '@/components/StatisticManagement/FormMakeupLesson.vue'
import dayjs from 'dayjs'

export default {
  components: { Autocomplete, FormMakeupLesson },
  data() {
    return {
      listStudent: [],
      isLoading: false,
      page: 1,
      dayjs: dayjs,
      pageCount: 0,
      itemsPerPage: 20,
      makeupInfor: {},
      dialogForm: false,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      listLocation: [],
      locationID: 1,
      headers: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
        },
        {
          text: 'Make-up class',
          value: 'makeUpClassCode',
          sortable: false,
        },
        {
          text: 'Make-up date',
          value: 'makeUpDate',
          sortable: false,
        },
        {
          text: 'Make-up shift',
          value: 'makeUpShift',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'attendStatus',
          sortable: false,
        },
        {
          text: 'Phone',
          value: 'phone',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qc',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'ec',
          sortable: false,
        },

        {
          text: 'Absent class',
          value: 'classCode',
          sortable: false,
        },
        {
          text: 'Absent date',
          value: 'classDate',
          sortable: false,
        },
        {
          text: 'Absent shift',
          value: 'classShift',
          sortable: false,
        },

        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
      filters: {
        qc: [],
        ec: [],
        makeUpClassCode: [],
        classCode: [],
        studentCode: [],
        classDate: [],
        attendStatus: [],
        studentName: [],
        classTime: [],
        phone: [],
        makeUpShift: [],
        makeUpDate: [],
        classShift: [],
      },
    }
  },
  computed: {
    filtered() {
      return this.listStudent.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  setup() {
    return {}
  },
  created() {
    this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.locationID = parseInt(localStorage.getItem('currentCenter'))
    if (localStorage.getItem('makeupCenter'))
      this.locationID = parseInt(localStorage.getItem('makeupCenter'))
    if (localStorage.getItem('makeupTo'))
      this.toDate = dayjs(localStorage.getItem('makeupTo')).format('YYYY-MM-DD')
    if (localStorage.getItem('makeupFrom'))
      this.fromDate = dayjs(localStorage.getItem('makeupFrom')).format('YYYY-MM-DD')
    if (localStorage.getItem('makeupFilter'))
      this.filters = JSON.parse(localStorage.getItem('makeupFilter'))
    this.init()
  },

  watch: {
    locationID: function () {
      localStorage.setItem('makeupCenter', this.locationID)
      this.init()
    },
  },
  methods: {
    getTimeInobject(shift) {
      if (shift && shift.split('-')[0].indexOf(':') !== -1) {
        let arrShift = shift.split('-')[0].split(':')
        return {
          hour: !isNaN(arrShift[0]) ? parseInt(arrShift[0]) : null,
          min: !isNaN(arrShift[1]) ? parseInt(arrShift[1]) : null,
        }
      }
      return null
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('makeupFilter', JSON.stringify(this.filters))
    },
    openForm(makeupInfor) {
      this.makeupInfor = makeupInfor
      this.dialogForm = true
    },
    resetFilter() {
      this.filters = {
        qc: [],
        ec: [],
        makeUpClassCode: [],
        classCode: [],
        studentCode: [],
        classDate: [],
        attendStatus: [],
        studentName: [],
        classTime: [],
        phone: [],
        makeUpShift: [],
        makeUpDate: [],
      }
    },
    setLog(data) {
      this.dialogForm = data.openDialog ? data.openDialog : false
      this.makeupInfor = data.makeup ? data.makeup : ''
    },
    groupColumnValueList(val) {
      return this.listStudent.map(d => d[val]).filter(y => y)
    },

    viewStudent(studentID) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: studentID,
        },
      })
    },
    viewStaff(userID) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userID,
        },
      })
    },
    viewClassDetail(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: {
          classID: classID,
        },
      })
    },
    changeDate() {
      localStorage.setItem('makeupFrom', this.fromDate)
      localStorage.setItem('makeupTo', this.toDate)
      this.init()
    },
    async init() {
      this.loading = true
      await makeuplesson.getMakeupList(this.locationID, this.fromDate, this.toDate).then(res => {
        this.listStudent = res.map(item => {
          return {
            ...item,
            makeUpDateWithShift:
              this.getTimeInobject(item.makeUpShift) &&
              dayjs(item.makeUpDate)
                .add(this.getTimeInobject(item.makeUpShift).hour, 'hour')
                .add(this.getTimeInobject(item.makeUpShift).min, 'minute'),
            attendStatus: item.attendStatus === null ? 'Pending' : item.attendStatus,
            classGroup: item.classGroup === 'Public' ? 'Official' : item.classGroup,
            makeUpDate: dayjs(item.makeUpDate).format('DD/MM/YYYY'),
            classDate: dayjs(item.classDate).format('DD/MM/YYYY'),
          }
        })
        this.loading = false
      })
    },
    async callDataWithNoLoading() {
      await makeuplesson.getMakeupList(this.locationID, this.fromDate, this.toDate).then(res => {
        this.listStudent = res.map(item => {
          return {
            ...item,
            makeUpDateWithShift:
              this.getTimeInobject(item.makeUpShift) &&
              dayjs(item.makeUpDate)
                .add(this.getTimeInobject(item.makeUpShift).hour, 'hour')
                .add(this.getTimeInobject(item.makeUpShift).min, 'minute'),
            attendStatus: item.attendStatus ? 'Pending' : item.attendStatus,
            classGroup: item.classGroup === 'Public' ? 'Official' : item.classGroup,
            makeUpDate: dayjs(item.makeUpDate).format('DD/MM/YYYY'),
            classDate: dayjs(item.classDate).format('DD/MM/YYYY'),
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.lesson-type {
  width: 80px;
  height: 30px;
  color: #ffff;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;

  &.type-public {
    background: #27ae60;
  }
  &.type-makup {
    background: #f6b91a;
  }
}
.absent-btn-download {
  width: fit-content;
  margin-left: auto;
}
.select-input {
  max-width: 200px;
  margin-right: 20px !important;
}
h4 {
  margin-bottom: 14px;
}
h2 {
  margin-bottom: 20px;
}
.absent {
  padding: 20px 36px;
}
.absent-table {
  border-radius: 5px;
  overflow: hidden;
}
.btn-download {
  width: fit-content;
  margin-left: auto;
}
.link {
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
