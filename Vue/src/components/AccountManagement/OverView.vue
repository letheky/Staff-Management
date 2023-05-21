<template>
  <div id="account-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2>Account management</h2>
          <div class="d-flex">
            <v-btn @click="addNewAccount()" color="primary" class="mr-3">Create account</v-btn>
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
                      <div>{{ role.accountTypeName }}</div>
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

              <template v-slot:[`item.username`]="{ item }">
                <span class="link" @click="viewDetail(item.userID)">{{ item.username }}</span>
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                <span class="text-center"
                  ><p>
                    {{
                      _dayjs(item.createdAt).format('DD/MM/YYYY') +
                      ' - ' +
                      _dayjs(item.createdAt).format('HH:mm:ss')
                    }}
                  </p></span
                >
              </template>

              <template v-slot:[`item.updatedAt`]="{ item }">
                <span class="text-center"
                  ><p>
                    {{
                      _dayjs(item.createdAt).format('DD/MM/YYYY') +
                      ' - ' +
                      _dayjs(item.createdAt).format('HH:mm:ss')
                    }}
                  </p></span
                >
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex align-center">
                  <!-- <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(item.userID)"
                        src="../../assets/images/icon-edit-pen.svg"
                        alt=""
                        srcset=""
                        class="btn-pointer"
                      />
                    </template>
                    <span>Chỉnh sửa</span>
                  </v-tooltip> -->
                  <!-- <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        v-bind="attrs"
                        v-on="on"
                        class="ml-2 mr-2 btn-pointer"
                        @click=";(userID = item.userID), $refs.viewDetailReference.open()"
                        src="../../assets/images/icon-eye.svg"
                        alt=""
                        srcset=""
                      />
                    </template>
                    <span>Xem chi tiết</span>
                  </v-tooltip> -->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        v-bind="attrs"
                        v-on="on"
                        @click="$refs.confirmDeleteReference.open(), (deleteUserID = item.userID)"
                        src="../../assets/images/icon-delete.svg"
                        alt=""
                        srcset=""
                        class="btn-pointer"
                      />
                    </template>
                    <span>Xóa user</span>
                  </v-tooltip>
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
      @confirm="confirmDeleteReference"
      :maxWidth="550"
      confirmText="Vâng, tôi muốn xóa!"
      ref="confirmDeleteReference"
    >
      <v-card-title :class="'pt-0'" slot="icon">
        <div :style="{ margin: '0 auto' }">
          <img src="../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
      ></v-card-title>
      <v-card-title :class="'pt-0 pb-0'" slot="title">
        <h2 :style="{ width: '100%' }" class="text-center">Xác nhận xóa</h2>
      </v-card-title>
      <v-card-title :class="'pt-0'" slot="content">
        <p :style="{ width: '100%' }" class="text-center">
          Bạn có chắc muốn xóa người dùng này không? <br />
          Hành động này không thể hồi phục.
        </p>
      </v-card-title>
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
      userID: -1,
      deleteUserID: -1,
      accountTypes: [],
      selectedAccountType: null,
      userList: [],
      userListFiltered: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'STT',
          value: 'no',
          sortable: false,
          width: '5%',
        },
        {
          text: 'Tên tài khoản',
          value: 'username',
          sortable: false,
          width: '20%',
        },
        { text: 'Vị trí', value: 'accountTypeName', sortable: false, width: '20%' },
        { text: 'Ngày tạo tài khoản', value: 'createdAt', sortable: false, width: '20%' },
        { text: 'Ngày cập nhật tài khoản', value: 'updatedAt', sortable: false, width: '20%' },
        { text: 'Action', value: 'action', sortable: false, width: '15%' },
      ],
      filters: {
        username: [],
        createdAt: [],
        updateAt: [],
      },
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      maxWidth: 1000,
      width: 500,
      errorDialog: false,
      message: message,
    }
  },
  created() {
    this.init()
  },
  computed: {
    filtered() {
      const listUser = this.userListFiltered.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
      return listUser
    },
  },
  watch: {
    selectedAccountType(value) {
      this.userListFiltered = this.userList.filter(x => x.roleid == value)
      this.filters.username = []
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    confirmDeleteReference() {
      this.deleteReference()
    },
    async deleteReference() {
      await account_managerment.deleteUser(this.deleteUserID).then(() => {
        this.callDataWithNoLoading()
      })
    },
    async init() {
      this.isLoading = true
      this.accountTypes = [
        {
          accountTypeID: 1,
          accountTypeName: 'admin',
        },
        {
          accountTypeID: 2,
          accountTypeName: 'teacher',
        },
        {
          accountTypeID: 3,
          accountTypeName: 'student',
        },
      ]
      await account_managerment
        .getAllUser()
        .then(res => {
          this.userList = []
          this.userListFiltered = []
          if (res.length > 0) {
            this.userListFiltered = res
            this.userList = res
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
      this.isLoading = false
    },
    groupColumnValueList(val) {
      return this.userListFiltered.map(d => d[val])
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
    addNewAccount() {
      this.$router.push({
        name: 'account-management-add-new',
      })
    },
    async callDataWithNoLoading() {
      this.accountTypes = [
        {
          accountTypeID: 1,
          accountTypeName: 'admin',
        },
        {
          accountTypeID: 2,
          accountTypeName: 'teacher',
        },
        {
          accountTypeID: 3,
          accountTypeName: 'student',
        },
      ]
      await account_managerment
        .getAllUser()
        .then(res => {
          this.userList = []
          this.userListFiltered = []
          if (res.length > 0) {
            this.userListFiltered = res
            this.userList = res
          }
        })
        .catch(() => {
          this.errorDialog = true
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
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
