<template>
  <div class="revenue">
    <div class="student-averge">
      <template>
        <div class="text-center">
          <v-overlay :value="overlay">
            <v-card light class="mx-auto" max-width="344">
              <v-card-title :class="'target-txt'">
                <h4>Set target</h4>
              </v-card-title>
              <div class="set-target">
                <v-card-text>
                  <v-text-field
                    v-model="inputTarget"
                    type="number"
                    large
                    outlined
                    dense
                    hide-details
                    label="Enter Target Number"
                  >
                  </v-text-field>
                  <div class="target-btn">
                    <v-row>
                      <v-col cols="6">
                        <v-btn
                          dense
                          elevation="1"
                          outlined
                          @click="overlay = !overlay"
                          :disabled="false"
                          >Cancel</v-btn
                        >
                      </v-col>
                      <v-col cols="6">
                        <v-btn
                          color="primary"
                          dense
                          elevation="1"
                          v-on:click="setTarget"
                          :disabled="false"
                          >OK</v-btn
                        >
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </div>
            </v-card>
          </v-overlay>
        </div>
      </template>

      <v-row :justify="'space-between'">
        <v-col>
          <div>
            <v-row :justify="'start'" no-gutters :align="'center'">
              <v-col cols="11">
                <h2 :class="'heading'">Student Average Report</h2>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="locationID"
            item-text="location"
            append-icon="keyboard_arrow_down"
            item-value="locationID"
            :items="selectLocation"
            label="Center"
            outlined
            :class="'select-location'"
            dense
          ></v-autocomplete>
        </v-col>
        <v-col :class="'btn-set'">
          <v-btn
            color="primary"
            dense
            elevation="1"
            class="pl-5 pr-5"
            :disabled="false"
            @click="overlay = !overlay"
            >Set target</v-btn
          >
        </v-col>
      </v-row>
      <div>
        <v-tabs v-model="tabSelected" @change="changeTab">
          <v-row :class="'shadow-bar'">
            <v-tab :href="`#tab-1`" :class="'text-normal'"> Overview </v-tab>
            <v-tab :href="`#tab-2`" :class="'text-normal'"> View students by QC </v-tab>
            <v-tab :href="`#tab-3`" :class="'text-normal'"> View students by Class </v-tab>
          </v-row>
          <v-tab-item :value="`tab-1`">
            <StudentReportOverView
              :listLocation="listLocation"
              @setListProgramme="setListProgramme"
              :data="dataReport"
              @setExportData="setExportDataOverView"
              :target="target"
              :locationId="locationID"
            />
          </v-tab-item>
          <v-tab-item :value="`tab-2`">
            <StudentReportByQc
              :target="target"
              @setExportData="setExportDataByQc"
              :listLocation="listLocation"
              :locationId="locationID"
            />
          </v-tab-item>
          <v-tab-item :value="`tab-3`">
            <StudentReportByClass
              @setExportData="setExportDataByName"
              :listLocation="listLocation"
              :locationId="locationID"
              :target="target"
            />
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { student_information } from '@/api/student-information.js'
import StudentReportOverView from './StudentReportOverView.vue'
import StudentReportByQc from './StudentReportByQc.vue'
import StudentReportByClass from './StudentReportByClass.vue'

export default {
  components: {
    StudentReportOverView,
    StudentReportByQc,
    StudentReportByClass,
  },
  data() {
    return {
      dataReport: [],
      overlay: false,
      dataReportString: '',
      locationID: 0,
      tabSelected: '',
      tabSelect: 0,
      listLocation: [],
      selectLocation: [],
      dataExportByQc: [],
      dataExportOverView: [],
      dataExportByname: [],
      target: 10,
      inputTarget: 10,

      progammeName: { standardProgram: [], noneStandardProgram: [] },
    }
  },
  updated() {},
  methods: {
    async init() {
      student_information
        .getStudentOverView()
        .then(res => res.json())
        .then(data => {
          this.dataReport = data
          this.listLocation = data.map(item => {
            return { name: item.locations.name, id: item.locations.id }
          })

          this.selectLocation = data.map(item => {
            return { location: item.locations.name, locationID: item.locations.id }
          })
        })
      const getTarget = localStorage.getItem('target')

      if (getTarget === null) {
        localStorage.setItem('target', '10')
      } else {
        this.target = parseFloat(getTarget)
        this.inputTarget = parseFloat(getTarget)
      }
    },
    setListProgramme: function (data) {
      this.progammeName = data
    },
    setExportDataOverView: function (data) {
      this.dataExportOverView = data
    },
    setExportDataByQc: function (data) {
      this.dataExportByQc = data
    },
    setExportDataByName: function (data) {
      this.dataExportByname = data
    },
    changeTab: function (data) {
      this.tabSelect = data
    },
    setTarget: function () {
      this.target = parseFloat(this.inputTarget)
      localStorage.setItem('target', this.inputTarget.toString())

      this.overlay = !this.overlay
    },
  },

  created() {
    this.locationID = parseInt(localStorage.getItem('currentCenter'))
    if (localStorage.getItem('studentAverageLocation')) {
      this.locationID = parseInt(localStorage.getItem('studentAverageLocation'))
    }
    if (this.listLocation.length !== 0) {
      this.tabSelected = this.$route.query.isbackfromDetail === true ? 'tab-3' : 'tab-1'
    }
    this.init()
  },
  watch: {
    tabSelect: function () {},
    locationID: function (location) {
      localStorage.setItem('studentAverageLocation', location)
      this.init()
    },
  },

  beforeCreate() {},
}
</script>
<style lang="scss" scoped>
.revenue {
  margin: 20px !important;
}
.select-location {
  max-width: 250px;
}

.btn-set button {
  float: right;
}

.target-txt {
  border-bottom: 1px solid rgb(243, 241, 241);
  padding-bottom: 10px;
}

.target-txt h4 {
  width: 100%;
  text-align: center;
}

.target-btn button {
  margin-top: 16px;
  width: 100%;
}

.student-averge {
  margin: 0 8px;
  margin-top: 16px;
}

.icon-header {
  display: contents;
}

.icon-header i {
  margin-left: -10px;
}

.text-normal {
  text-transform: initial;
}

.btn-download {
  width: fit-content;
  margin-left: auto;
}

.shadow-bar {
  position: relative;
}

// .v-tabs-slider{
//   margin-left: -150px;
// }
.shadow-bar {
  margin-left: 2px;
}

.text-normal {
  text-align: center;
}

.shadow-bar::before {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  background: rgb(255, 255, 255);
  height: 4.5px;
  z-index: 10000;
  // border: 1px solid #000;
  box-shadow: 10px 10px 10px 10px rgb(27, 27, 27);
}
</style>
