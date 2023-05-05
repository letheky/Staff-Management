<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">
              Teacher:
              {{ teacherName }}
            </h2>
          </div>
          <div class="d-flex">
            <v-row class="mt-5 mb-5 pt-2">
              <v-col md="3" style="background-color: rgba(196, 196, 196, 0.25)">
                <date-picker :model="fromDate" @update:model="updateFromDate" title="From date"
                  style="background: white"></date-picker>
              </v-col>
              <v-col md="3" style="background-color: rgba(196, 196, 196, 0.25)">
                <date-picker :model="toDate" @update:model="updateToDate" title="To date" style="background: white">
                </date-picker>
              </v-col>
              <v-col md="2" style="
                  display: grid;
                  background-color: rgba(196, 196, 196, 0.25);
                ">
                <v-btn elevation="0" height="36" class="pl-5 pr-5" color="primary" @click="search()"
                  :disabled="!fromDate || !toDate">
                  Search
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn outlined elevation="0" height="36" class="ml-5 pl-5 pr-5" color="warning" :loading="isExporting"
                  :disabled="isDisable" @click="exportExcel()">
                  Export Excel
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div class="pb-10 pt-0">
            <v-data-table :headers="headers" :items="teacherSalary" :page.sync="page" :items-per-page="itemsPerPage"
              hide-default-footer @page-count="pageCount = $event" item-key="taskID" :id="tables" class="elevation-1">
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.date`]="{ item }">
                {{ _dayjs(item.date).format("DD/MM/YYYY") }}
              </template>

              <template v-slot:[`item.exchangeRate`]="{ item }">
                <div class="text-center">
                  {{
                  item.exchangeRate
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }}
                </div>
              </template>

              <template v-slot:[`item.payable`]="{ item }">
                {{
                item.payable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }}
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
    <div color="#fff" class="w-100 pl-10 pr-10">
      <v-row>
        <v-col md="2">
          <v-select outlined hide-details dense :value="itemsPerPage" :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)" style="height: 32px"></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="teacherSalary.length != 1">
            Total: {{ teacherSalary.length }} records
          </h3>
          <h3 v-else>Total: {{ teacherSalary.length }} record</h3>
        </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination v-model="page" :length="pageCount" elevation="0"></v-pagination>
        </v-col>
      </v-row>
    </div>
    <v-row justify="center">
      <v-dialog v-model="errorDialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined>
              Back
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { teacher_information } from "@/api/teacher-information.js";
import { account_managerment } from "@/api/account-management.js";
import { financial } from "@/api/financial.js";
const querystring = require("querystring");
import DatePicker from "@/components/Utils/DatePicker.vue";
import message from "@/components/Utils/message";
export default {
  components: {
    "date-picker": DatePicker,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
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
        { text: "Date", value: "date", sortable: false, width: "12%" },
        {
          text: "Class Time",
          value: "scheTime",
          sortable: false,
          width: "12%",
        },
        {
          text: "Hours Taught",
          value: "hrsTaugh",
          sortable: false,
          width: "12%",
        },
        {
          text: "Fee/hour",
          value: "feePerHrs",
          sortable: false,
          width: "12%",
        },
        {
          text: "Exchange Rate",
          value: "exchangeRate",
          sortable: false,
          width: "12%",
        },
        { text: "Payable", value: "payable", sortable: false, width: "25%" },
      ],
      centerList: JSON.parse(localStorage.getItem("currentUser"))
        .locationPermissions,
      currentCenter: JSON.parse(localStorage.getItem("currentCenter")),
      teacherSalary: [],
      teacherGroups: [],
      teacherTypes: [],
      teacherGroup: 1,
      teacherType: 1,
      fromDate: "",
      toDate: "",
      teacherID: this.$route.params.teacherId,
      teacherName: "",
      tables: "tables",
      name: "Teacher salary detail",
      isDisable: false,
      isExporting: false,
      searchTeacher: JSON.parse(localStorage.getItem("searchTeacher")),
      searchTeacherGroup: JSON.parse(
        localStorage.getItem("searchTeacherGroup")
      ),
      searchTeacherType: JSON.parse(localStorage.getItem("searchTeacherType")),
      searchFromDate: JSON.parse(localStorage.getItem("searchFromDate")),
      searchToDate: JSON.parse(localStorage.getItem("searchToDate")),
      errorDialog: false,
      message: message,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();
      this.fromDate =
        currentYear + "-" + this.checkTime(currentMonth) + "-" + "01";
      this.toDate =
        currentYear +
        "-" +
        this.checkTime(currentMonth) +
        "-" +
        this.checkTime(currentDate);
      await teacher_information.getListTeacherGroup().then((res) => {
        if (res) {
          this.teacherGroups = res;
        }
      });
      await teacher_information.getListTeacherType().then((res) => {
        if (res) {
          this.teacherTypes = res;
        }
      });
      await financial
        .getDetailTeacherSalary(this.teacherID, this.fromDate, this.toDate)
        .then((res) => {
          if (res.mess && res.mess.message == "Ok") {
            res.detail.forEach((x) => {
              this.teacherSalary = x.details;
              this.teacherName = x.teacherSheetName;
            });
          }
          else {
            this.errorDialog = true;
          }
        })
        .catch(() => {
          this.errorDialog = true;
        });
    },
    search() {
      financial
        .getDetailTeacherSalary(this.teacherID, this.fromDate, this.toDate)
        .then((res) => {
          if (res.mess.message == "Ok") {
            this.teacherSalary = res.detail[0].details;
          }
        });
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
    back() {
      localStorage.setItem("searchTeacher", JSON.stringify(this.searchTeacher));
      localStorage.setItem(
        "searchTeacherGroup",
        JSON.stringify(this.searchTeacherGroup)
      );
      localStorage.setItem(
        "searchTeacherType",
        JSON.stringify(this.searchTeacherType)
      );
      localStorage.setItem(
        "searchFromDate",
        JSON.stringify(this.searchFromDate)
      );
      localStorage.setItem("searchToDate", JSON.stringify(this.searchToDate));
      this.$router.push({ name: "financial-teacher-salary" });
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

</style>
