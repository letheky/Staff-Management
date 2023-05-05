<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-10">Feedback</h2>
          <div>
            <span class="mr-4"
              >From: {{ _dayjs(fromTime).format('DD/MM/YYYY') }}, To:
              {{ _dayjs(toTime).format('DD/MM/YYYY') }}</span
            >
            <span
              ><v-icon size="20" color="blue" class="mb-2">mdi-replay</v-icon
              ><a
                style="text-decoration: underline; color: #2196f3"
                @click="$refs.confirmFilter.open()"
                >Change filter</a
              ></span
            >
          </div>
          <div class="d-flex justify-space-between">
            <div>Total: {{ newsList.length }} feedbacks</div>
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
            :items="newsList"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0 mb-3"
            fixed-header
            height="58vh"
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
                    <v-autocomplete
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
                                newListFiltered
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
            </template>

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.isResolved`]="{ item }">
              <div v-if="item.isResolved" class="d-flex justify-center">
                <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
              </div>
              <div v-else class="d-flex justify-center">
                <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
              </div>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-icon
                size="18"
                color="primary"
                @click="
                  feedBackID = item.recordID
                  $refs.confirmDelete.open()
                "
                v-if="
                  functionRole.filter(
                    x =>
                      (x.functionID == feedbackPermission && x.cModify == true) ||
                      (x.functionID == feedbackPermission && x.cFull == true)
                  ).length == 1
                "
                >mdi-delete</v-icon
              >
              <v-icon size="18" @click="viewDetail(item.recordID)" color="primary"
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
            v-model="itemsPerPage"
            :items="[20, 50, 100, 200]"
            style="height: 32px"
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="newsList.length > 1">Total: {{ newsList.length }} records</h3>
          <h3 v-else>Total: {{ newsList.length }} record</h3>
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
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="error"
      ref="confirmDelete"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="error" class="mb-5" outline>mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm detele</h2>
        <p class="text-center" style="font-size: 14px">
          Are you sure to delete feedback? This action <br />
          cannot be undone
        </p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
    <popup-filter
      @confirm="confirmFilter"
      @cancel="cancelFilter"
      :maxWidth="maxWidth"
      :width="widthFilter"
      ref="confirmFilter"
    >
      <v-card-title slot="title" class="pt-0 mb-5 pa-0">
        <h4 class="mb-5">Filter the feedback</h4>
        <div class="mb-3">
          <date-picker
            :model="fromDate"
            @update:model="updateFromDate"
            title="From date"
            style="width: 300px"
          ></date-picker>
        </div>
        <div>
          <date-picker
            :model="toDate"
            @update:model="updateToDate"
            title="To date"
            style="width: 300px"
          ></date-picker>
        </div>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-filter>
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
import { center_managerment } from '@/api/center-management.js'
import dayjs from 'dayjs'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import PopupFilter from '@/components/CenterManagement/FeedBackManagement/PopupFilter.vue'
import DatePicker from '@/components/Utils/DatePicker.vue'
import message from '@/components/Utils/message'

export default {
  components: {
    'popup-confirm': PopupConfirm,
    'popup-filter': PopupFilter,
    'date-picker': DatePicker,
  },
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
          sortable: false,
          width: '5%',
        },
        {
          text: 'Center',
          value: 'locationName',
          sortable: false,
          width: '13%',
        },
        {
          text: 'User code',
          value: 'userCode',
          sortable: false,
          width: '12%',
        },
        {
          text: 'User name',
          value: 'fullName',
          sortable: false,
          width: '13%',
        },
        {
          text: 'Feedback about',
          value: 'type',
          sortable: false,
          width: '12%',
        },
        {
          text: 'Class',
          value: 'classCode',
          sortable: false,
          width: '13%',
        },
        {
          text: 'Feedback time',
          value: 'feedbackTime',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Resolved',
          value: 'isResolved',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Resolved by',
          value: 'resolverName',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Resolved time',
          value: 'resolveTime',
          sortable: false,
          width: '10%',
        },
        { text: 'Action', value: 'action', sortable: false, width: '5%' },
      ],
      feedBackID: '',
      error: 'error',
      maxWidth: 1000,
      width: 420,
      widthFilter: 380,
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      totalRecord: null,
      fromTime: this.$route.params.fromDate,
      toTime: this.$route.params.toDate,
      fromDate: this.$route.params.fromDate,
      toDate: this.$route.params.toDate,
      newListFiltered: [],
      filters: {
        locationName: [],
        userCode: [],
        fullName: [],
        type: [],
        classCode: [],
        feedbackTime: [],
        isResolved: [],
        resolverName: [],
        resolveTime: [],
      },
      feedbackPermission: process.env.VUE_APP_ENV_FUNCTION_FEEDBACK,
      errorDialog: false,
      message: message,
    }
  },
  created() {
    this.init()
  },
  computed: {
    newsList() {
      return this.newListFiltered.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  methods: {
    async init() {
      this.isLoading = true
      this.newListFiltered = []
      await center_managerment.feedBackSearch(this.fromTime, this.toTime).then(res => {
        if (res && !res.errors) {
          res.forEach(x => {
            this.newListFiltered.push({
              locationName: x.locationName,
              userCode: x.userCode,
              fullName: x.fullName,
              classCode: x.classCode,
              feedbackTime: x.feedbackTime ? dayjs(x.feedbackTime).format('DD/MM/YYYY HH:mm') : '',
              isResolved: x.isResolved,
              resolverName: x.resolverName,
              resolveTime: x.resolveTime ? dayjs(x.resolveTime).format('DD/MM/YYYY HH:mm') : '',
              type: x.type,
              recordID: x.recordID,
            })
          })
        } else {
          this.errorDialog = true
        }
      })
      this.isLoading = false
    },
    groupColumnValueList(val) {
      return this.newListFiltered.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.newListFiltered
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
          this.filters[value] = this.newListFiltered
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
    viewDetail(recordID) {
      this.$router.push({
        name: 'feedback-management-view-detail',
        params: {
          feedBackID: recordID,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
      })
    },
    cancelDelete() {},
    confirmDelete() {
      center_managerment.feedBackDelete(this.feedBackID).then(res => {
        if (res.status === 200) {
          this.init()
        }
      })
    },
    cancelFilter() {},
    confirmFilter() {
      this.$router.push({
        name: 'center-management-feedback',
        params: {
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
      })
      this.fromTime = this.fromDate
      this.toTime = this.toDate
      this.init()
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
<style lang="scss" scoped></style>
