<template>
  <div class="out-st" id="center-management">
    <v-row no-gutters class="pb-3">
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-4">Achievements & Rewards</h2>
          <v-row>
            <v-col md="3" :class="'d-flex arch-select'">
              <v-select
                :items="centerList"
                item-text="location"
                item-value="locationID"
                append-icon="keyboard_arrow_down"
                outlined
                dense
                label="Center"
                hide-details
                placeholder="Center"
                v-model="locationID"
                @change="changeLocation"
              >
              </v-select>
              <v-text-field
                @input="changeFrom"
                type="date"
                label="From date"
                v-model="fromDate"
                outlined
                dense
                hide-details
              />
              <v-text-field
                @input="changeTo"
                type="date"
                label="To date"
                v-model="toDate"
                outlined
                dense
                hide-details
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between pt-4 pb-4">
            <span> Total: {{ rewardList.length }} Rewards </span>
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
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            hide-default-footer
            hide-default-header
            class="elevation-0 spendingTable"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <thead>
                <tr>
                  <th
                    v-for="header in props.headers"
                    :key="header.value"
                    :style="{ textAlign: 'center', minWidth: header.minWidth }"
                  >
                    {{ header.text }}
                  </th>
                </tr>
              </thead>
              <tr class="fixed-row-filter">
                <td v-for="header in props.headers" :key="header.text" class="headerOueding">
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
                </td>
              </tr>
            </template>
            <template class="m-100" v-slot:[`item.classCode`]="{ item }">
              <p class="link" @click="viewDetailClass(item.classID)">{{ item.classCode }}</p>
            </template>
            <template class="m-100" v-slot:[`item.no`]="{ index }">
              <p>{{ index + 1 }}</p>
            </template>
            <template class="m-100" v-slot:[`item.studentName`]="{ item }">
              <p class="link" @click="viewDetailProfile(item.stuUserID)">{{ item.studentName }}</p>
            </template>
            <template class="m-60" v-slot:[`item.studentCode`]="{ item }">
              <p class="link" @click="viewDetailProfile(item.stuUserID)">{{ item.studentCode }}</p>
            </template>
            <template class="m-60" v-slot:[`item.qcName`]="{ item }">
              <p :style="{ textAlign: 'center'}" v-if="item.qcName === null || item.qcName ==='' "> - </p>
              <p :style="{ textAlign: 'center'}" v-else class="link" @click="viewDetailProfile(item.qc_userID)">{{ item.qcName }}</p>
            </template>
            <template v-slot:[`item.referLink`]="{ item }">
              <a
                class="w-80 d-flex align-center justify-center"
                target="_blank"
                :href="item.referLink"
                ><img class="mr-2" src="../../../assets/images/icon-link.svg" alt="" srcset="" />
                <span class="link">Link</span>
              </a>
            </template>
            <template v-slot:[`item.certiLink`]="{ item }">
              <div
                @click="viewCertiLink(item.certiLink)"
                class="w-80 d-flex align-center text-center justify-center"
              >
                <img class="mr-2" src="../../../assets/images/icon-link.svg" alt="" srcset="" />
                <span class="link">View</span>
              </div>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <div class="d-flex align-center">
                <v-tooltip v-if="permision.cFull" top>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        $refs.confirmDelete.open()
                        deleteID = item.rewardID
                      "
                      :class="'link'"
                      :style="{ marginRight: '10px' }"
                      src="../../../assets/images/icon-delete.svg"
                    />
                  </template>
                  <span>Delete</span>
                </v-tooltip>
                <v-tooltip v-if="permision.cFull || permision.cModify" top>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      v-bind="attrs"
                      v-on="on"
                      :class="'link'"
                      @click="() => openRewardLog(item)"
                      :style="{ marginRight: '10px' }"
                      src="../../../assets/images/icon-edit-underline.svg"
                    />
                  </template>
                  <span>Edit</span>
                </v-tooltip>
              </div>
            </template>
            <!-- <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.studentCode }}</td>
                <td>
                  <p :style="{ width: '100px' }">{{ item.studentName }}</p>
                </td>
                <td>{{ item.mobilePhone }}</td>
                <td>{{ item.dob }}</td>
                <td>
                  <p
                    :class="'link'"
                    @click="viewDetailClass(item.classID)"
                    :style="{ width: '100px' }"
                  >
                    {{ item.classCode }}
                  </p>
                </td>
                <td>{{ item.startDate }}</td>
                <td>{{ item.endDate }}</td>
                <td>{{ item.dueDate }}</td>
                <td>{{ item.dueMonth }}</td>
                <td align="right">
                  {{ item.outstandingFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                </td>
                <td align="right">
                  {{ item.studentAccountBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                </td>
                <td>
                  <p :style="{ width: '150px' }">{{ item.qc }}</p>
                </td>
                <td>
                  <p :style="{ width: '150px' }">{{ item.ec }}</p>
                </td>
              </tr>
            </template> -->
          </v-data-table>
          <v-footer
            color="#fff"
            class="pb-2 pr-15"
            padless
            :style="
              $store.state.isActiveSidebar
                ? 'width: calc(100% - 100px)'
                : 'width: calc(100% - 258px)'
            "
            style="display: flex; justify-content: space-between"
          >
            <div>
              <v-select
                outlined
                hide-details
                dense
                :value="itemsPerPage"
                :items="[20, 50, 100, 200]"
                @change="itemsPerPage = parseInt($event, 10)"
                style="height: 32px"
              ></v-select>
            </div>
            <v-col md="4" class="d-flex align-center justify-end">
              <h3 v-if="filtered.length != 1"></h3>
              <h3></h3>
            </v-col>
            <div>
              <v-pagination
                v-model="page"
                :length="pageCount"
                :total-visible="7"
                elevation="0"
              ></v-pagination>
            </div>
          </v-footer>
        </div>
      </v-col>
    </v-row>
    <FormReward
      :dialog="dialogReward"
      :reward="rewardSelect"
      :type="'update'"
      @callData="getRewardList"
      @setLog="setLogReward"
    />
    <div v-show="dialogImg" :class="'dig-video'">
      <v-dialog content-class="elevation-0" persistent width="800px" v-model="dialogImg">
        <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
          <img
            @click="dialogImg = false"
            :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
            src="../../../assets/images/icon-close2.svg"
            alt=""
          />
        </div>
        <v-card class="pt-5 pl-5 pr-7 pb-4 d-flex flex-column" width="800px" height="600px">
          <div class="d-flex justify-center" :style="{ width: 'fit-content', marginLeft: 'auto' }">
            <div class="d-flex align-center link-toNewTab mb-3 mr-3">
              <img src="../../../assets/images/icon-download.svg" alt="" />
              <p class="link ml-2" @click="dowmload">Download</p>
            </div>
            <div class="d-flex align-center link-toNewTab mb-3">
              <img src="../../../assets/images/icon-link.svg" alt="" />
              <a class="link ml-2" :href="url" target="_blank">Open link in new tab</a>
            </div>
          </div>
          <div
            :style="{
              width: '100%',
              background: '#000',
              flex: 1,
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
            }"
          >
            <div :class="'dialog'">
              <img :style="{ maxHeight: '100%', width: '100%' }" :src="url" />
            </div>
          </div>
        </v-card>
      </v-dialog>
    </div>
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="450"
      confirmText="Yes, delete it!"
      :width="width"
      ref="confirmDelete"
    >
      <v-card-title :class="'pt-1 pb-1'" slot="icon">
        <div :style="{ margin: '0 auto' }">
          <img src="../../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
      ></v-card-title>
      <v-card-title :class="'pt-1 pb-1'" slot="title">
        <h2 :style="{ width: '100%', fontSize: '24px' }" class="text-center">Confirm delete</h2>
      </v-card-title>
      <v-card-title :class="'pt-1 pb-1 mb-3 justify-center'" slot="content">
        <p class="text-center" :style="{ fontSize: '14px', lineHeight: '20px' }">
          Are you sure to delete this achievement & reward? <br />You can not undo this action.
        </p>
      </v-card-title>
    </popup-confirm>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import Autocomplete from '@/components/Utils/Autocomplete.vue'
import { rewardApi } from '@/api/reward.js'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import { saveAs } from 'file-saver'
import FormReward from './FormReward.vue'
import { getObjectPermission } from '../../../common/index'
export default {
  components: { 'popup-confirm': PopupConfirm, Autocomplete, FormReward },
  data() {
    return {
      dialogReward: false,
      deleteID: 0,
      dialogImg: false,
      page: 1,
      permision: getObjectPermission(401),
      pageCount: 0,
      itemsPerPage: 20,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDZsW_sjb-tTvyqY1UFlWuBi9el6mBTNG60A&usqp=CAU',
      rewardSelect: {},
      isLoading: false,
      fromDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      toDate: dayjs().format('YYYY-MM-DD'),
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
        },
        { text: 'Stu code', value: 'studentCode', minWidth: '80px' },
        { text: 'Student name', value: 'studentName', minWidth: '150px' },
        { text: 'Class code', value: 'classCode', minWidth: '150px' },
        { text: 'QC', value: 'qcName', minWidth: '200px' },
        { text: 'Reward type', value: 'rewardType' },
        { text: 'Description', value: 'description' },

        { text: 'Date', value: 'rewardDate' },
        { text: 'Refer link', value: 'referLink', align: 'center' },
        { text: 'Certi link', value: 'certiLink', align: 'center' },

        { text: 'Action', value: 'action' },
      ],
      rewardList: [],
      locationID: JSON.parse(localStorage.getItem('currentCenter')),
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,

      filters: {
        studentCode: [],
        studentName: [],
        classCode: [],
        qcName:[],
        rewardType: [],
        description: [],
        rewardDate: [],
        // referLink: [],
        // certiLink: [],
      },
    }
  },
  computed: {
    filtered() {
      return this.rewardList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    if (localStorage.getItem('rewardLocation')) {
      this.locationID = JSON.parse(localStorage.getItem('rewardLocation'))
    }
    if (localStorage.getItem('rewardFromDate')) {
      this.fromDate = dayjs(localStorage.getItem('rewardFromDate')).format('YYYY-MM-DD')
    }
    if (localStorage.getItem('rewardToDate')) {
      this.toDate = dayjs(localStorage.getItem('rewardToDate')).format('YYYY-MM-DD')
    }

    if (localStorage.getItem('rewardFilter')) {
      this.filters = JSON.parse(localStorage.getItem('rewardFilter'))
    }
    this.getRewardList()
  },
  methods: {
    dowmload: function () {
      saveAs(this.url)
    },
    cancelDelete() {},
    confirmDelete() {
      this.deleteReward(this.deleteID)
    },
    viewCertiLink(link) {
      this.url = link
      this.dialogImg = true
    },
    changeTo() {
      localStorage.setItem('rewardToDate', this.toDate)
      this.resetFilter()
      this.getRewardList()
    },
    changeFrom() {
      localStorage.setItem('rewardFromDate', this.fromDate)
      this.resetFilter()
      this.getRewardList()
    },
    setLogReward(data) {
      console.log(data)
      this.dialogReward = data.openLog
      this.rewardSelect = data.reward
    },
    openRewardLog(item) {
      this.setLogReward({
        openLog: true,
        reward: item,
      })
      this.rewardSelect = item
    },
    async deleteReward(rewardID) {
      await rewardApi.deleteReward(rewardID).then(() => {
        this.getRewardList()
      })
    },
    resetFilter() {
      this.filters = {
        studentCode: [],
        studentName: [],
        classCode: [],
        rewardType: [],
        description: [],
        rewardDate: [],
      }
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('rewardFilter', JSON.stringify(this.filters))
    },
    changeLocation() {
      localStorage.setItem('rewardLocation', this.locationID)
      this.resetFilter()
      this.getRewardList()
    },
    viewDetailClass(classID) {
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
    async init() {
      this.isLoading = false
    },
    async getRewardList() {
      this.isLoading = true
      await rewardApi.getRewardList(this.locationID, this.fromDate, this.toDate).then(res => {
        this.rewardList = res.map(reward => {
          return {
            ...reward,
            rewardDate: dayjs(reward.rewardDate).format('DD/MM/YYYY'),
          }
        })
        this.isLoading = false
      })
    },

    groupColumnValueList(val) {
      return this.rewardList.map(d => d[val]).filter(y => y)
    },

    _dayjs: dayjs,
  },
}
</script>
<style>
/* .out-st .theme--light.v-data-table.v-data-table--fixed-header thead th {
  background: #0b2585 !important;
  box-shadow: inset 0 -1px 0 rgb(0 0 0 / 12%);
}

.theme--light.v-data-table.v-data-table--fixed-header thead th>span {
  color: #ffff !important;
  font-weight: 100;
} */
.arch-select > * {
  width: 170px;
  margin-right: 10px !important;
}
.spendingTable tbody tr:nth-child(odd) {
  background-color: #bde6fbb0;
}
.dialog {
  position: absolute;
  width: fit-content;
  overflow: hidden;
  height: auto;
  margin: auto;
  width: 100%;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.cur {
  cursor: pointer;
}
.m-100 {
  min-width: 100px;
}
.m- .text-center {
  text-align: center;
}
</style>
