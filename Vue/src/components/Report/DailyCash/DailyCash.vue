<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div>
            <h2>Daily Cash</h2>
          </div>
          <div class="d-flex justify-space-between mt-5">
            <div class="d-flex">
              <v-autocomplete
                label="Center"
                v-model="locationID"
                :items="centers"
                item-text="location"
                item-value="locationID"
                outlined
                dense
                hide-details
              ></v-autocomplete>
              <v-text-field
                label="From"
                type="date"
                v-model="fromDate"
                outlined
                dense
                class="ml-7 mr-2"
                style="width: 200px"
              ></v-text-field>
              <v-text-field
                label="To"
                type="date"
                v-model="toDate"
                outlined
                dense
                style="width: 200px"
                class="mr-2"
              ></v-text-field>
            </div>
          </div>
          <v-tabs v-model="tab" class="tab-container mb-5">
            <v-tab style="font-weight: 500; font-size: 1rem">System daily report</v-tab>
            <v-tab style="font-weight: 400; font-size: 1rem">Sale new</v-tab>
            <v-tab style="font-weight: 400; font-size: 1rem">Sale re-enrollment</v-tab>
            <!-- <v-tab>Sale result</v-tab> -->
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <SystemDaily
                :centerId="locationID"
                :fromDate="fromDate"
                :toDate="toDate"
              ></SystemDaily>
            </v-tab-item>
            <v-tab-item>
              <SaleNew :centerId="locationID" :fromDate="fromDate" :toDate="toDate"></SaleNew>
            </v-tab-item>
            <v-tab-item>
              <ReEnroll :centerId="locationID" :fromDate="fromDate" :toDate="toDate"></ReEnroll>
            </v-tab-item>
            <v-tab-item>
              <SaleResult :centerId="locationID" :fromDate="fromDate" :toDate="toDate"></SaleResult>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { account_managerment } from '@/api/account-management'
import SystemDaily from './SystemDaily.vue'
import SaleNew from './SaleNew.vue'
import ReEnroll from './ReEnroll.vue'
import SaleResult from './SaleResult.vue'

export default {
  components: { SystemDaily, SaleNew, ReEnroll, SaleResult },
  data() {
    return {
      isLoading: false,
      centers: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      locationID: parseInt(localStorage.getItem('currentCenter')),
      tab: 0,
      centerId: '',
      tempCenter: '',
      fromDate: '',
      toDate: '',
      isClick: false,
    }
  },
  created() {
    this.fromDate = dayjs()
      .add(-parseInt(dayjs().add(-1, 'day').format('DD')), 'day')
      .format('YYYY-MM-DD')
    this.toDate = dayjs().format('YYYY-MM-DD')
    this.init()
    if (this.centers && this.centers.length > 0) {
      this.center = this.centers[0].locationID
    }
  },
  computed: {
    getId() {
      return this.center
    },
  },
  methods: {
    async init() {},
    async getListCenter() {
      await account_managerment.getListCenter().then(res => {
        if (res) {
          this.centers = res
          if (this.centers && this.center.length > 0) this.center = this.centers[0].location
        }
      })
    },
    _dayjs: dayjs,
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.v-tab {
  text-transform: none;
}

.tab-container {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
