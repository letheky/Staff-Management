<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-10">Feedback Management</h2>
          <div :class="'d-flex justify-space-between'">
            <div :style="{ width: '100%' }" class="mb-3 d-flex align-center">
              <v-text-field
                outlined
                dense
                class="mr-3"
                v-model="searchKey"
                label="User name"
                :class="'select-input'"
                placeholder=""
              ></v-text-field>
              <v-select
                v-model="locationIDs"
                class="mr-3"
                item-text="location"
                append-icon="keyboard_arrow_down"
                item-value="locationID"
                :items="centerList"
                label="Center"
                outlined
                multiple
                :class="'select-input'"
                dense
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="toggleCenter()">
                    <v-list-item-action>
                      <v-icon
                        v-if="
                          locationIDs.length ==
                          centerList
                            .map(d => d.locationID)
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
                  <span v-if="index == 0"> {{ locationIDs.length }} selected </span>
                </template></v-select
              >
              <v-select
                v-model="status"
                class="mr-3"
                item-text="status"
                append-icon="keyboard_arrow_down"
                item-value="id"
                :items="listStatus"
                label="Select status"
                outlined
                multiple
                :class="'select-input'"
                dense
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="toggleStatus()">
                    <v-list-item-action>
                      <v-icon
                        v-if="
                          status.length ==
                          listStatus
                            .map(d => d.id)
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
              </v-select>
              <v-text-field
                type="date"
                class="mr-3"
                v-model="fromDate"
                outlined
                dense
                hide-details
              />
              <v-text-field type="date" v-model="toDate" outlined dense class="mr-3" hide-details />

              <v-btn @click="changeSearch" color="primary">Search </v-btn>
            </div>
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
                    </v-autocomplete> -->
                  </div>
                </th>
              </tr>
            </template>

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.isResolved`]="{ item }">
              <div v-if="item.isResolved === 'Resolved'" class="d-flex justify-center">
                <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
              </div>
              <div v-else class="d-flex justify-center">
                <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
              </div>
            </template>
            <template v-slot:[`item.fullName`]="{ item }">
              <p :class="' link'" @click="viewProfileByUserId(item.userID)">
                {{ item.fullName }}
              </p>
            </template>
            <template v-slot:[`item.username`]="{ item }">
              <p :class="' link'" @click="viewProfileByUserId(item.userID)">
                {{ item.username }}
              </p>
            </template>
            <template v-slot:[`item.resolvedBy`]="{ item }">
              <p class="link" @click="viewProfileByUserId(item.resolved_userID)">
                {{ item.resolvedBy }}
              </p>
            </template>
            <template v-slot:[`item.classCode`]="{ item }">
              <p :class="' link'" @click="viewDetailClass(item.classID)">
                {{ item.classCode }}
              </p>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-icon
                size="18"
                color="primary"
                @click="
                  feedBackID = item.generaiID
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
              <v-icon size="18" @click="viewDetail(item)" color="primary">visibility </v-icon>
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
import message from '@/components/Utils/message'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: {
    'popup-confirm': PopupConfirm,
    Autocomplete,
  },
  data() {
    return {
      isLoading: false,
      searchKey: '',
      page: 1,
      listStatus: [
        {
          status: 'Done',
          id: 'DONE',
        },
        {
          status: 'Not done',
          id: 'OPEN',
        },
      ],
      locationIDs: [parseInt(localStorage.getItem('currentCenter'))],
      pageCount: 0,
      itemsPerPage: 20,
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
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
          value: 'location',
          sortable: false,
          width: '13%',
        },
        {
          text: 'User code',
          value: 'username',
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
          value: 'category',
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
          value: 'crtdDate',
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
          value: 'resolvedBy',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Resolved time',
          value: 'resolvedAt',
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
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2)
        .toISOString()
        .split('T')[0],
      toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split('T')[0],
      newListFiltered: [],
      filters: {
        location: [],
        username: [],
        resolvedBy: [],
        fullName: [],
        category: [],
        classCode: [],
        crtdDate: [],
        isResolved: [],
        resolverName: [],
        resolvedAt: [],
      },
      feedbackPermission: process.env.VUE_APP_ENV_FUNCTION_FEEDBACK,
      errorDialog: false,
      message: message,
      status: '',
    }
  },
  created() {
    if (localStorage.getItem('fbmSearch')) {
      const dataSearch = JSON.parse(localStorage.getItem('fbmSearch'))
      ;(this.fromDate = dataSearch.fromDate),
        (this.toDate = dataSearch.toDate),
        (this.locationIDs = dataSearch.locationIDs),
        (this.searchKey = dataSearch.searchKey),
        (this.status = dataSearch.status)
    }
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
    //   selectLocation(){
    //  this.init()
    //   } ,
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    viewProfileByUserId(userId) {
      if (userId)
        this.$router.push({
          name: 'account-management-view-account',
          params: {
            userId: userId,
          },
        })
    },
    changeSearch() {
      const dataSearch = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        locationIDs: this.locationIDs,
        searchKey: this.searchKey,
        status: this.status,
      }
      localStorage.setItem('fbmSearch', JSON.stringify(dataSearch))
      this.init()
    },
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    async init() {
      const dataSearch = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        locationIDs: this.locationIDs.join(','),
        searchKey: this.searchKey,
        status: this.status.length < 1 ? '' : this.status[0],
      }
      await center_managerment.getFeedBackByAdmin(dataSearch).then(res => {
        this.newListFiltered = res.map(item => {
          return {
            ...item,
            crtdDate: this.formatTime(item.crtdDate),
            isResolved: item.status === 'DONE' ? 'Resolved' : 'Unresolved',
          }
        })
      })
    },

    formatTime(date) {
      if (new Date(date) !== 'Invalid Date') {
        const fbTimeArr = date.split('T')
        return (
          new Date(fbTimeArr[0]).toLocaleDateString() +
          ', ' +
          fbTimeArr[1].split(':')[0] +
          ':' +
          fbTimeArr[1].split(':')[1]
        )
      } else {
        return ''
      }
    },
    groupColumnValueList(val) {
      return this.newListFiltered.map(d => d[val]).filter(y => y)
    },
    toggleStatus() {
      this.$nextTick(() => {
        if (
          this.status.length ==
          this.listStatus
            .map(d => d.id)
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.status = []
        } else {
          this.status = this.listStatus
            .map(d => d.id)
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
    toggleCenter() {
      this.$nextTick(() => {
        if (
          this.locationIDs.length ==
          this.centerList
            .map(d => d.locationID)
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.locationIDs = []
        } else {
          this.locationIDs = this.centerList
            .map(d => d.locationID)
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
    viewDetail(general) {
      localStorage.setItem('generalID', general.generaiID)
      this.$router.push({
        name: 'center-management-feedback-messenger-admin',
        query: {
          generalID: general.generaiID,
          classID: general.classID,
        },
      })
    },
    cancelDelete() {},
    confirmDelete() {
      center_managerment.deleteFeedback(this.feedBackID).then(() => {
        this.init()
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
<style lang="scss" scoped>
.link {
  cursor: pointer;
  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.select-input {
  width: 150px;
}
</style>
