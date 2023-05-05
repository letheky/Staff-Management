<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-10">News list</h2>
          <div class="d-flex justify-space-between">
            <div>Total: {{ newsList.length }} News</div>
            <div class="d-flex justify-space-between">
              <router-link :to="{ name: 'center-management-creat-news' }">
                <v-btn
                  color="primary"
                  class="ml-4"
                  elevation="0"
                  v-if="
                    functionRole.filter(
                      x =>
                        (x.functionID == newsPermission && x.cModify == true) ||
                        (x.functionID == newsPermission && x.cFull == true)
                    ).length == 1
                  "
                  >Create news</v-btn
                >
              </router-link>
            </div>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <div class="pb-10">
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="newsList"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @pageCount="pageCount"
              class="elevation-0"
              fixed-header
              height="60vh"
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
                        :keyFilter="header.value"
                        :styleBorder="'border-bottom'"
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
                          <span v-if="index == 0">
                            {{ filters[header.value].length }} selected
                          </span>
                        </template>
                      </v-autocomplete> -->
                    </div>
                  </th>
                </tr>
              </template>

              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.crtdDate`]="{ item }">
                {{ item.crtdDate }}
              </template>

              <template v-slot:[`item.lUpdDate`]="{ item }">
                {{ item.lUpdDate }}
              </template>

              <template v-slot:[`item.title`]="{ item }">
                <span @click="viewNew(item.newsID, item.status)" style="cursor: pointer">{{
                  item.title
                }}</span>
              </template>

              <!-- <template v-slot:item.photo="{ item }">
              {{ item.photo }}
              <img
                v-if="item.photo"
                :src="'data:image/jpeg;base64,' + item.photo"
              />
              <v-icon size="40" v-else> image </v-icon>
            </template> -->

              <template v-slot:[`item.status`]="{ item }">
                <v-chip small text-color="blue">{{ item.status }}</v-chip>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <v-icon
                  size="18"
                  @click="viewDetail(item.newsID, item.status)"
                  color="primary"
                  v-if="
                    functionRole.filter(
                      x =>
                        (x.functionID == newsPermission && x.cModify == true) ||
                        (x.functionID == newsPermission && x.cFull == true)
                    ).length == 1
                  "
                  >mdi-pencil</v-icon
                >
                <v-icon
                  size="18"
                  color="primary"
                  @click="
                    newID = item.newsID
                    $refs.confirmDelete.open()
                  "
                  v-if="
                    functionRole.filter(
                      x =>
                        (x.functionID == newsPermission && x.cModify == true) ||
                        (x.functionID == newsPermission && x.cFull == true)
                    ).length == 1
                  "
                  >mdi-delete</v-icon
                >
              </template>
            </v-data-table>
          </div>
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
          >
          </v-select>
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
            @input="changePage()"
          >
          </v-pagination>
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
        <p class="text-center">Are you sure to delete new?</p>
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

const querystring = require('querystring')

export default {
  components: {
    'popup-confirm': PopupConfirm,
    Autocomplete,
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
        { text: 'Title', value: 'title', sortable: false, width: '25%' },
        {
          text: 'Created date',
          value: 'crtdDate',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Created by',
          value: 'crtdUser',
          sortable: false,
          width: '13%',
        },
        {
          text: 'Updated date',
          value: 'lUpdDate',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Updated by',
          value: 'lUpdUser',
          sortable: false,
          width: '13%',
        },
        { text: 'Status', value: 'status', sortable: false, width: '10%' },
        { text: 'Action', value: 'action', sortable: false, width: '5%' },
      ],
      // newsList: [],
      newID: '',
      error: 'error',
      maxWidth: 1000,
      width: 400,
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      totalRecord: null,
      newListFiltered: [],
      filters: {
        title: [],
        crtdDate: [],
        crtdUser: [],
        lUpdDate: [],
        lUpdUser: [],
        status: [],
      },
      newsPermission: process.env.VUE_APP_ENV_FUNCTION_NEWS,
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
  watch: {
    itemsPerPage: function (value) {
      if (value) {
        this.isLoading = true
        let body = {
          pageIndex: this.page,
          pageSize: value,
        }
        center_managerment.NewsOverview(querystring.stringify(body)).then(res => {
          if (res) {
            this.newListFiltered = res.news
            this.isLoading = false
            this.pageCount = Math.floor(
              res.totalCount % value == 0 ? res.totalCount / value : res.totalCount / value + 1
            )
            this.totalRecord = res.totalCount
          }
        })
      }
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
      this.newListFiltered = []
      let body = {
        pageIndex: this.page,
        pageSize: this.itemsPerPage,
      }
      await center_managerment.NewsOverview(querystring.stringify(body)).then(res => {
        if (res.mess && res.mess.message == 'OK') {
          res.news.forEach(x => {
            this.newListFiltered.push({
              contentImage: x.contentImage,
              contentText: x.contentText,
              crtdDate: dayjs(x.crtdDate).format('DD/MM/YYYY HH:mm'),
              crtdUser: x.crtdUser,
              isActive: x.isActive,
              lUpdDate: dayjs(x.lUpdDate).format('DD/MM/YYYY HH:mm'),
              lUpdUser: x.lUpdUser,
              newsID: x.newsID,
              status: x.status == 'PUBLIC' ? 'PUBLISHED' : x.status,
              stt: x.stt,
              title: x.title,
            })
          })
          // this.newListFiltered = res.news;
          this.pageCount = Math.floor(
            res.totalCount % this.itemsPerPage == 0
              ? res.totalCount / this.itemsPerPage
              : res.totalCount / this.itemsPerPage + 1
          )
          this.totalRecord = res.totalCount
        } else {
          this.errorDialog = true
        }
      })
      this.isLoading = false
    },
    groupColumnValueList(val) {
      return this.newListFiltered.map(d => d[val])
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
    changePage() {
      this.init()
    },
    viewDetail(newsID, status) {
      if (status == 'PUBLISHED') {
        this.$router.push({
          name: 'center-management-edit-news-public',
          params: {
            newsID: newsID,
            pageIndex: this.page,
            pageSize: this.itemsPerPage,
          },
        })
      } else {
        this.$router.push({
          name: 'center-management-edit-news-draft',
          params: {
            newsID: newsID,
            pageIndex: this.page,
            pageSize: this.itemsPerPage,
          },
        })
      }
    },
    viewNew(newsID) {
      this.$router.push({
        name: 'center-management-view-news-management',
        params: {
          newsID: newsID,
          pageIndex: this.page,
          pageSize: this.itemsPerPage,
        },
      })
    },
    cancelDelete() {},
    confirmDelete() {
      center_managerment.DeleteNew(this.newID).then(res => {
        if (res.message == 'OK') {
          this.init()
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
<style lang="scss" scoped></style>
