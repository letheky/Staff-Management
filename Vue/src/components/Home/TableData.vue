<template>
  <div class="table-data">
    <v-row justify="space-between" align="center" class="top">
      <v-col cols="1" class="top-img pb-0">
        <img :src="dataHeader.icon" alt="" />
      </v-col>

      <v-col class="pb-0">
        <h2 style="{margin: 0   , padding:0}">{{ dataHeader.text }}</h2>
        <!-- <h3>{{ locationid }}</h3> -->
      </v-col>
    </v-row>
    <div class="d-flex mt-4 justify-space-between">
      <!-- <v-col class="select-location">
        <v-select :class="'select-location'" v-model="locationName" :items="listLocationSelect" dense label="Center"
          outlined>
        </v-select>
      </v-col> -->

      <div :class="'link'">
        <a v-for="(link, index) in dataHeader.listLink" :key="index" :href="link.link">
          <p>{{ link.text }}</p>
        </a>
      </div>
      <div :class="''">
        <h4>Total: {{ filtered.length }}</h4>
      </div>
    </div>
    <v-data-table
      v-if="!isLoading"
      :headers="headers"
      :items="filtered"
      :items-per-page="listRender.length"
      hide-default-header
      hide-default-footer
      :class="`elevation-0 table-data`"
      fixed-header
      height="60vh"
    >
      <template v-slot:header="{ props }">
        <thead style="border-radius: 20px" class="v-data-table-header">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              style="background: #0b2585; color: #fff"
            >
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tr class="fixed-row-filter">
          <th v-for="header in props.headers" class="select-table" :key="header.text">
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
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td
              v-for="(header, index) in headers"
              :key="index"
              :style="{ color: header.color, textAlign: header.align }"
            >
              <p @click="viewDetailClass(item.classID)" v-if="header.value === 'classCode'">
                {{ item[header.value] }}
              </p>
              <p
                @click="viewProfileByUserId(item.reg_UserID)"
                v-else-if="header.value === 'regUser'"
              >
                {{ item[header.value] }}
              </p>
              <p @click="viewProfileByUserId(item.eC_userID)" v-else-if="header.value === 'ec'">
                {{ item[header.value] }}
              </p>
              <p @click="viewProfileByUserId(item.qC_userID)" v-else-if="header.value === 'qc'">
                {{ item[header.value] }}
              </p>
              <p
                @click="viewProfileByUserId(item.student_userID)"
                v-else-if="header.value === 'name' || header.value === 'studentName'"
              >
                {{ item[header.value] }}
              </p>

              <p v-else>{{ item[header.value] }}</p>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: { Autocomplete },
  setup() {
    return {}
  },
  beforeMount() {},
  methods: {
    mouseUpSelect(header) {
      this.objectSearch[header] = ''
    },
    changeInputFilter(searchText, header) {
      this.objectSearch[header] = searchText
      // if (
      //   this.objectSearch[header] !== null ||
      //   this.objectSearch[header] !== '' ||
      //   searchText !== null
      // ) {
      //   this.filters[header] = this.listRender
      //     .filter(
      //       item =>
      //         item[header].toLowerCase().indexOf(this.objectSearch[header].toLowerCase()) !== -1
      //     )
      //     .map(d => d[header])
      //     .reduce(function (accumulator, element) {
      //       if (accumulator.indexOf(element) === -1) {
      //         accumulator.push(element)
      //       }
      //       return accumulator
      //     }, []).length
      // }
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    toggleWithSearch(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listRender
            .filter(
              item =>
                item[value].toLowerCase().indexOf(this.objectSearch[value].toLowerCase()) !== -1
            )
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
          this.objectSearch[value] = ''
        } else {
          this.filters[value] = this.listRender
            .filter(
              item =>
                item[value].toLowerCase().indexOf(this.objectSearch[value].toLowerCase()) !== -1
            )
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
    async init() {
      const dataGet =
        this.type === 'birthday'
          ? { locationID: this.locationid, nextDay: 7 }
          : {
              locationID: this.locationid,
              date: this.date,
            }
      const arrEvent = await this.$emit('getData', dataGet)

      await arrEvent._events.getData[0](dataGet).then(res => {
        let dataFormat = []
        if (this.keyGet !== null) {
          dataFormat = res[this.keyGet]
        } else {
          if (this.type === 'birthday') {
            const arrEvent = this.$emit('handleData', res)
            dataFormat = arrEvent._events.handleData[0](res)
          } else {
            dataFormat = res
          }
        }

        dataFormat =
          dataFormat === undefined
            ? []
            : dataFormat.map(item => {
                return item
              })

        this.listRender = dataFormat.reduce((arr, item) => {
          arr.push(
            Object.keys(item).reduce((obj, key) => {
              if (item[key]) {
                if (isNaN(item[key])) {
                  if (new Date(item[key].split('T')[0]).getTime()) {
                    if (key === 'classCode') obj[key] = item[key]
                    else obj[key] = this.formatDate2(new Date(item[key].split('T')))
                  } else {
                    if (item[key] === null && item[key] === 0 && item[key].trim() === '') {
                      obj[key] = '-'
                    } else {
                      obj[key] = item[key]
                    }
                  }
                } else {
                  if (item[key] === null || item[key] === 0 || item[key] === '') {
                    obj[key] = '-'
                  } else {
                    if (key.indexOf('ID') !== -1) {
                      obj[key] = item[key]
                    } else {
                      obj[key] = item[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                  }
                }
              } else {
                console.log(item[key])
                obj[key] = '-'
              }
              return obj
            }, {})
          )
          return arr
        }, [])
      })
    },
    groupColumnValueList(val) {
      if (this.objectSearch[val] !== null && this.objectSearch[val].trim().length !== 0) {
        return this.listRender
          .map(d => d[val])
          .filter(y => {
            return (
              this.removeAccents(y)
                .toLowerCase()
                .indexOf(this.removeAccents(this.objectSearch[val]).toLowerCase()) !== -1
            )
          })
      } else {
        return this.listRender.map(d => d[val])
      }
    },
    viewProfileByUserId(userId) {
      if (userId)
        this.$router.push({
          name: 'account-management-view-account',
          params: {
            userId: userId,
          },
        })
    },
    changeLocation(locationID) {
      this.center = String(locationID)
    },
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    formatDate2(date) {
      let stringToDate = new Date(date)
      const yyyy = stringToDate.getFullYear()
      let mm = stringToDate.getMonth() + 1 // Months start at 0!
      let dd = stringToDate.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm

      const formattedToday = dd + '/' + mm + '/' + yyyy
      return formattedToday
    },
    toggle(value) {
      this.objectSearch[value] = ''
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listRender
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
          this.filters[value] = this.listRender
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
    removeAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
    },
    formatDate(date) {
      let stringToDate = new Date(date)
      return stringToDate.toLocaleDateString('en-GB')

      // return (stringToDate.getDate() < 10 ? '0' + stringToDate.getDate() : stringToDate.getDate())
      //   + "/" + ((stringToDate.getMonth() + 1) < 10 ? '0' + (stringToDate.getMonth() + 1) : stringToDate.getMonth() + 1)
      //   + "/" + stringToDate.getFullYear();
    },
  },
  data() {
    return {
      // center: this.locationid,
      objectSearch: {},
      isLoading: false,
      page: 1,
      location: 1,

      listLocationSelect: [],
      date: new Date().toISOString().split('T')[0], //this.date2str(new Date(), "yyyy-mm-dd"),//new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
      listRender: [],
      locationName: 'CEC Văn quán 1',
    }
  },

  date2str(date, format) {
    var z = {
      M: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
    }
    format = format.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
      return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
    })

    return format.replace(/(format+)/g, function (v) {
      return date.getFullYear().toString().slice(-v.length)
    })
  },
  props: {
    locationid: {
      type: Number,
    },
    dataHeader: {
      type: Object,
    },
    searchTexts: {
      type: Object,
    },
    listLocation: {
      type: Array,
    },

    headers: {
      type: Array,
    },
    filters: {
      type: Object,
    },
    keyGet: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  watch: {
    locationid: function () {
      this.init()
    },
    objectSearch: function () {},
    locationName: function (newLocationName) {
      this.location = this.listLocation.find(item => {
        return item.location === newLocationName
      }).locationID
      this.init()
    },
    listLocation: function (newListLocation) {
      if (newListLocation.length !== 0) {
        this.location = newListLocation[0].locationID
        this.listLocationSelect = newListLocation.map(item => {
          return item.location
        })
      }
    },
  },
  created() {
    this.objectSearch = this.searchTexts
    this.init()
  },
  computed: {
    filtered() {
      const listReport = this.listRender.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listReport
    },
  },
}
</script>

<style lang="scss" scoped>
.link {
  padding-top: 0px !important;
}

// .table {
//   height: 60vh;

// }

// .v-data-table-header {
//   border-radius: 30px;

// }

// tbody tr:nth-child(odd) {
//   background: #BDE6FB;
// }

// thead th {
//   text-align: center !important;
//   padding: 0 !important;
//   height: 44px;

// }

// .top>div {
//   padding: 0;
//   padding-top: 10px;
//   padding-left: 10px;
// }

// .select-location {
//   padding: 0;
//   width: 150px;
//   padding-left: 5px;
// }

// .v-data-table-header tr:nth-of-type(1) th:last-child {
//   border-radius: 0 5px 0 0px;
// }

// .v-data-table-header tr:nth-of-type(2) th {
//   height: 20px !important;
// }

// .v-data-table-header tr:nth-of-type(1) th:first-child {
//   border-radius: 5px 0px 0 0px;
// }

// .link {
//   padding-top: 0;
//   display: flex;
//   flex-direction: column;
//   justify-content: end;
//   align-items: end;
// }

// .link a {
//   display: block;
//   width: fit-content;

//   float: right;
// }
</style>
