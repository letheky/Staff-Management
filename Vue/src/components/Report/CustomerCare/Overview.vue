<template>
  <div id="cus-management" class="mt-5 ml-10 mr-10">
    <div class="mb-5 d-flex justify-space-between">
      <h2>Customer Care Report</h2>
    </div>
    <v-row md="12" no-gutters>
      <v-col>
        <v-row class="mb-4">
          <v-select
            class="ml-1"
            :items="locationPermissions"
            item-text="location"
            item-value="locationID"
            append-icon="keyboard_arrow_down"
            outlined
            dense
            :class="'input-select'"
            hide-details
            placeholder="Center"
            v-model="locationID"
          >
          </v-select>
          <v-text-field
            type="date"
            v-model="fromDate"
            outlined
            dense
            @input="dateChangeFrom"
            :class="'input-select ml-1'"
            hide-details
            lable="From Date"
          />
          <v-text-field
            type="date"
            v-model="toDate"
            outlined
            @input="dateChangeTo"
            lable="To Date"
            :style="{ width: '150px' }"
            :class="'input-select ml-1'"
            dense
          />
        </v-row>
        <!-- <v-autocomplete
            v-model="select"
            :items="classStatus"
            label="Class status"
            item-text="classStatus"
            item-value="classStatusID"
            outlined
            dense
          ></v-autocomplete> -->
      </v-col>

      <v-col sm="2"> </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>

    <v-tabs v-model="model">
      <v-tab>
        <p>Customer care detail</p>
      </v-tab>
      <v-tab>
        <p>View by class</p>
      </v-tab>
      <v-tab> Summary </v-tab>
    </v-tabs>

    <v-tabs-items v-model="model">
      <v-tab-item>
        <CusCareDetail
          v-if="!isLoading"
          :data="dataCusCare"
          :toDate="toDate"
          :fromDate="fromDate"
          :locationID="locationID"
        />
      </v-tab-item>
      <v-tab-item>
        <CusByClass
          :toDate="toDate"
          :fromDate="fromDate"
          :locationID="locationID"
          v-if="!isLoading"
          :tabs="model"
          :data="dataCusCare"
        />
      </v-tab-item>
      <v-tab-item>
        <CusSummary
          :toDate="toDate"
          :fromDate="fromDate"
          :locationID="locationID"
          v-if="!isLoading"
          :tabs="model"
          :data="dataCusCare"
        />
      </v-tab-item>
    </v-tabs-items>

    <!-- <v-row class="mt-2 pl-2 pr-2">
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
              </v-row> -->

    <!-- <popup-confirm
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
      </popup-confirm> -->
    <!-- <v-row justify="center">
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
      </v-row> -->
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { customer_care } from '@/api/customer_care'
import CusCareDetail from './CusCareDetail.vue'
import CusByClass from './CusByClass.vue'
import CusSummary from './CusSummary.vue'
export default {
  components: {
    CusCareDetail,
    CusSummary,
    CusByClass,
  },
  data() {
    return {
      model: 0,
      locationID: parseInt(localStorage.getItem('currentCenter')),
      dataCusCare: [],
      locationList: [],
      isLoading: false,
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2)
        .toISOString()
        .split('T')[0],
      toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split('T')[0],
      locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
    }
  },
  created() {
    this.init()
    if (localStorage.getItem('CusFrom')) this.fromDate = localStorage.getItem('CusFrom')
    if (localStorage.getItem('CusTo')) this.toDate = localStorage.getItem('CusTo')
    if (localStorage.getItem('CusCenter'))
      this.locationID = JSON.parse(localStorage.getItem('CusCenter'))
  },
  computed: {
    filtered() {
      return this.courseList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  watch: {
    locationID: function () {
      localStorage.setItem('CusCenter', this.locationID)
      localStorage.removeItem('CusSummaryFilter')
      localStorage.removeItem('CusDetailFilter')
      localStorage.removeItem('CusClassFilter')
      this.getListCustomerCare()
    },
    select: function () {
      this.getListCustomerCare()
    },
    fromDate : function(){

    } , 
    toDate : function (){

    }
  },
  methods: {
    dateChangeTo(date) {
      localStorage.setItem('CusTo', this.toDate)
      localStorage.setItem('CusFrom', this.fromDate)
      this.toDate = date
      this.getListCustomerCare()
      localStorage.removeItem('CusSummaryFilter')
      localStorage.removeItem('CusDetailFilter')
      localStorage.removeItem('CusClassFilter')
    },
    dateChangeFrom(date) {
      localStorage.setItem('CusFrom', this.fromDate)
      localStorage.setItem('CusTo', this.toDate)
      this.getListCustomerCare()
      this.fromDate = date
      localStorage.removeItem('CusSummaryFilter')
      localStorage.removeItem('CusDetailFilter')
      localStorage.removeItem('CusClassFilter')
    },
    async getListCustomerCare() {
      this.isLoading = true
      const from = localStorage.getItem('CusFrom') ? localStorage.getItem('CusFrom')  : this.fromDate; 
      const to = localStorage.getItem('CusTo')   ? localStorage.getItem('CusTo')  : this.toDate ; 
      console.log(localStorage.getItem('CusFrom'))
      await customer_care.getCustomerCare(this.locationID, from, to).then(res => {
        this.dataCusCare = res
        this.isLoading = false
        //   this.courseList = res.map((item)=>{
        //     return {...item ,startDate: new Date(item.startDate.split("T")[0]).toLocaleDateString() , endDate : new Date(item.endDate.split("T")[0]).toLocaleDateString()}
        //   })
      })
    },
    async init() {
      this.getListCustomerCare()
    },

    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#revenueTable th:nth-child(1),
#revenueTable td:nth-child(1) {
  position: sticky;
  left: 0;
}
#revenueTable th:nth-child(1),
#revenueTable td:nth-child(1) {
  background: rgb(255, 255, 255);
}
#revenueTable th:nth-child(1),
#revenueTable th:nth-child(1) {
  z-index: 3;
}
#account-management {
  margin: 40px;
}
.ticky-left {
  position: sticky !important;
  left: 0;
}
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
  git .v-list-item--active::before {
    border-radius: 2px;
  }
}
.input-select {
  max-width: 190px;
}
</style>
