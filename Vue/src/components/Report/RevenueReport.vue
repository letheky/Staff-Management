<template lang="">
   
      <div class="revenue">
        <div>
          
    <div class="d-flex">
          
          <h2 class="pt-5">Revenue Report</h2>
        </div>
        <div class="d-flex justify-space-between pt-2">
          <div class="d-flex">
         <v-autocomplete 
          outlined
          label="Select"
         v-model="yearDropList"
         @change="changeYear"
         dense
        :items="years" >
    
         </v-autocomplete>
          </div>
        </div>
          <template>
            <v-data-table
              :items-per-page="5"
              class="elevation-1 spendingTable"
              hide-default-footer
              id="revenueTable"
            >
              <template v-slot:body>
                    <tbody>
                      <tr>
                        <th class="headerTable" >Center</th>
                        <th align="right" class="headerTable">Sum</th>
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
                        :key="index" :class="(index === daters.length-2|| index === daters.length-3) 
                        ? 'total' : (index === daters.length-1 ) ? 'average' : ''"
                        
                      >
                        <td @click=" (index === daters.length-2|| index === daters.length-3 || index === daters.length-1) ? function(){} :
                         staff(dater.ipsum,dater.years,dater.namess)" class="nameLocation">{{ dater.location }}</td>
                        <td align="right">{{typeof dater.sumAll === "number" ? Number(dater.sumAll.toFixed(0)).toLocaleString() : dater.sumAll }}</td>
                        <td align="right">{{typeof dater.sumJan === "number" ? Number(dater.sumJan.toFixed(0)).toLocaleString() : dater.sumJan }}</td>
                        <td align="right">{{typeof dater.sumFeb === "number" ? Number(dater.sumFeb.toFixed(0)).toLocaleString() : dater.sumFeb }}</td>
                        <td align="right">{{typeof dater.sumMar === "number" ? Number(dater.sumMar.toFixed(0)).toLocaleString() : dater.sumMar }}</td>
                        <td align="right">{{typeof dater.sumApr === "number" ? Number(dater.sumApr.toFixed(0)).toLocaleString() : dater.sumApr }}</td>
                        <td align="right">{{typeof dater.sumMay === "number" ? Number(dater.sumMay.toFixed(0)).toLocaleString() : dater.sumMay }}</td>
                        <td align="right">{{typeof dater.sumJun === "number" ? Number(dater.sumJun.toFixed(0)).toLocaleString() : dater.sumJun }}</td>
                        <td align="right">{{typeof dater.sumJul === "number" ? Number(dater.sumJul.toFixed(0)).toLocaleString() : dater.sumJul }}</td>
                        <td align="right">{{typeof dater.sumAug === "number" ? Number(dater.sumAug.toFixed(0)).toLocaleString() : dater.sumAug }}</td>
                        <td align="right">{{typeof dater.sumSep === "number" ? Number(dater.sumSep.toFixed(0)).toLocaleString() : dater.sumSep }}</td>
                        <td align="right">{{typeof dater.sumOct === "number" ? Number(dater.sumOct.toFixed(0)).toLocaleString() : dater.sumOct }}</td>
                        <td align="right">{{typeof dater.sumNow === "number" ? Number(dater.sumNow.toFixed(0)).toLocaleString() : dater.sumNow }}</td>
                        <td align="right">{{typeof dater.sumDec === "number" ? Number(dater.sumDec.toFixed(0)).toLocaleString() : dater.sumDec }}</td>
                      </tr>
                    </tbody>
          </template>
          </v-data-table>
        </template>
    </div>
  </div>  
</template>

<script>
import { report_revenue } from '../../api/report-revenuereport'

export default {
  data() {
   let yearList = []
    // let curYear = localStorage.getItem('revenueReportSearchYear') !== null
    //   ? localStorage.getItem('revenueReportSearchYear') : new Date().getFullYear()
    
    for (let index = new Date().getFullYear(); index > 2000; index--) {
    yearList.push(index)
      
    }
   
    return {
      select: [],
      years: yearList,
      yearDropList: "",

      daters: [],
      locastion: 0,
      locYear: new Date().getFullYear(),
    }
  },
watch :{yearDropList : function(v){this.yearDropList=v}} , 
  created() {
     const year = localStorage.getItem('revenueReportSearchYear') !== null
       ? localStorage.getItem('revenueReportSearchYear') : new Date().getFullYear() 
       localStorage.setItem('revenueReportSearchYear' ,year )
    this.yearDropList = JSON.parse(year)
    this.locYear = year
    this.init(year)
  },
  methods: {
    async init(year) {
    
      await report_revenue.getReportRevenue(this.locastion, year).then(res => {
        if (res) {
          
          let locations = []
          res.map(items => {
            if (!locations.includes(items.location)) {
              locations.push(items.location)
            }
          })
          let ipsum = 0
          let sumJan = 0
          let sumFeb = 0
          let sumMar = 0
          let sumApr = 0
          let sumMay = 0
          let sumJun = 0
          let sumJul = 0
          let sumAug = 0
          let sumSep = 0
          let sumOct = 0
          let sumNow = 0
          let sumDec = 0
          let years = 0
          let namess = ''
          let sumAll = 0

          this.daters = []
        
          let sumAllRev = {
            sumAll,
            namess,
            years,
            ipsum,
            location,
            sumJan,
            sumFeb,
            sumMar,
            sumApr,
            sumMay,
            sumJun,
            sumJul,
            sumAug,
            sumSep,
            sumOct,
            sumNow,
            sumDec,
          }
          let sumAllTarget = {
            sumAll,
            namess,
            years,
            ipsum,
            location,
            sumJan,
            sumFeb,
            sumMar,
            sumApr,
            sumMay,
            sumJun,
            sumJul,
            sumAug,
            sumSep,
            sumOct,
            sumNow,
            sumDec,
          }
          let averageAll = {
            sumAll,
            namess,
            years,
            ipsum,
            location,
            sumJan,
            sumFeb,
            sumMar,
            sumApr,
            sumMay,
            sumJun,
            sumJul,
            sumAug,
            sumSep,
            sumOct,
            sumNow,
            sumDec,
          }
          locations.map(location => {
            let dataLocation = res.filter(item => item.location === location)
            ipsum = 0
            sumJan = 0
            sumFeb = 0
            sumMar = 0
            sumApr = 0
            sumMay = 0
            sumJun = 0
            sumJul = 0
            sumAug = 0
            sumSep = 0
            sumOct = 0
            sumNow = 0
            sumDec = 0
            years = 0
            namess = ''
            sumAll = 0

            dataLocation.map(itemLocation => {
              namess = itemLocation.location
              // years = this.locYear
              ipsum = itemLocation.locationID

              // Rev
              sumJan += itemLocation.janTOTRev
              sumFeb += itemLocation.febTOTRev
              sumMar += itemLocation.marTOTRev
              sumApr += itemLocation.aprTOTRev
              sumMay += itemLocation.mayTOTRev
              sumJun += itemLocation.junTOTRev
              sumJul += itemLocation.julTOTRev
              sumAug += itemLocation.augTOTRev
              sumSep += itemLocation.sepTOTRev
              sumOct += itemLocation.octTOTRev
              sumNow += itemLocation.novTOTRev
              sumDec += itemLocation.decTOTRev
              sumAll =
                sumJan +
                sumFeb +
                sumMar +
                sumApr +
                sumMay +
                sumJun +
                sumJul +
                sumAug +
                sumSep +
                sumOct +
                sumNow +
                sumDec

              // Target
              sumAllTarget.sumJan +=
                typeof itemLocation.janTarget === 'number' ? itemLocation.janTarget : 0
              sumAllTarget.sumFeb +=
                typeof itemLocation.febTarget === 'number' ? itemLocation.febTarget : 0
              sumAllTarget.sumMar +=
                typeof itemLocation.marTarget === 'number' ? itemLocation.marTarget : 0
              sumAllTarget.sumApr +=
                typeof itemLocation.aprTarget === 'number' ? itemLocation.aprTarget : 0
              sumAllTarget.sumMay +=
                typeof itemLocation.mayTarget === 'number' ? itemLocation.mayTarget : 0
              sumAllTarget.sumJun +=
                typeof itemLocation.junTarget === 'number' ? itemLocation.junTarget : 0
              sumAllTarget.sumJul +=
                typeof itemLocation.julTarget === 'number' ? itemLocation.julTarget : 0
              sumAllTarget.sumAug +=
                typeof itemLocation.augTarget === 'number' ? itemLocation.augTarget : 0
              sumAllTarget.sumSep +=
                typeof itemLocation.sepTarget === 'number' ? itemLocation.sepTarget : 0
              sumAllTarget.sumOct +=
                typeof itemLocation.octTarget === 'number' ? itemLocation.octTarget : 0
              sumAllTarget.sumNow +=
                typeof itemLocation.novTarget === 'number' ? itemLocation.novTarget : 0
              sumAllTarget.sumDec +=
                typeof itemLocation.decTarget === 'number' ? itemLocation.decTarget : 0
            })

            let dataRender = {
              sumAll,
              namess,
              years,
              ipsum,
              location,
              sumJan,
              sumFeb,
              sumMar,
              sumApr,
              sumMay,
              sumJun,
              sumJul,
              sumAug,
              sumSep,
              sumOct,
              sumNow,
              sumDec,
            }
            this.daters.push(dataRender)

            // Calc sum all rev
            sumAllRev.sumAll += dataRender.sumAll
            sumAllRev.sumJan += dataRender.sumJan
            sumAllRev.sumFeb += dataRender.sumFeb
            sumAllRev.sumMar += dataRender.sumMar
            sumAllRev.sumApr += dataRender.sumApr
            sumAllRev.sumMay += dataRender.sumMay
            sumAllRev.sumJun += dataRender.sumJun
            sumAllRev.sumJul += dataRender.sumJul
            sumAllRev.sumAug += dataRender.sumAug
            sumAllRev.sumSep += dataRender.sumSep
            sumAllRev.sumOct += dataRender.sumOct
            sumAllRev.sumNow += dataRender.sumNow
            sumAllRev.sumDec += dataRender.sumDec

            // Taget
            sumAllTarget.sumAll =
              sumAllTarget.sumJan +
              sumAllTarget.sumFeb +
              sumAllTarget.sumMar +
              sumAllTarget.sumApr +
              sumAllTarget.sumMay +
              sumAllTarget.sumJun +
              sumAllTarget.sumJul +
              sumAllTarget.sumAug +
              sumAllTarget.sumSep +
              sumAllTarget.sumOct +
              sumAllTarget.sumNow +
              sumAllTarget.sumDec

            // Average
            averageAll.sumAll =
              sumAllTarget.sumAll > 0
                ? ((sumAllRev.sumAll / sumAllTarget.sumAll) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumJan =
              sumAllTarget.sumJan > 0
                ? ((sumAllRev.sumJan / sumAllTarget.sumJan) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumFeb =
              sumAllTarget.sumFeb > 0
                ? ((sumAllRev.sumFeb / sumAllTarget.sumFeb) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumMar =
              sumAllTarget.sumMar > 0
                ? ((sumAllRev.sumMar / sumAllTarget.sumMar) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumApr =
              sumAllTarget.sumApr > 0
                ? ((sumAllRev.sumApr / sumAllTarget.sumApr) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumMay =
              sumAllTarget.sumMay > 0
                ? ((sumAllRev.sumMay / sumAllTarget.sumMay) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumJun =
              sumAllTarget.sumJun > 0
                ? ((sumAllRev.sumJun / sumAllTarget.sumJun) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumJul =
              sumAllTarget.sumJul > 0
                ? ((sumAllRev.sumJul / sumAllTarget.sumJul) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumAug =
              sumAllTarget.sumAug > 0
                ? ((sumAllRev.sumAug / sumAllTarget.sumAug) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumSep =
              sumAllTarget.sumSep > 0
                ? ((sumAllRev.sumSep / sumAllTarget.sumSep) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumOct =
              sumAllTarget.sumOct > 0
                ? ((sumAllRev.sumOct / sumAllTarget.sumOct) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumNow =
              sumAllTarget.sumNow > 0
                ? ((sumAllRev.sumNow / sumAllTarget.sumNow) * 100).toFixed(0) + '%'
                : '-'
            averageAll.sumDec =
              sumAllTarget.sumDec > 0
                ? ((sumAllRev.sumDec / sumAllTarget.sumDec) * 100).toFixed(0) + '%'
                : '-'
          })
          sumAllRev.location = 'Actual Revenue'
          sumAllTarget.location = 'Target'
          averageAll.location = 'Average'
          this.daters.push(sumAllRev)
          this.daters.push(sumAllTarget)
          this.daters.push(averageAll)
        }
      })
    },
    // getColor(name) {
    //   if (name === "ActualRevenue" || name === "Target") return "dark";
    //   else if (name === "Average") return "black";
    //   else return "white";
    // },
    changeSelec(id) {
      let idSelec = this.items.find(item => item.nameCenter === id).id
      this.locastion = idSelec
      this.init()
    },
    changeYear(id) {
      // let valueYear = this.year.find(item => item === id)
      // this.locYear = valueYear
      this.yearDropList = id
      localStorage.setItem("revenueReportSearchYear" , id)
      this.init(id)
    },
    staff(id, year, name) {
      this.$router.push('/report/RevenueReport/staff/' + id + '/' + year + '/' + name)
      // console.log(id, year, name);
    },
    printYear: function () {
      return new Date().getFullYear()
    },
    back() {
      //   localStorage.setItem("isBackFromDetailDailyClasses", true);
      window.history.back()
    },
  },
  // mounted: function () {
  //         this.locYear = this.printYear();
  // },
}
</script>
<style>
.revenue {
 padding: 0 36px;
}

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

.black,
.black > td {
  color: #ffff !important;
  background-color: #737373;
}

.dark,
.dark > td {
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
  font-family: 'Helvetica Neue';
  font-weight: 100;
  text-align: center !important;
}

.routerStaff {
  color: #000 !important;
}

.nameLocation {
  color: rgb(84, 37, 255) !important;
}

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
.spendingTable tbody tr:nth-child(odd) {
  background-color: #bde6fbb0;
}
</style>
