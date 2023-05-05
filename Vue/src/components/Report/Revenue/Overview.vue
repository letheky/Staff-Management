<template lang="">
    <div>
      <div class="revenue">
        <v-col md="12">
          <div class="d-flex">
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">Revenue Report </h2>
          </div>
          <div class="d-flex justify-space-between pt-2">
            <div class="d-flex">
             <v-select
        
                :items="year"
                 v-model="yearDropList"
                outlined
                dense
                label="Year"
                hide-default-footer
                 @change="changeYear"
              ></v-select>
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
            </div>
          </div>
          <template>
            <v-data-table
              :headers="headers"
              :items-per-page="5"
                hide-default-footer
              id="revenueTable"
              class="elevation-1 spendingTable"
            >
              <template v-slot:body>
                <tbody>
                  <tr>
                    <th class="headerTable" :style="{ color: '#fff' }">Center</th>
                    <th class="headerTable">Sum</th>
                    <th class="headerTable">Jan</th>
                    <th class="headerTable">Feb</th>
                    <th class="headerTable">Mar</th>
                    <th class="headerTable">Apr</th>
                    <th class="headerTable">May</th>
                    <th class="headerTable">Jun</th>
                    <th class="headerTable">Jul</th>
                    <th class="headerTable">Aug</th>
                    <th class="headerTable">Sep</th>
                    <th class="headerTable">Oct</th>
                    <th class="headerTable">Nov</th>
                    <th class="headerTable">Dec</th>
                  </tr>
                  <tr
                    v-for="(dater, index) in daters"
                    :key="index"
                  >
                    <td>{{ dater.programme }}</td>
                    <td align="right">{{ Number( dater.totRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.janTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.febTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.marTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.aprTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.mayTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.junTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.julTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.augTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.sepTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.octTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.novTOTRev.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( dater.decTOTRev.toFixed(0)).toLocaleString() }}</td>
                  </tr>
                 
                  <tr class="total">
                    <td>Actual Revenue</td>
                    <td align="right">{{ Number( total.sum.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.jan.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.feb.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.mar.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.apr.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.may.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.jun.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.jul.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.aug.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.sep.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.oct.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.nov.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number( total.dec.toFixed(0)).toLocaleString() }}</td>
                  </tr>
                   <tr class="total">
                    <td>Target</td>
                    <td align="right">{{ Number(ttlTarget.sum.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.jan.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.feb.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.mar.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.apr.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.may.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.jun.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.jul.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.aug.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.sep.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.oct.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.nov.toFixed(0)).toLocaleString() }}</td>
                    <td align="right">{{ Number(ttlTarget.dec.toFixed(0)).toLocaleString() }}</td>
                  <tr class="average">
                    <td>Average</td>
                    <td align="right">{{ average.sum }}</td>
                    <td align="right">{{ average.jan }}</td>
                    <td align="right">{{ average.feb }}</td>
                    <td align="right">{{ average.mar }}</td>
                    <td align="right">{{ average.apr }}</td>
                    <td align="right">{{ average.may }}</td>
                    <td align="right">{{ average.jun }}</td>
                    <td align="right">{{ average.jul }}</td>
                    <td align="right">{{ average.aug }}</td>
                    <td align="right">{{ average.sep }}</td>
                    <td align="right">{{ average.oct }}</td>
                    <td align="right">{{ average.nov }}</td>
                    <td align="right">{{ average.dec }}</td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </template>
        </v-col>
      </div>
      <!-- <template>
        <ul v-if="desserts && desserts.length">
          <li v-for="(post, index) of desserts" :key="index">
            <p>
              <strong>{{ post.title }}</strong>
            </p>
            <p>{{ post.body }}</p>
          </li>
        </ul>
      </template> -->
    </div>
  </template>
  <script>
  import { report_revenue } from "@/api/report-revenuereport";
  
  export default {
    data() {
      let yearList = [];
      let curYear = new Date().getFullYear();
      if (curYear > 2000) {
        for (let i = curYear; i >= 2000; i--) {
          yearList.push(i);
        }
      } else
        yearList.push(curYear);
  
      let defaultYear =  localStorage.getItem("revenueReportSearchYear" ) ?  localStorage.getItem("revenueReportSearchYear" ) : new Date().getFullYear();
      return {
        locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
        yearDropList: Number(defaultYear),
        id: this.$route.params.id,
        select: [],
        locationID : parseInt(localStorage.getItem('currentCenter')),
        year: yearList,
        daters: [],
        total: {
          sum: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          oct: 0,
          nov: 0,
          dec: 0
        },
        ttlTarget: {
          sum: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          oct: 0,
          nov: 0,
          dec: 0
        },
        average: {
          sum: 0,
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 0,
          oct: 0,
          nov: 0,
          dec: 0
        },
        locYear: this.$route.params.year,
        name: this.$route.params.name,
      };
    },
  
    created() {
      this.changeYear()
      this.init();
      
    },
    watch : {
        locationID : function(){
            this.init()
        }
    } , 
    methods: {
      async init() {
        await report_revenue.getReportRevenue(this.locationID, this.yearDropList).then((res) => {
          if (res) {
            let total = {
              sum: 0,
              jan: 0,
              feb: 0,
              mar: 0,
              apr: 0,
              may: 0,
              jun: 0,
              jul: 0,
              aug: 0,
              sep: 0,
              oct: 0,
              nov: 0,
              dec: 0
            };
            let ttlTarget = {
              sum: 0,
              jan: 0,
              feb: 0,
              mar: 0,
              apr: 0,
              may: 0,
              jun: 0,
              jul: 0,
              aug: 0,
              sep: 0,
              oct: 0,
              nov: 0,
              dec: 0
            };
  
            res.forEach(element => {
                total.sum += element.totRev,
                total.jan += element.janTOTRev,
                total.feb += element.febTOTRev,
                total.mar += element.marTOTRev,
                total.apr += element.aprTOTRev,
                total.may += element.mayTOTRev,
                total.jun += element.junTOTRev,
                total.jul += element.julTOTRev,
                total.aug += element.augTOTRev,
                total.sep += element.sepTOTRev,
                total.oct += element.octTOTRev,
                total.nov += element.novTOTRev,
                total.dec += element.decTOTRev
            });
  
            res.forEach(element => {
                ttlTarget.sum += typeof element.toTtarget === "number" ? element.toTtarget : 0,
                ttlTarget.jan += typeof element.janTarget === "number" ? element.janTarget : 0,
                ttlTarget.feb += typeof element.febTarget === "number" ? element.febTarget : 0,
                ttlTarget.mar += typeof element.marTarget === "number" ? element.marTarget : 0,
                ttlTarget.apr += typeof element.aprTarget === "number" ? element.aprTarget : 0,
                ttlTarget.may += typeof element.mayTarget === "number" ? element.mayTarget : 0,
                ttlTarget.jun += typeof element.junTarget === "number" ? element.junTarget : 0,
                ttlTarget.jul += typeof element.julTarget === "number" ? element.julTarget : 0,
                ttlTarget.aug += typeof element.augTarget === "number" ? element.augTarget : 0,
                ttlTarget.sep += typeof element.sepTarget === "number" ? element.sepTarget : 0,
                ttlTarget.oct += typeof element.octTarget === "number" ? element.octTarget : 0,
                ttlTarget.nov += typeof element.novTarget === "number" ? element.novTarget : 0,
                ttlTarget.dec += typeof element.decTarget === "number" ? element.decTarget : 0
  
            });
            let average = {
              sum: isNaN(total.sum / ttlTarget.sum) === true || total.sum / ttlTarget.sum === Infinity ? "-" : ((total.sum / ttlTarget.sum)*100).toFixed(0) + '%',
              jan: isNaN(total.jan / ttlTarget.jan) === true || total.jan / ttlTarget.jan === Infinity ? "-" : ((total.jan / ttlTarget.jan)*100).toFixed(0) + '%',
              feb: isNaN(total.feb / ttlTarget.feb) === true || total.feb / ttlTarget.feb === Infinity ? "-" : ((total.feb / ttlTarget.feb)*100).toFixed(0) + '%',
              mar: isNaN(total.mar / ttlTarget.mar) === true || total.mar / ttlTarget.mar === Infinity ? "-" : ((total.mar / ttlTarget.mar)*100).toFixed(0) + '%',
              apr: isNaN(total.apr / ttlTarget.apr) === true || total.apr / ttlTarget.apr === Infinity ? "-" : ((total.apr / ttlTarget.apr)*100).toFixed(0) + '%',
              may: isNaN(total.may / ttlTarget.may) === true || total.may / ttlTarget.may === Infinity ? "-" : ((total.may / ttlTarget.may)*100).toFixed(0) + '%',
              jun: isNaN(total.jun / ttlTarget.jun) === true || total.jun / ttlTarget.jun === Infinity ? "-" : ((total.jun / ttlTarget.jun)*100).toFixed(0) + '%',
              jul: isNaN(total.jul / ttlTarget.jul) === true || total.jul / ttlTarget.jul === Infinity ? "-" : ((total.jul / ttlTarget.jul)*100).toFixed(0) + '%',
              aug: isNaN(total.aug / ttlTarget.aug) === true || total.aug / ttlTarget.aug === Infinity ? "-" : ((total.aug / ttlTarget.aug)*100).toFixed(0) + '%',
              sep: isNaN(total.sep / ttlTarget.sep) === true || total.sep / ttlTarget.sep === Infinity ? "-" : ((total.sep / ttlTarget.sep)*100).toFixed(0) + '%',
              oct: isNaN(total.oct / ttlTarget.oct) === true || total.oct / ttlTarget.oct === Infinity ? "-" : ((total.oct / ttlTarget.oct)*100).toFixed(0) + '%',
              nov: isNaN(total.nov / ttlTarget.nov) === true || total.nov / ttlTarget.nov === Infinity ? "-" : ((total.nov / ttlTarget.nov)*100).toFixed(0) + '%',
              dec: isNaN(total.dec / ttlTarget.dec) === true || total.dec / ttlTarget.dec === Infinity ? "-" : ((total.dec / ttlTarget.dec)*100).toFixed(0) + '%',
  
            };
            this.total = total;
            this.daters = res;
            this.ttlTarget = ttlTarget;
            this.average = average;
          }
        });
      },
      getColor(name) {
        if (name === "ActualRevenue" || name === "Target") return "dark";
        else if (name === "Average") return "black";
        else return "white";
      },
      changeYear(id) {
        let valueYear = this.year.find((item) => item === id);
        this.locYear = valueYear;
        this.init();
      },
      back() {
        //   localStorage.setItem("isBackFromDetailDailyClasses", true);
        window.history.back();
      },
    },
  };
  </script>
  <style >
  .average {
  
    background: #737373 !important;
  }
  
  .average td {
    color: #fff !important;
    background: #737373 !important;
  }
  
  
  .total {
    background: rgba(115, 115, 115) !important;
  }
  
  .total td {
    color: #fff !important;
    border: 1px solid rgb(161, 161, 161) !important;
    background: rgb(161, 161, 161) !important;
  
  
  }
  
  .target td {
    color: #fff !important;
  }
  
  .black,
  .black>td {
    color: #ffff !important;
    background-color: #737373;
  }
  
  .dark,
  .dark>td {
    background-color: #ababab;
    color: #ffff !important;
  }
  
  .v-chip.v-size--default {
    border-radius: 0px;
    font-size: 14px;
    height: 100%;
    width: 100%;
  }
  
  .headerTable {
    background-color: #0b2585;
    color: #fff !important;
    font-family: "Helvetica Neue";
  }
  
  #revenueTable th:nth-child(1),
  #revenueTable td:nth-child(1) {
    position: sticky;
    left: 0;
  }
  
  #revenueTable td:nth-child(1) {
    background: white;
  }
  
  #revenueTable th:nth-child(1) {
    z-index: 3;
  }
  
  fieldset {
    display: none;
  }
  .spendingTable tbody tr:nth-child(odd) {
    background-color: #bde6fbb0;
  }
  </style>
  