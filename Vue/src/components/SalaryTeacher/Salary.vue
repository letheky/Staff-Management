<template>
  <div id="salary-teacher">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2>My Salary detail</h2>
          </div>
          <v-row class="pt-5">
            <v-col md="2">
              <!-- <v-text-field
                outlined
                dense
                label="From date"
                class="mr-2"
                v-model="fromDate"
                type="date"
              ></v-text-field> -->
              <date-picker
                :model="fromDate"
                @update:model="updateFromDate"
                title="From date"
              ></date-picker>
            </v-col>
            <v-col md="2">
              <!-- <v-text-field
                outlined
                dense
                label="To date"
                class="mr-2"
                v-model="toDate"
                type="date"
              ></v-text-field> -->
              <date-picker
                :model="toDate"
                @update:model="updateToDate"
                title="To date"
              ></date-picker>
            </v-col>
            <v-col md="1">
              <v-btn
                color="primary"
                dense
                elevation="1"
                @click="search()"
                class="pl-5 pr-5"
                :disabled="fromDate && toDate ? false : true"
                >Search</v-btn
              >
            </v-col>
            <v-col md="5">
              <v-card elevation="0" style="background: rgba(246, 246, 255, 1)">
                <v-row class="pl-5">
                  <v-col>
                    <p class="font-weight-bold">Total hours taught</p>
                    <h4 class="font-color">
                      {{ totalHourTaught.toLocaleString("en") }}
                    </h4>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <p class="font-weight-bold">Total payable</p>
                    <h4 class="font-color">
                      {{ totalPayable.toLocaleString("en") }}
                    </h4>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <p class="font-weight-bold">Total paid</p>
                    <h4 class="font-color">
                      {{ totalPaid.toLocaleString("en") }}
                    </h4>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col
              ><v-btn
                outlined
                elevation="0"
                height="36"
                class="ml-5 pl-5 pr-5"
                color="warning"
                :loading="isExporting"
                :disabled="isDisable"
                @click="exportExcel()"
              >
                Download file excel
              </v-btn></v-col
            >
          </v-row>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <div class="pb-10 pt-5">
            <v-data-table
              :headers="headers"
              :items="teacherDetailSalary"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-1"
              v-if="!isLoading"
              fixed-header
              height="60vh"
            >
              <template v-slot:header="{ props }">
                <tr class="fixed-row-filter">
                  <th v-for="header in props.headers" :key="header.text">
                    <v-icon v-if="header.text == 'No'">filter_list</v-icon>

                    <div v-if="filters.hasOwnProperty(header.value)">
                      <v-autocomplete
                        chips
                        small-chips
                        deletable-chips
                        hide-details
                        dense
                        multiple
                        :items="columnValueList(header.value)"
                        v-model="filters[header.value]"
                        class="ma-3 my-1"
                      >
                      </v-autocomplete>
                    </div>
                  </th>
                </tr>
              </template>

              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.classCode`]="{ item }"
                >{{ item.classCode }}
              </template>

              <template v-slot:[`item.date`]="{ item }"
                >{{ item.date }}
              </template>

              <template v-slot:[`item.scheTime`]="{ item }"
                >{{ item.scheTime }}
              </template>

              <template v-slot:[`item.hrsTaugh`]="{ item }"
                >{{ item.hrsTaugh.toLocaleString("en") }}
              </template>

              <template v-slot:[`item.feePerHrs`]="{ item }"
                >{{ item.feePerHrs.toLocaleString("en") }}
              </template>

              <template v-slot:[`item.exchangeRate`]="{ item }"
                >{{ item.exchangeRate.toLocaleString("en") }}
              </template>

              <template v-slot:[`item.payable`]="{ item }"
                >{{ item.payable.toLocaleString("en") }}
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
            :value="itemsPerPage"
            :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)"
            style="height: 32px"
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="teacherDetailSalary.length > 1">
            Total: {{ teacherDetailSalary.length }} records
          </h3>
          <h3 v-else>Total: {{ teacherDetailSalary.length }} record</h3>
        </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { financial } from "@/api/financial.js";
import { account_managerment } from "@/api/account-management.js";
import DatePicker from "@/components/Utils/DatePicker.vue";
const querystring = require("querystring");
export default {
  components: {
    "date-picker": DatePicker,
  },
  data() {
    return {
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      dropdownOpenFrom: false,
      dropdownOpenTo: false,
      fromDate: dayjs()
        .add(-parseInt(dayjs().add(-1, "day").format("DD")), "day")
        .format("YYYY-MM-DD"),
      toDate: dayjs().format("YYYY-MM-DD"),
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
          sortable: false,
          width: "5%",
        },
        {
          text: "Class code",
          value: "classCode",
          sortable: false,
          width: "15%",
        },
        { text: "Date", value: "date", sortable: false, width: "20%" },
        {
          text: "Class Time",
          value: "scheTime",
          sortable: false,
          width: "15%",
        },
        {
          text: "Hours Taught",
          value: "hrsTaugh",
          sortable: false,
          width: "7%",
        },
        {
          text: "Fee/hour (USD)",
          value: "feePerHrs",
          sortable: false,
          width: "10%",
        },
        {
          text: "Exchange Rate",
          value: "exchangeRate",
          sortable: false,
          width: "15%",
        },
        { text: "Payable", value: "payable", sortable: false, width: "15%" },
        { text: "Paid", value: "paid", sortable: false, width: "15%" },
      ],
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
      currentCenter: JSON.parse(localStorage.getItem("currentCenter")),
      // teacherDetailSalary: [],
      teacherID: "",
      isDisable: false,
      isExporting: false,
      totalHourTaught: 0,
      totalPayable: 0,
      totalPaid: 0,
      day: "",
      teacherListFiltered: [],
      filters: {
        classCode: [],
        date: [],
        scheTime: [],
      },
    };
  },
  watch: {
    teacherDetailSalary: function (value) {
      if (value) {
        this.totalHourTaught = 0;
        this.totalPayable = 0;
        this.totalPaid = 0;
        value.forEach((y) => {
          this.totalHourTaught = this.totalHourTaught + y.hrsTaugh;
          this.totalPayable = this.totalPayable + y.payable;
          this.totalPaid = this.totalPaid + parseInt(y.paid);
        });
      }
    },
  },
  created() {
    this.teacherID = this.currentUser.userInfo.teacherID;
    this.search();
  },
  computed: {
    teacherDetailSalary() {
      return this.teacherListFiltered.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
  },
  methods: {
    search() {
      if (this.fromDate && this.toDate) {
        this.teacherListFiltered = [];
        this.totalHourTaught = 0;
        this.totalPayable = 0;
        this.totalPaid = 0;
        this.isLoading = true;
        financial
          .getDetailTeacherSalary(this.teacherID, this.fromDate, this.toDate)
          .then((res) => {
            if (res.mess.message == "Ok") {
              res.detail[0].details.forEach((x) => {
                this.teacherListFiltered.push({
                  classCode: x.classCode,
                  date:
                    (new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() == 1
                      ? "Monday"
                      : new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() ==
                        2
                      ? "Tuesday"
                      : new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() ==
                        3
                      ? "Wednesday"
                      : new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() ==
                        4
                      ? "Thursday"
                      : new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() ==
                        5
                      ? "Friday"
                      : new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() ==
                        6
                      ? "Saturday"
                      : new Date(dayjs(x.date).format("MM/DD/YYYY")).getDay() ==
                        0
                      ? "Sunday"
                      : "") +
                    "," +
                    dayjs(x.date).format(" DD/MM/YYYY"),
                  scheTime: x.scheTime,
                  hrsTaugh: x.hrsTaugh,
                  feePerHrs: x.feePerHrs,
                  exchangeRate: x.exchangeRate,
                  payable: x.payable,
                  paid: x.paid,
                  classTime: x.classTime,
                });
              });
              this.teacherListFiltered.forEach((y) => {
                this.totalHourTaught = this.totalHourTaught + y.hrsTaugh;
                this.totalPayable = this.totalPayable + y.payable;
                this.totalPaid = this.totalPaid + parseInt(y.paid);
              });
              this.isLoading = false;
            }
          });
      }
    },
    columnValueList(val) {
      return this.teacherListFiltered.map((d) => d[val]).filter((y) => y);
    },
    async exportExcel() {
      this.isDisable = true;
      this.isExporting = true;
      let body = {
        teacherID: this.teacherID,
        fromDate: this.fromDate,
        toDate: this.toDate,
      };
      await account_managerment
        .exportExcelTeacherDetailSalary(querystring.stringify(body))
        .then((data) => {
          var fileURL = window.URL.createObjectURL(data);
          var fileLink = document.createElement("a");
          var today = new Date();
          var fileName = "Teacher_salary_detail_" + today.getFullYear();
          +"-" +
            this.checkTime(today.getMonth() + 1) +
            "-" +
            this.checkTime(today.getDate());
          fileLink.href = fileURL;
          fileLink.setAttribute("download", fileName + ".xls");
          document.body.appendChild(fileLink);

          fileLink.click();
          fileLink.remove();
        })
        .finally(() => {
          this.isExporting = false;
          this.isDisable = false;
        });
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    onResize() {
      this.maxHeight = window.innerHeight - 260;
    },
    updateFromDate(event) {
      this.fromDate = event;
    },
    updateToDate(event) {
      this.toDate = event;
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
#salary-teacher {
  .font-color {
    color: rgba(11, 37, 133, 1);
  }
}
</style>
