<template>
  <div class="absent">
    <h2>Side Activities List</h2>
    <v-row :class="'absent-header justify-space-between align-center'">
      <v-col>
        <div :class="' d-flex justify-start'">
          <v-select
            v-model="locationIDs"
            item-text="location"
            append-icon="keyboard_arrow_down"
            item-value="locationID"
            :items="listLocation"
            label="Center"
            outlined
            multiple
            :class="'select-input'"
            dense
          >
            <template v-slot:prepend-item>
              <v-list-item ripple @mousedown.prevent @click="toggle()">
                <v-list-item-action>
                  <v-icon v-if="listLocation.length == locationIDs.length"> mdi-close-box </v-icon>
                  <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title> Select All </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:selection="{ index }">
              <span v-if="index == 0"> {{ locationIDs.length }} selected </span>
            </template>
          </v-select>
        </div></v-col
      >
    </v-row>
    <div class="d-flex justify-space-between align-center mb-2">
      <h4>Total : {{ listActivities.length }} records</h4>
      <div v-if="permission.cFull">
        <v-btn @click="$router.push({ name: 'create-activity' })" color="primary">Create new</v-btn>
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

        <template v-slot:[`item.no`]="{ index }">
          <p @click="view(item.userID)">{{ index + 1 }}</p>
        </template>
        <template v-slot:[`item.createBy`]="{ item }">
          <p class="link" @click="viewAccount(item.createUserID)">{{ item.createBy }}</p>
        </template>
        <template v-slot:[`item.locationIDs`]="{ item }">
          <p>{{ item.locationIDs.map(e => e.location).join(' , ') }}</p>
        </template>
        <template v-slot:[`item.saveType`]="{ item }">
          <p
            class="status"
            :style="{
              color: '#ffff',
              background: item.saveType === 'PUBLIC' ? '#27AE60' : '#F6B91A',
            }"
          >
            {{ item.saveType }}
          </p>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex align-center">
            <v-tooltip v-if="permission.cFull || permission.cModify" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="editActivity(item.activityID)"
                  src="../../assets/images/icon-edit-pen.svg"
                  alt=""
                  srcset=""
                />
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  class="ml-2 mr-2"
                  @click="viewDetailActivity(item.activityID)"
                  src="../../assets/images/icon-eye.svg"
                  alt=""
                  srcset=""
                />
              </template>
              <span>View activity</span>
            </v-tooltip>
            <v-tooltip v-if="permission.cFull" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="$refs.confirmDelete.open(), (deleteActivityID = item.activityID)"
                  src="../../assets/images/icon-delete.svg"
                  alt=""
                  srcset=""
                />
              </template>
              <span>Delete</span>
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
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="550"
      confirmText="Yes, delete it!"
      :width="width"
      ref="confirmDelete"
    >
      <v-card-title :class="'pt-0'" slot="icon">
        <div :style="{ margin: '0 auto' }">
          <img src="../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
      ></v-card-title>
      <v-card-title :class="'pt-0 pb-0'" slot="title">
        <h2 :style="{ width: '100%' }" class="text-center">Confirm delete</h2>
      </v-card-title>
      <v-card-title :class="'pt-0'" slot="content">
        <p :style="{ width: '100%' }" class="text-center">Are you sure to delete this activity?</p>
      </v-card-title>
    </popup-confirm>
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'

import dayjs from 'dayjs'
import { activities } from '@/api/activities'
import { getObjectPermission } from '../../common/index'

export default {
  components: { Autocomplete, 'popup-confirm': PopupConfirm },
  data() {
    return {
      listActivities: [],
      isLoading: false,
      page: 1,
      dayjs: dayjs,
      pageCount: 0,
      permission: getObjectPermission(405),
      itemsPerPage: 20,
      makeupInfor: {},
      dialogForm: false,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      listLocation: [],
      locationIDs: [],
      headers: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Activity code',
          value: 'activityCode',
          sortable: false,
        },
        {
          text: 'Activity title',
          value: 'title',
          sortable: false,
        },
        {
          text: 'Activity type',
          value: 'activityTypeName',
          sortable: false,
        },
        {
          text: 'Center',
          value: 'locationIDs',
          sortable: false,
        },
        {
          text: 'Create user',
          value: 'createBy',
          sortable: false,
        },
        {
          text: 'Create Time',
          value: 'createAt',
          sortable: false,
        },
        {
          text: 'Registered Num',
          value: 'registeredNumber',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'saveType',
          sortable: false,
        },
        {
          text: 'Start time',
          value: 'startDate',
          sortable: false,
        },
        {
          text: 'Duration',
          value: 'duration',
          sortable: false,
        },
        {
          text: 'End time',
          value: 'endDate',
          sortable: false,
        },

        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
      deleteActivityID: 0,
      filters: {
        activityCode: [],
        title: [],
        activityTypeName: [],

        createAt: [],
        createBy: [],

        locationIDs: [],
        registeredNumber: [],
        saveType: [],
        startDate: [],
        duration: [],
        endDate: [],
      },
    }
  },
  computed: {
    filtered() {
      return this.listActivities?.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'locationIDs'
              ? this.filters[f].reduce((value, el) => {
                  console.log(el, d)
                  if (d.locationIDs.find(e => e.location === el)) {
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

    if (localStorage.getItem('activityCenter')) {
      this.locationIDs = JSON.parse(localStorage.getItem('activityCenter'))
    } else {
      this.locationIDs = [parseInt(localStorage.getItem('currentCenter'))]
    }
    if (localStorage.getItem('activityFilter')) {
      this.filters = JSON.parse(localStorage.getItem('activityFilter'))
    }

    this.init()
  },

  watch: {
    locationIDs: function () {
      localStorage.setItem('activityCenter', JSON.stringify(this.locationIDs))
      this.init()
    },
  },
  methods: {
    editActivity(id) {
      this.$router.push({
        name: 'create-activity',
        query: {
          activityID: id,
        },
      })
    },
    confirmDelete() {
      this.deleteActivity()
    },
    async deleteActivity() {
      await activities.deleteActivity(this.deleteActivityID).then(() => {
        this.callDataWithNoLoading()
      })
    },
    viewDetailActivity(activityID) {
      this.$router.push({ name: 'activity-detail', query: { activityID } })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('activityFilter', JSON.stringify(this.filters))
    },
    openForm(makeupInfor) {
      this.makeupInfor = makeupInfor
      this.dialogForm = true
    },
    toggle() {
      if (this.listLocation.length === this.locationIDs.length) {
        this.locationIDs = []
      } else {
        this.locationIDs = this.listLocation.map(it => it.locationID)
      }
    },
    setLog(data) {
      this.dialogForm = data.openDialog ? data.openDialog : false
      this.makeupInfor = data.makeup ? data.makeup : ''
    },
    groupColumnValueList(val) {
      if (val === 'locationIDs') {
        return this.listActivities
          .map(d => d[val])
          .filter(y => y)
          .reduce((arr, e) => {
            arr = [...arr, ...e]
            return arr
          }, [])
          .map(e => e.location)
      }
      return this.listActivities.map(d => d[val]).filter(y => y)
    },

    viewAccount(studentID) {
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

    async init() {
      this.loading = true
      const stringSearch =
        this.locationIDs.length === 0
          ? this.listLocation.map(i => i.locationID).join(',')
          : this.locationIDs?.join(',')
      await activities.getListActivitiesSearch(stringSearch).then(res => {
        this.listActivities = res.map(activity => {
          return {
            ...activity,
            startDate: activity.startDate ? dayjs(activity.startDate).format('DD/MM/YYYY') : '',
            endDate: activity.endDate ? dayjs(activity.endDate).format('DD/MM/YYYY') : '',
            createAt: activity.createAt ? dayjs(activity.createAt).format('DD/MM/YYYY') : '',
          }
        })
        this.loading = false
      })
    },
    async callDataWithNoLoading() {
      const stringSearch =
        this.locationIDs.length === 0
          ? this.listLocation.map(i => i.locationID).join(',')
          : this.locationIDs?.join(',')
      await activities.getListActivitiesSearch(stringSearch).then(res => {
        this.listActivities = res.map(activity => {
          return {
            ...activity,
            startDate: activity.startDate ? dayjs(activity.startDate).format('DD/MM/YYYY') : '',
            endDate: activity.endDate ? dayjs(activity.endDate).format('DD/MM/YYYY') : '',
            createAt: activity.createAt ? dayjs(activity.createAt).format('DD/MM/YYYY') : '',
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
.status {
  color: #fff;
  text-align: center;
  width: 80px;
  border-radius: 4px;
  padding: 3px 10px;
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
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
