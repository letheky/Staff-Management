<template>
  <div id="book-inventory-i-o">
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <v-row> </v-row>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            :headers="headers"
            :items="filtered.data"
            :page.sync="page"
            :items-per-page="1000000000"
            hide-default-header
            hide-default-footer
            class="elevation-0 event-table"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th v-for="(prop, index) in props.headers" :key="index">{{ prop.text }}</th>
                </tr>

                <tr class="fixed-row-filter">
                  <td
                    v-for="header in props.headers"
                    class="select-book abc filter-event"
                    :key="header.text"
                  >
                    <div v-if="filters.hasOwnProperty(header.value)">
                      <v-text-field
                        class="text-field"
                        placeholder="Search..."
                        v-if="header.value === 'subject'"
                        :class="'task-management-select'"
                        v-model="taskName"
                        :items="selectLocation"
                        dense
                        outlined
                      >
                      </v-text-field>
                      <v-text-field
                        class="text-field"
                        id="input-appointmentID-fix"
                        placeholder="Search..."
                        v-else-if="header.value === 'appointmentID'"
                        :class="'task-management-select'"
                        v-model="taskID"
                        :items="selectLocation"
                        dense
                        outlined
                      >
                      </v-text-field>
                      <v-text-field
                        class="text-field"
                        placeholder="Search..."
                        v-else-if="header.value === 'description'"
                        :class="'task-management-select'"
                        v-model="descriptions"
                        :items="selectLocation"
                        dense
                        outlined
                      >
                      </v-text-field>
                      <Autocomplete
                        v-if="
                          filters.hasOwnProperty(header.value) &&
                          header.value !== 'description' &&
                          header.value !== 'appointmentID' &&
                          header.value !== 'subject'
                        "
                        @setFilter="setFilter"
                        :keyFilter="header.value"
                        :selectedInit="filters[header.value]"
                        :listItem="
                          header.value === 'listAssigned'
                            ? groupColumnAssignList()
                            : groupColumnValueList(header.value)
                        "
                      />
                    </div>
                  </td>
                </tr>
              </thead>
            </template>
            <template v-slot:body="{}">
              <tbody v-for="(item, index1) in filtered.listDay" :key="index1">
                <tr
                  @click="e => showEvent(e, event)"
                  v-for="(event, index2) in item.data"
                  :key="index2"
                >
                  <td>{{ index2 === 0 ? formatDate(event.startDate) : '' }}</td>
                  <td :style="{ width: '50px' }">
                    <p>{{ index2 === 0 ? event.weekday : '' }}</p>
                  </td>
                  <td>{{ event.timeInDay }}</td>
                  <td>
                    <span :style="{ background: getEventColor(event) }" :class="`cycle `"></span
                    >{{ event.categoryName }}
                  </td>
                  <td>
                    {{ event.subject }}
                  </td>
                  <td>
                    {{ event.appointmentID }}
                  </td>
                  <td class="limit-text">{{ event.description }}</td>
                  <td :style="{ width: '200px' }" class="limit-text">
                    <p
                      v-for="(assigned, index) in event.listAssigned"
                      :key="assigned.teacherID"
                      class="ml-1"
                    >
                      {{
                        index === event.listAssigned.length - 1
                          ? assigned.teacherName
                          : assigned.teacherName + ','
                      }}
                    </p>
                  </td>
                  <td>{{ event.crtdUser }}</td>
                  <td>{{ _dayjs(event.crtdDate).format('DD/MM/YYYY') }}</td>
                  <td>{{ event.taskPriority }}</td>
                  <td>{{ event.isCompleted }}</td>
                  <td>{{ event.visibility }}</td>
                </tr>

                <!-- <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.fromTime }}</td>
                </tr> -->
              </tbody>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <!-- <div v-if="!isLoading" color="#fff" class="w-100 fix pl-10 pr-10 footer">
      <v-row>
        <v-col md="2">
          <v-select outlined hide-details dense :value="itemsPerPage" :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)" style="height: 32px"></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end"> </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination v-model="page" :length="pageCount" elevation="0" :total-visible="7"></v-pagination>
        </v-col>
      </v-row>
    </div> -->
  </div>
</template>

<script>
// import { book_management } from "@/api/book_management.js";
// import Multiselect from "vue-multiselect";
import dayjs from 'dayjs'
import { task_management } from '@/api/task-management'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: {
    // Multiselect,
    Autocomplete,
  },
  data() {
    return {
      isLoading: false,
      page: 1,
      taskName: '',
      taskID: '',
      descriptions: '',
      listCategories: [],
      listAssigned: '',

      headers: [
        {
          text: 'Date',
          value: 'dateSort',
          sortable: false,
        },
        {
          text: 'Weekday',
          value: 'weekday',
          sortable: false,
        },
        {
          text: 'Time',
          value: 'timeInDay',
          width: '15%',
          sortable: false,
          align: 'right',
        },
        {
          text: 'Category',
          value: 'categoryName',
          sortable: false,
        },
        {
          text: 'Task name',
          value: 'subject',
          sortable: false,
        },
        {
          text: 'TaskID',
          value: 'appointmentID',
          sortable: false,
        },
        {
          text: 'Descriptions',
          value: 'description',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Assignee',
          value: 'listAssigned',

          sortable: false,
        },
        {
          text: 'Created user',
          value: 'crtdUser',

          sortable: false,
        },
        {
          text: 'Created date',
          value: 'crtdDate',

          sortable: false,
        },
        {
          text: 'Priority',
          value: 'taskPriority',

          sortable: false,
        },
        {
          text: 'Status',
          value: 'isDone',

          sortable: false,
        },
        {
          text: 'View type',
          value: 'visibility',

          sortable: false,
        },

        //{ text: "Action", value: "action", width: "7%", sortable: false },
      ],
      listEvents: [],
      listEventOr: [],
      filters: {
        description: '',
        subject: '',
        appointmentID: '',
        dateSort: [],
        weekday: [],
        crtdUser: [],
        crtdDate: [],
        timeInDay: [],
        categoryName: [],
        descriptions: [],
        listAssigned: [],
        taskPriority: [],
        isDone: [],
        visibility: [],
      },
    }
  },

  props: ['events', 'selectedEvent'],
  computed: {
    filtered() {
      const listEvent = this.listEvents.filter(d => {
        return Object.keys(this.filters).every(f => {
          function checkInAssign(filters, listAssigned, fil) {
            let isInAssign = false
            listAssigned.forEach(element => {
              if (filters[fil].includes(element.teacherName)) {
                isInAssign = true
              }
            })
            return isInAssign
          }
          if (f === 'listAssigned') {
            return this.filters[f].length < 1 || checkInAssign(this.filters, d.listAssigned, f)
          } else {
            return this.filters[f].length < 1 || this.filters[f].includes(d[f])
          }
        })
      })
      // listEvent.forEach(element => {
      //   const startDate = new Date(element.startDate.split('T')[0])
      //   const endDate = new Date(element.endDate.split('T')[0])
      //   console.log(endDate, startDate)
      //   let dateToIncrease = startDate
      //   do {
      //     if (dateToIncrease.getTime() === endDate.getTime()) {
      //       newListEvent.push(element)
      //     } else {
      //       if (dateToIncrease.getTime() === startDate.getTime()) {
      //         newListEvent.push({
      //           ...element,
      //           endDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '23:59:59',
      //         })
      //       } else if (dateToIncrease.getTime() < endDate.getTime()) {
      //         newListEvent.push({
      //           ...element,
      //           startDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '00:00:00',
      //         })
      //       } else {
      //         newListEvent.push({
      //           ...element,
      //           startDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '00:00:00',
      //           endDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '23:59:59',
      //         })
      //       }
      //       console.log(dateToIncrease.getTime() < endDate.getTime()+1)
      //       dateToIncrease = new Date(new Date(dateToIncrease.getTime() + 86400000).toISOString().split("T")[0])
      //     }
      //   } while (dateToIncrease.getTime() < endDate.getTime() )
      // })
      let newListEvent = listEvent.sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      })
      return {
        data: newListEvent,
        listDay: this.groupByDate(newListEvent),
      }
    },
  },
  created() {
    this.init(this.events)
  },

  watch: {
    selectedEvent: () => {},

    events: function (newEvents) {
      this.init(newEvents)
      // let newData = newEvents.map(item => {
      //   let listAssignedString = item.listAssigned
      //     .map(element => {
      //       return element.name
      //     })
      //     .join('+')
      //   const description =
      //     item.description.length > 15 ? item.description.slice(0, 10) : item.descriptions
      //   return {
      //     ...item,
      //     listAssignedString:
      //       listAssignedString.length > 10 ? listAssignedString.slice(0, 10) : listAssignedString,
      //     description: description,
      //     dateSort: new Date(item.startDate).toLocaleDateString('en-GB'),
      //     descriptionsFull: item.description,
      //     timeInDay:
      //       this.getTimeFromDate(item.startDate) + '-' + this.getTimeFromDate(item.endDate),
      //     weekday: new Date(item.startDate).toLocaleString('en-us', { weekday: 'short' }),
      //   }
      // })

      // this.listEvents = newData
      // this.listEventOr = newData
    },
    taskName: function (searchTaskName) {
      if (searchTaskName === '') {
        this.listEvents = this.listEventOr
      } else {
        this.listEvents = this.listEventOr.filter(item => {
          return item.subject.indexOf(searchTaskName) !== -1
        })
      }
    },
    taskID: function (searchTaskID) {
      if (searchTaskID === '') {
        this.listEvents = this.listEventOr
      } else {
        this.listEvents = this.listEventOr.filter(item => {
          return item.appointmentID.toString().indexOf(searchTaskID) !== -1
        })
      }
    },
    descriptions: function (searchDescriptions) {
      if (searchDescriptions === '') {
        this.listEvents = this.listEventOr
      } else {
        this.listEvents = this.listEventOr.filter(item => {
          return item.descriptionsFull.indexOf(searchDescriptions) !== -1
        })
      }
    },
    listAssigned: function (searchlistAssigned) {
      if (searchlistAssigned === '') {
        this.listEvents = this.listEventOr
      } else {
        this.listEvents = this.listEventOr.filter(item => {
          const listAssignedString = item.listAssigneded
            .map(element => {
              return element.teacherID
            })
            .join(' ')
          return listAssignedString.indexOf(searchlistAssigned) !== -1
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
    dataByOne(data) {
      let newListEvent = []
      data.forEach(element => {
        const startDate = new Date(element.startDate.split('T')[0])
        const endDate = new Date(element.endDate.split('T')[0])
        let dateToIncrease = startDate
        do {
          if (new Date(dateToIncrease).getTime() === new Date(endDate).getTime()) {
            newListEvent.push(element)
          } else {
            if (dateToIncrease.getTime() === startDate.getTime()) {
              newListEvent.push({
                ...element,
                endDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '23:59:59',
              })
            } else if (dateToIncrease.getTime() === endDate.getTime()) {
              newListEvent.push({
                ...element,
                startDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '00:00:00',
              })
            } else {
              newListEvent.push({
                ...element,
                startDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '00:00:00',
                endDate: dateToIncrease.toISOString().split('T')[0] + 'T' + '23:59:59',
              })
            }
            dateToIncrease = new Date(
              new Date(dateToIncrease.getTime() + 86400000).toISOString().split('T')[0]
            )
          }
        } while (dateToIncrease.getTime() < endDate.getTime())
      })
      return newListEvent
    },
    groupColumnAssignList() {
      let listAssignedSelect = []
      this.listEvents.forEach(e => {
        listAssignedSelect.push(...e.listAssigned.map(element => element.teacherName))
      })
      return listAssignedSelect
    },
    getTimeFromDate(date) {
      let hours = date.split('T')[1].split(':')[0]

      let minutes = date.split('T')[1].split(':')[1]

      return hours + ':' + minutes + ' '
    },
    formatDate(date) {
      const stringToDate = new Date(date.split('T')[0])

      return (
        this.ckeckNumber(stringToDate.getDate()) +
        '/' +
        this.ckeckNumber(stringToDate.getMonth() + 1) +
        '/' +
        stringToDate.getFullYear()
      )
    },
    async init(newDatas) {
      // this.isLoading = true;
      const listEvents = this.dataByOne(newDatas)
      await task_management.getappointmentCatelories_List().then(res => {
        if (res) {
          this.listCategories = res
        }
      })
      let newData = listEvents.map(item => {
        let listAssignedString = item.listAssigned
          .map(element => {
            return element.name
          })
          .join('+')
        const description =
          item.description.length > 15 ? item.description.slice(0, 10) : item.description
        return {
          ...item,
          isDone: item.isDone,
          isCompleted: item.isDone ? 'Completed' : 'Uncompleted',
          listAssignedString:
            listAssignedString.length > 10 ? listAssignedString.slice(0, 10) : listAssignedString,
          description: description,
          dateSort: new Date(item.startDate).toLocaleDateString('en-GB'),
          descriptionsFull: item.description,
          timeInDay:
            this.getTimeFromDate(item.startDate) + '-' + this.getTimeFromDate(item.endDate),
          weekday: new Date(item.startDate).toLocaleString('en-us', { weekday: 'short' }),
        }
      })

      this.listEvents = newData
      this.listEventOr = newData

      // this.isChangeDateField = false;

      // this.events = [];

      //   if (this.listLocation.length !== 0) {
      //     await book_management
      //       .getBookInventory(this.getLocationId(), this.month, this.year)
      //       .then((res) => {
      //         if (res) {
      //           res.forEach((x) => {
      //             this.events.push({
      //               productCode: x.productCode,
      //               description: x.description,
      //               unit: x.unit,
      //               bgQuantity: x.begQty,
      //               bgAmount: x.begAmt,
      //               ipQuantity: x.iiCaQty,
      //               ipAmount: x.iiCaAmt,
      //               outQuantity: x.iiCaQty,
      //               outAmount: x.adjCrAmt,
      //               endQuantity: x.endQty,
      //               endAmount: x.endAmt,
      //               userCreate: "hieu",
      //             });
      //           });
      //           console.log(this.getLocationId());
      //           this.isChooseDate = false;
      //           this.isLoading = false;
      //         } else {
      //           this.errorDialog = true;
      //         }
      //       })
      //       .catch(() => {
      //         this.errorDialog = true;
      //       });
      //   }
    },
    showEvent(eventMouse, event) {
      // console.log(this.events, id)
      // const event = this.events.find(item => {
      //   return item.appointmentID === id
      // })
      // console.log(event)
      this.$emit('showEvent', { nativeEvent: eventMouse, event: event })
    },
    // getLocationId() {
    //   if (this.listLocation.length === 0) {
    //     return;
    //   } else {
    //     return this.listLocation.find((element) => {
    //       return element.name === this.location;
    //     }).id;
    //   }
    // },
    getEventColor(event) {
      function rgba2hex(hex) {
        let A = '0.4'
        return (
          'rgba(' +
          parseInt(hex.substring(1, 3), 16) +
          ',' +
          parseInt(hex.substring(3, 5), 16) +
          ',' +
          parseInt(hex.substring(5, 7), 16) +
          ',' +
          A +
          ')'
        )
      }

      const category = this.listCategories.find(
        element => element.appointmentCategoryID === event.appointmentCategoryID
      )
      if (category && category.colorCode) {
        let colorCode = `${
          category.colorCode[0] !== '#' ? '#' + category.colorCode : category.colorCode
        }`
        if (event.isDone === true) {
          return rgba2hex(colorCode)
        }
        return colorCode
      } else {
        return '#616161'
      }
    },
    groupByDate(listEvent) {
      let listEventGroupByDate = []

      listEvent.forEach(element => {
        let date = new Date(element.startDate)
        date =
          this.ckeckNumber(date.getDate()) +
          '/' +
          this.ckeckNumber(date.getMonth() + 1) +
          '/' +
          date.getFullYear()
        if (
          listEventGroupByDate.length === 0 ||
          !listEventGroupByDate.some(elementSt => elementSt.date === date)
        ) {
          listEventGroupByDate.push({
            date: date,
            data: [element],
          })
        } else {
          listEventGroupByDate = listEventGroupByDate.map(itemI => {
            let date = new Date(element.startDate)
            date =
              this.ckeckNumber(date.getDate()) +
              '/' +
              this.ckeckNumber(date.getMonth() + 1) +
              '/' +
              date.getFullYear()
            return itemI.date === date
              ? {
                  ...itemI,
                  data: [...itemI.data, element],
                }
              : itemI
          })
        }
      })
      listEventGroupByDate.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
      return listEventGroupByDate
    },
    ckeckNumber(i) {
      if (i < 10) {
        return '0' + i
      }
      return i
    },
    groupColumnValueList(val) {
      return this.listEvents.map(d => d[val])
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listEvents
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (value === 'listAssigned') {
                element.forEach(e => {
                  if (accumulator.indexOf(e.teacherName) === -1) {
                    accumulator.push(e.teacherName)
                  }
                })
              }
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.listEvents
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (value === 'listAssigned') {
                element.forEach(e => {
                  if (accumulator.indexOf(e.teacherName) === -1) {
                    accumulator.push(e.teacherName)
                  }
                })
              }
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
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
<style lang="scss" scoped>
fieldset {
  display: none;
}

.select-book {
  padding: 0 !important;
}

.select-book * {
  margin: 0 !important;
}

#book-inventory-i-o {
  margin-top: 35px;
}

.event-table tbody:nth-child(odd) {
  background: #eff2ff;
}

.select-item {
  height: 35px;
}

input[type='text'] {
  margin-bottom: -20px;
}

tfoot tr td {
  border: none !important;
  color: #000;
  background: #9e9e9e;
}

table {
  border-collapse: collapse;
}

.table-data {
  max-height: 70vh;
  overflow: scroll;
}

.event-table {
  border-left: 1px solid #dae3e8;
  border-bottom: 1px solid #dae3e8;
}

.th-2 {
  width: 400px;
}

.v-data-table-header tr:nth-of-type(1) th {
  background: #0b2585;
  color: #ffff;
}

.v-data-table-header tr:nth-of-type(2) th {
  background: #0b2585;
}

.filter-event {
  background-color: #f8fafb !important;
}

.cycle {
  width: 16px;
  display: inline-block;
  font-size: 8px;
  height: 16px;
  border-radius: 50%;
  padding: 0 5px;
  margin-right: 3px;
  margin-bottom: -1.6px;
}

td,
th {
  border: none !important;
}

.v-data-table-header {
  position: relative;
  position: sticky;
  top: 0;
}

.v-data-table-header::before {
  content: '';
  top: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dae3e8;
}

// tbody tr:nth-child(even) {
//   background: #bde6fb;
// }

thead tr th {
  position: -webkit-sticky;
  position: sticky;
  text-align: center !important;
  border: 1px solid #dae3e8;
  background: #f8fafb;
}

th {
  z-index: 10000;
}

td,
th {
  padding: 5px 20px;
}

.v-data-table-header::before {
  content: '';
  top: 0;
  z-index: 1;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dae3e8;
}

.footer {
  padding: 0 !important;
  margin-top: 20px;
}

tfoot {
  position: sticky;
  bottom: 0;
}

tr {
  cursor: pointer;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: #ffff;
  font-weight: 100;
}
</style>
