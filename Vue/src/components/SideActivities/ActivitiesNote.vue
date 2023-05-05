<template>
  <div class="mt-5 mb-5 mr-8 ml-8">
    <h2>Side Activity Note Management</h2>
    <v-row :class="'absent-header justify-space-between align-center'">
      <v-col>
        <div :class="'d-flex justify-start'">
          <v-autocomplete
            v-model="locationID"
            item-text="location"
            append-icon="keyboard_arrow_down"
            item-value="locationID"
            :items="listLocation"
            label="Center"
            multiple
            outlined
            @input="changeLocation"
            :class="'select-input'"
            dense
          >
            <template v-slot:prepend-item>
              <v-list-item ripple @mousedown.prevent @click="toggle()">
                <v-list-item-action>
                  <v-icon v-if="listLocation.length === locationID.length"> mdi-close-box </v-icon>
                  <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> Select All </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:selection="{ index }">
              <span v-if="index == 0"> {{ locationID.length }} selected </span>
            </template>
          </v-autocomplete>
          <v-select
            v-model="activityTypeID"
            item-text="text"
            append-icon="keyboard_arrow_down"
            item-value="id"
            :items="
              activityTypeList.map(res => {
                return { ...res, text: res.name + ' - ' + res.code }
              })
            "
            label="Activity type"
            outlined
            :class="'select-input'"
            dense
          ></v-select></div
      ></v-col>
    </v-row>
    <div class="d-flex justify-space-between align-center mb-2">
      <h4>Total : {{ listActivitiesRigister.length }} records</h4>
      <div>
        <v-btn
          v-if="permission.cFull"
          color="primary"
          @click="
            regisSelect = {}
            dialogForm = true
          "
          >Add new registration</v-btn
        >
      </div>
    </div>
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
        hide-default-header
        :class="'elevation-0 activity-note-table'"
        fixed-header
        height="69vh"
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
            <th v-for="header in props.headers" :style="{ minWidth: '80px' }" :key="header.text">
              <div v-if="filters.hasOwnProperty(header.value)">
                <Autocomplete
                  v-if="filters.hasOwnProperty(header.value)"
                  @setFilter="setFilter"
                  :styleBorder="'border-bottom'"
                  :keyFilter="header.value"
                  :selectedInit="filters[header.value]"
                  :listItem="
                    header.value === 'remark'
                      ? ['Remark', 'No Remark']
                      : groupColumnValueList(header.value)
                  "
                />
              </div>
            </th>
          </tr>
        </template>

        <template v-slot:[`item.no`]="{ index }">
          <p :style="{ textAlign: 'center' }" @click="view(item.userID)">{{ index + 1 }}</p>
        </template>
        <template v-slot:[`item.studentCode`]="{ item }">
          <p
            :style="{ textAlign: 'center' }"
            class="link w-80"
            @click="viewAccount(item.stuUserID)"
          >
            {{ item.studentCode }}
          </p>
        </template>
        <template v-slot:[`item.studentName`]="{ item }">
          <p
            :style="{ textAlign: 'center' }"
            class="link w-150"
            @click="viewAccount(item.stuUserID)"
          >
            {{ item.studentName }}
          </p>
        </template>
        <template v-slot:[`item.classCode`]="{ item }">
          <p
            :style="{ textAlign: 'center' }"
            class="link w-150"
            @click="viewClassDetail(item.classID)"
          >
            {{ item.classCode }}
          </p>
        </template>
        <template v-slot:[`item.qc`]="{ item }">
          <p :style="{ textAlign: 'center' }" class="link w-200" @click="viewAccount(item.qcID)">
            {{ item.qc }}
          </p>
        </template>
        <template v-slot:[`item.registrationStatus`]="{ item }">
          <p
            :class="item.registrationStatus == 'No response' ? 'No' : item.registrationStatus"
            class="w-80 statusRe"
          >
            {{ item.registrationStatus }}
          </p>
        </template>
        <template v-slot:[`item.remark`]="{ item }">
          <p :style="{ textAlign: 'center' }" v-if="item.remark === '' || item.remark === null">
            -
          </p>
          <p :style="{ textAlign: 'center' }" class="w-80" v-else>
            {{ item.remark }}
          </p>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="setLog({ openDialog: true, register: item })"
                  src="../../assets/images/icon-edit-pen.svg"
                  alt=""
                  srcset=""
                />
              </template>
              <span>Edit</span>
            </v-tooltip>
          </div>
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
    </template>
    <FormRegister
      :regisInfor="regisSelect"
      @setLog="setLog"
      v-if="dialogForm"
      @callData="callDataWithNoLoading"
      :dialog="dialogForm"
    />
  </div>
</template>

<script>
import FormRegister from './FormRegister.vue'
import Autocomplete from '@/components/Utils/Autocomplete.vue'

import dayjs from 'dayjs'
import { activities } from '@/api/activities'
// import { activities } from '@/api/activities'
import { getObjectPermission } from '../../common/index'
export default {
  components: { Autocomplete, FormRegister },
  data() {
    return {
      regisSelect: {},
      listActivitiesRigister: [],
      isLoading: false,
      page: 1,
      dayjs: dayjs,
      sideRemark: '',
      pageCount: 0,
      itemsPerPage: 20,
      isEdit: false,
      overlay: false,
      activityRegistrationID: 0,
      makeupInfor: {},
      dialogForm: false,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      listLocation: [],
      locationID: [],
      activityTypeList: [],
      activityTypeID: '',
      headers: [
        {
          text: 'No',
          value: 'no',
          width: '50px',
          sortable: false,
        },
        {
          text: 'Stu code',
          value: 'studentCode',
          width: '100px',
          sortable: false,
        },
        {
          text: 'Student name',
          value: 'studentName',
          width: '150px',
          sortable: false,
        },
        {
          text: 'Class',
          value: 'classCode',
          width: '100px',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qc',
          width: '150px',
          sortable: false,
        },
        {
          text: 'Activity code',
          value: 'activityCode',
          width: '100px',
          sortable: false,
        },
        {
          text: 'Registration status',
          value: 'registrationStatus',
          width: '100px',
          sortable: false,
        },
        {
          text: 'Note',
          value: 'remark',
          width: '300px',
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          width: '50px',
          sortable: false,
        },
      ],
      permission: getObjectPermission(406),
      filters: {
        activityRegistrationID: [],
        studentCode: [],
        studentName: [],
        classCode: [],
        qc: [],
        activityCode: [],
        registrationStatus: [],
        remark: [],
      },
    }
  },
  computed: {
    filtered() {
      return this.listActivitiesRigister.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'remark'
              ? this.filters[f].reduce((value, el) => {
                  if (d.remark?.length > 0 && el === 'Remark') {
                    value = true
                  }
                  if ((d.remark === '' || d.remark === null) && el === 'No Remark') {
                    value = true
                  }
                  return value
                }, false)
              : this.filters[f].includes(d[f]))
          )
        })
      })
    },
  },
  setup() {
    return {}
  },
  created() {
    this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.listLocation.unshift({
      locationID: 0,
      location: 'No center',
    })
    this.locationID = [JSON.parse(localStorage.getItem('currentCenter'))]
    if (localStorage.getItem('reAcType'))
      this.activityTypeID = parseInt(localStorage.getItem('reAcType'))
    if (localStorage.getItem('reAcFilter'))
      this.filters = JSON.parse(localStorage.getItem('reAcFilter'))
    this.getListType()
    this.init()
  },

  watch: {
    locationID: function () {
      localStorage.setItem('reAcCenter', JSON.stringify(this.locationID))
      this.init()
    },
    activityTypeID: function () {
      localStorage.setItem('reAcType', this.activityTypeID)
      this.init()
    },
  },
  methods: {
    toggle() {
      this.locationID =
        this.locationID.length === this.listLocation.length
          ? []
          : this.listLocation.map(e => e.locationID)
    },
    changeLocation() {
      console.log(this.locationID)
      this.getListRegis()
    },
    async getListType() {
      this.loading = true
      await activities
        .getListType()
        .then(res => {
          this.activityTypeList = res
          this.activityTypeID = this.activityTypeList[0]?.id
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.activityTypeList = []
        })
    },
    viewDetailActivity() {
      this.$router.push({ name: 'activity-detail' })
    },
    editActivity(id) {
      this.$router.push({
        name: 'create-activity',
        query: {
          activityID: id,
        },
      })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('reAcFilter', JSON.stringify(this.filters))
    },
    openForm(makeupInfor) {
      this.makeupInfor = makeupInfor
      this.dialogForm = true
    },

    setLog(data) {
      this.dialogForm = data.openDialog ? data.openDialog : false
      this.regisSelect = data.register ? data.register : {}
    },
    groupColumnValueList(val) {
      return this.listActivitiesRigister.map(d => d[val]).filter(y => y)
    },

    viewAccount(studentID) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: studentID,
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
      this.isLoading = true
      await activities
        .getListRegis(
          this.locationID.length > 0 ? this.locationID.join(',') : '',
          this.activityTypeID
        )
        .then(res => {
          if (res?.status) {
            this.listActivitiesRigister = []
          } else {
            this.listActivitiesRigister = res.map(res => {
              this.isLoading = false
              return {
                ...res,
                startDate: res?.startDate && dayjs(res?.startDate).format('DD/MM/YYYY'),
                endDate: res?.endDate && dayjs(res?.endDate).format('DD/MM/YYYY'),
                registrationDate:
                  res?.registrationDate && dayjs(res?.registrationDate).format('DD/MM/YYYY'),
              }
            })
          }
        })
        .catch(() => {
          this.isLoading = false
          this.listActivitiesRigister = []
        })
    },
    async callDataWithNoLoading() {
      await activities
        .getListRegis(this.locationID, this.activityTypeID)
        .then(res => {
          if (res?.status) {
            this.listActivitiesRigister = []
          } else {
            this.listActivitiesRigister = res.map(res => {
              return {
                ...res,
                startDate: res?.startDate && dayjs(res?.startDate).format('DD/MM/YYYY'),
                endDate: res?.endDate && dayjs(res?.endDate).format('DD/MM/YYYY'),
                registrationDate:
                  res?.registrationDate && dayjs(res?.registrationDate).format('DD/MM/YYYY'),
              }
            })
          }
        })
        .catch(() => {
          this.listActivitiesRigister = []
        })
    },
    remarkOnChange(value) {
      this.sideRemark = value
    },
    saveRemark() {
      activities.updateStudentRemark(this.activityRegistrationID, this.sideRemark)
      this.overlay = false
      this.init()
    },

    btn_Edit() {
      this.isEdit = true
    },
    openEditNote(item) {
      if (item.remark == null || item.remark == '') this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      this.activityRegistrationID = item.activityRegistrationID
      this.sideRemark = item.remark
    },
    // end take note
  },
}
</script>

<style lang="scss" scoped>
/* take note */
.h {
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 1000;
  left: 0;
}
.card-i {
  width: 500px;
  position: absolute;
  top: 50%;

  left: 50%;
  transform: translate(-50%, -50%);
}
.btnNote {
  float: right;
  margin-top: 20px;
}
.btnNote button {
  margin-left: 20px;
  min-width: 150px !important;
}

/* end take note */
.select-input {
  max-width: 200px;
  margin-right: 20px !important;
}
.activity-note-table th,
td {
  min-width: 80px;
}
h4 {
  margin-bottom: 14px;
}
h2 {
  margin-bottom: 20px;
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
.statusRe {
  color: #ffff;
  width: 100px;
  text-align: center;
  padding: 5px 6px;
  border-radius: 5px;
}
.Registered,
.Full {
  background: #27ae60;
}
.Potential {
  background: #246aff;
}
.No,
.Unpaid,
.Rejected {
  background: #dc322d;
}
.Waiting,
.Advance {
  background: #f6b91a;
}
.Cancel {
  background: #848484;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
