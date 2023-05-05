<template>
  <div id="account-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2>Account management</h2>
          <div class="d-flex">
            <v-select
              v-if="
                centerList.length > 0 &&
                currentUser.locationPermissions[0].accountTypeName != 'Teacher'
              "
              :items="centerList"
              item-text="location"
              item-value="locationID"
              append-icon="keyboard_arrow_down"
              outlined
              dense
              hide-details
              style="max-width: 300px"
              class="mr-3"
              multiple
              small-chips
              deletable-chips
              placeholder="Select the list of centers"
              v-model="locationList"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0">
                  <span>{{ item.location }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text text-caption">
                  (+{{ locationList.length - 1 }} others)
                </span>
              </template>
            </v-select>
            <v-btn @click="addNewAccount()" color="primary" class="mr-3">Create account</v-btn>
            <v-btn @click="addAccountToCenter()" color="primary">Add account to center</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="px-10">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-if="!isLoading">
      <v-row no-gutters>
        <v-col
          md="3"
          style="background: linear-gradient(180deg, #ffffff 0%, #f9f8ff 44.79%)"
          class="pr-0"
        >
          <div class="pa-10 pt-0 pr-5" style="height: calc(100vh - 160px)">
            <h3>Role list</h3>
            <v-list class="role-list" color="transparent">
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="role in accountTypes"
                  :key="role.accountTypeID"
                  class="px-0 mb-2"
                  @click="selectedAccountType = role.accountTypeID"
                >
                  <v-list-item-content class="pa-0 rounded-sm">
                    <v-list-item-title class="item">
                      <div>
                        {{
                          role.accountTypeName == 'Parental'
                            ? 'Guardian'
                            : role.accountTypeName == 'Guess'
                            ? 'Guest'
                            : role.accountTypeName
                        }}
                      </div>
                      <div>
                        {{ userList.filter(x => x.accountTypeName == role.accountTypeName).length }}
                        accounts
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-col>
        <v-col md="9" class="pl-0">
          <div class="pl-0 pr-0 pb-10 pt-0">
            <h3>
              <template v-if="accountTypes.find(x => x.accountTypeID == selectedAccountType)"
                >{{
                  accountTypes.find(x => x.accountTypeID == selectedAccountType).accountTypeName
                }}
              </template>
              <template v-else> All </template>

              list
            </h3>
            <v-data-table
              :headers="headers"
              :items="filtered"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-header
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-0"
              fixed-header
              height="65vh"
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

              <template v-slot:[`item.userName`]="{ item }">
                <span @click="viewDetail(item.userID)">{{ item.userName }}</span>
              </template>

              <template v-slot:[`item.fullName`]="{ item }">
                <span @click="viewDetail(item.userID)">{{ item.fullName }}</span>
              </template>

              <template v-slot:[`item.dob`]="{ item }">
                <span @click="viewDetail(item.userID)">{{
                  _dayjs(item.dob).format('DD/MM/YYYY')
                }}</span>
              </template>

              <template v-slot:[`item.mobilePhone`]="{ item }">
                <span @click="viewDetail(item.userID)">{{ item.mobilePhone }}</span>
              </template>

              <template v-slot:[`item.groupName`]="{ item }">
                <span v-if="item.accountTypeID == 5" @click="viewDetail(item.userID)">
                  {{ item.groupName }}
                </span>
              </template>
              <template v-slot:[`item.locationt`]="{ item }">
                <span @click="viewDetail(item.userID)">
                  <p class="mt-1 mb-1" v-for="(it, index) in item.locationt" :key="index">
                    - {{ it }}
                  </p>
                </span>
              </template>
              <template v-slot:[`item.statusActive`]="{ item }">
                <v-chip
                  small
                  v-if="item.statusActive == 'Inactive'"
                  color="rgba(247, 119, 26, 0.1)"
                  >{{ 'Inactive' }}</v-chip
                >
                <v-chip small v-else color="rgba(36, 106, 255, 0.1)">Active</v-chip>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <i
                        v-bind="attrs"
                        v-on="on"
                        @click="viewDetail(item.userID)"
                        class="cursor isax isax-eye fs-18 font-weight-bold mr-4"
                      ></i>
                    </template>
                    <span>View detail account</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <i
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(item.userID)"
                        class="cursor isax isax-edit-2 fs-18 font-weight-bold mr-4"
                      ></i>
                    </template>
                    <span>Edit account</span>
                  </v-tooltip>
                  <v-tooltip top v-if="item.accountTypeID != 4 && item.isActive == 'Active'">
                    <template v-slot:activator="{ on, attrs }">
                      <i
                        v-bind="attrs"
                        v-on="on"
                        class="cursor isax isax-user-remove fs-18 font-weight-bold mr-4"
                        style="color: red"
                        @click="$refs.confirmDeactive.open(item.userID)"
                      ></i>
                    </template>
                    <span>Deactive account</span>
                  </v-tooltip>
                  <v-tooltip top v-else-if="item.accountTypeID != 4 && item.isActive == 'Inactive'">
                    <template v-slot:activator="{ on, attrs }">
                      <i
                        v-bind="attrs"
                        v-on="on"
                        class="cursor isax isax-user-tick fs-18 font-weight-bold mr-4"
                        style="color: green"
                        @click="$refs.confirmActive.open(item.userID)"
                      ></i>
                    </template>
                    <span>Active account</span>
                  </v-tooltip>
                  <v-menu v-if="item.accountTypeID == 4">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon height="18" width="18" v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="viewCalendar(item.teacherID, item.fullName)">
                        <v-list-item-title>Calendar</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="viewFreeTime(item.teacherID, item.fullName)">
                        <v-list-item-title>Time available</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="viewLeaveOfAbsence(item.teacherID, item.fullName)">
                        <v-list-item-title>Leave of Absence</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="item.statusActive == 'Active'"
                        @click="$refs.confirmDeactive.open(item.userID)"
                      >
                        <v-list-item-title>Deactive </v-list-item-title>
                      </v-list-item>
                      <v-list-item v-else @click="$refs.confirmActive.open(item.userID)">
                        <v-list-item-title>Active</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <div v-else>
                    <v-icon
                      v-if="item.statusActive == 'Active'"
                      @click="$refs.confirmDeactive.open(item.userID)"
                      :style="{ fontSize: '20px', marginTop: '-10px', color: 'red' }"
                      class="cursor isax isax-user-remove fs-14 font-weight-bold mr-4"
                    ></v-icon>
                    <v-icon
                      v-else
                      :style="{ fontSize: '20px', marginTop: '-10px', color: 'green' }"
                      @click="$refs.confirmActive.open(item.userID)"
                      class="cursor isax isax-user-tick fs-14 font-weight-bold mr-4"
                    ></v-icon>
                  </div>
                </div>
              </template>
            </v-data-table>
            <v-row class="mt-2 pl-2 pr-2">
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
              <v-col class="d-flex align-center justify-end">
                <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} accounts</h3>
                <h3 v-else>Total: {{ filtered.length }} account</h3>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  :total-visible="7"
                  elevation="0"
                ></v-pagination>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </template>
    <popup-confirm
      @confirm="confirmActive"
      @cancel="cancelActive"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="'success'"
      ref="confirmActive"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="success" class="mb-5" outline>mdi-checkbox-marked-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm active</h2>
        <p class="text-center">Are you sure to active this account?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
    <popup-confirm
      @confirm="confirmDeactive"
      @cancel="cancelDeactive"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="'error'"
      ref="confirmDeactive"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="error" class="mb-5" outline>mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm deactive</h2>
        <p class="text-center">Are you sure to deactive this account?</p>
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
import dayjs from 'dayjs'
import { account_managerment } from '@/api/account-management.js'
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
      accountTypes: [],
      selectedAccountType: null,
      userList: [],
      userListFiltered: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'User name',
          value: 'userName',
          sortable: false,
          width: '15%',
        },
        { text: 'Full name', value: 'fullName', sortable: false, width: '20%' },
        { text: 'Birthday', value: 'dob', sortable: false, width: '10%' },
        {
          text: 'Phone number',
          value: 'mobilePhone',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Center',
          value: 'locationt',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Group',
          value: 'groupName',
          sortable: false,
          width: '10%',
        },

        { text: 'Status', value: 'statusActive', sortable: false, width: '10%' },
        { text: 'Action', value: 'action', sortable: false, width: '5%' },
      ],
      filters: {
        userName: [],
        fullName: [],
        groupName: [],
        statusActive: [],
        locationt: [],
      },
      locationList: [],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      maxWidth: 1000,
      width: 500,
      inactive: '',
      locationIds: [],
      errorDialog: false,
      message: message,
    }
  },
  created() {
    this.locationList = [parseInt(localStorage.getItem('currentCenter'))]
    this.init()
  },
  computed: {
    filtered() {
      console.log(this.userListFiltered)
      const listUser = this.userListFiltered.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'locationt'
              ? this.filters.locationt.some(element => d.locationt.includes(element))
              : this.filters[f].includes(d[f]))
          )
        })
      })

      // console.log(
      //   listUser.reduce((arr, item) => {
      //     if (arr) {
      //       if () {
      //         console.log(item)
      //         if (
      //           arr
      //             .find(element => element.userID === item.userID)
      //             .listLocations.find(i => i.locationID === item.locationID)
      //         ) {
      //           arr[
      //             arr
      //               .map(function (e) {
      //                 return e.userID
      //               })
      //               .indexOf(item.userID)
      //           ] = {
      //             ...arr.find(element => element.userID === item.userID),
      //             listLocations: arr
      //               .find(element => element.userID === item.userID)
      //               .listLocations.push({
      //                 locationID: item.locationID,
      //                 location: item.location,
      //               }),
      //           }
      //         }
      //       } else {
      //         arr.push({
      //           ...item,
      //           listLocations: [{ locationID: item.locationID, location: item.location }],
      //         })
      //       }
      //     }
      //     return arr
      //   }, [])
      // )
      return listUser
    },
  },
  watch: {
    selectedAccountType(value) {
      this.userListFiltered = this.userList.filter(x => x.accountTypeID == value)
      this.filters.userName = []
      this.filters.fullName = []
      this.filters.groupName = []
      this.filters.isActive = []
    },
    async locationList(value) {
      this.locationIds = []
      this.locationIds = value
      if (this.locationIds && this.locationIds.length > 0) {
        this.userList = []
        this.userListFiltered = []
        this.isLoading = true
        await account_managerment.getUserList(this.locationIds).then(res => {
          if (res.mess.message == 'Ok') {
            console.log(res.salary)
            let dataList = res.salary.res.salary
              .filter(element => element.accountTypeID !== 0)
              .reduce((arr, item) => {
                if (arr.find(element => element.userID === item.userID) !== undefined) {
                  arr[arr.map(el => el.userID).indexOf(item.userID)] = {
                    ...arr.find(element => element.userID === item.userID),
                    locationt: [
                      ...arr.find(element => element.userID === item.userID).locationt,
                      item.location,
                    ],
                  }
                } else {
                  arr.push({
                    ...item,
                    locationt: [item.location],
                    statusActive: item.isActive ? 'Inactive' : 'Active',
                  })
                }
                return arr
              }, [])
            this.userListFiltered = dataList
            this.userList = dataList
          }
        })
      } else {
        this.locationIds = []
        this.userList = []
        this.userListFiltered = []
        this.init()
      }
      this.isLoading = false
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    async init() {
      this.isLoading = true
      await account_managerment.getAccountTypes().then(res => {
        if (res) {
          this.accountTypes = res
        }
      })

      this.centerList.forEach(x => {
        this.locationIds.push(x.locationID)
      })

      await account_managerment
        .getUserList(this.locationIds)
        .then(res => {
          this.userList = []
          this.userListFiltered = []
          if (res.mess.message == 'Ok') {
            console.log(res.salary)
            let dataList = res.salary
              .filter(element => element.accountTypeID !== 0)
              .reduce((arr, item) => {
                if (arr.find(element => element.userID === item.userID) !== undefined) {
                  arr[arr.map(el => el.userID).indexOf(item.userID)] = {
                    ...arr.find(element => element.userID === item.userID),
                    locationt: [
                      ...arr.find(element => element.userID === item.userID).locationt,
                      item.location,
                    ],
                  }
                } else {
                  arr.push({
                    ...item,
                    locationt: [item.location],
                    statusActive: item.isActive ? 'Inactive' : 'Active',
                  })
                }
                return arr
              }, [])
            this.userListFiltered = dataList
            this.userList = dataList
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
      this.isLoading = false
    },
    groupColumnValueList(val) {
      if (val === 'locationt') {
        return this.userListFiltered.map(d => d.location)
      }
      return this.userListFiltered.map(d => d[val])
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.userListFiltered
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
          this.filters[value] = this.userListFiltered
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
    viewDetail(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: { userId: userId },
      })
    },
    edit(userId) {
      this.$router.push({
        name: 'account-management-update-account',
        params: { userId: userId }, //this.currentUser.userInfo.userID
      })
    },
    viewCalendar(teacherId, teacherName) {
      localStorage.setItem('teacherName', JSON.stringify(teacherName))
      this.$router.push({
        name: 'account-management-view-teacher-calendar',
        params: { teacherId: teacherId },
      })
    },
    viewFreeTime(teacherId, teacherName) {
      localStorage.setItem('teacherName', JSON.stringify(teacherName))
      this.$router.push({
        name: 'account-management-view-teacher-free-time',
        params: { teacherId: teacherId },
      })
    },
    viewLeaveOfAbsence(teacherId, teacherName) {
      localStorage.setItem('teacherName', JSON.stringify(teacherName))
      this.$router.push({
        name: 'account-management-view-teacher-leave-of-absence',
        params: { teacherId: teacherId },
      })
    },
    addNewAccount() {
      this.$router.push({
        name: 'account-management-add-new',
      })
    },
    addAccountToCenter() {
      this.$router.push({ name: 'account-management-add-account-to-center' })
    },
    cancelDeactive() {},
    confirmDeactive(userId) {
      this.inactive = false
      account_managerment.deactiveUser(userId, this.inactive).then(res => {
        if (res.code == 200) {
          location.reload()
          //   this.isLoading = false;
        }
      })
    },
    cancelActive() {},
    confirmActive(userId) {
      this.inactive = true
      account_managerment.deactiveUser(userId, this.inactive).then(res => {
        if (res.code == 200) {
          location.reload()
          // this.isLoading = false;
        }
      })
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.role-list {
  .item {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(194, 196, 205, 0.1);
    border-radius: 2px;
    padding: 14px 20px 16px 20px;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .v-list-item--active:hover::before,
  .v-list-item--active::before {
    border-radius: 2px;
  }
}
</style>
