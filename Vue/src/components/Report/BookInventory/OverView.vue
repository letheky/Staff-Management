<template>
  <div class="book-inventory mt-5">
    <h1 :class="'heading'">Book Inventory</h1>
    <v-row :class="'list-select ml-1'">
      <v-select
        :class="'select-item'"
        v-model="locationID"
        item-text="location"
        append-icon="keyboard_arrow_down"
        item-value="locationID"
        :items="listLocation"
        dense
        label="Center"
        outlined
      >
      </v-select>

      <v-select
        :class="'select-item'"
        v-model="month"
        :items="listMonth"
        dense
        label="Month"
        outlined
      >
      </v-select>
      <v-select :class="'select-item'" v-model="year" :items="listYear" dense label="Year" outlined>
      </v-select>
    </v-row>
    <div>
      <v-tabs>
        <v-row>
          <v-tab>
            <p class="text-normal">Input-Output-Inventory Report</p>
          </v-tab>
          <v-tab>
            <p class="text-normal">Inventory Order Report</p>
          </v-tab>
        </v-row>
        <v-tab-item>
          <InputOutPut
            :location="locationID"
            :listLocation="listLocationAndID"
            :month="month"
            :year="year"
          />
        </v-tab-item>
        <v-tab-item>
          <InventoryOrderReport
            :location="locationID"
            :listLocation="listLocationAndID"
            :month="month"
            :year="year"
          />
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import InputOutPut from './InputOutPut.vue'
import InventoryOrderReport from './InventoryOrderReport.vue'
export default {
  setup() {
    return {}
  },
  data() {
    return {
      month: 0,
      year: 0,
      locationID: 0,
      listLocation: [],
      listLocationAndID: [],
      listYear: [],
      listMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    }
  },
  methods: {
    async init() {
      this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
      this.locationID = parseInt(localStorage.getItem('currentCenter'))
      let listLocationAndId = []
      this.listLocation.forEach(element => {
        listLocationAndId.push({ id: element.locationID, name: element })
      })
      this.listLocationAndID = listLocationAndId
    },
  },
  created() {
    this.year = new Date().getFullYear()
    this.month = new Date().getMonth() + 1
    for (let i = this.year; i > 2000; i--) {
      this.listYear.push(i)
    }
    this.init()
  },

  components: { InputOutPut, InventoryOrderReport },
}
</script>

<style lang="scss" scoped>
.list-select {
  margin-top: 25px;
}

.book-inventory h1 {
  font-size: 21px;
}

.select-item {
  margin-right: 10px;
  max-width: 200px;
}

.book-inventory {
  margin: 0 35px;
}

.text-normal {
  text-transform: capitalize;
}
</style>
