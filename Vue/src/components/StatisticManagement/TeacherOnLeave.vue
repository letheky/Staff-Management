<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">Teachers on leave</h2>
          </div>
          <div class="d-flex justify-space-between pt-2">
            <div class="d-flex">
              <v-autocomplete
                label="Year"
                :items="years"
                item-text="year"
                item-value="year"
                v-model="year"
                outlined
                dense
              ></v-autocomplete>
              <v-btn
                class="ml-2"
                elevation="0"
                height="36"
                color="primary"
                @click="searchYear()"
              >
                <v-icon size="18"> mdi-magnify </v-icon>
              </v-btn>
            </div>
          </div>
          <div class="pb-2" v-if="filtered.length != 1">
            Total: {{ filtered.length }} teachers
          </div>
          <div class="pb-2" v-else>Total: {{ filtered.length }} teacher</div>
          <v-data-table
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            height="60vh"
            fixed-header
          >
            <template v-slot:header="{ props }">
              <tr class="fixed-row-filter">
                <th v-for="header in props.headers" :key="header.text">
                  <div v-if="filters.hasOwnProperty(header.value)">
                    <v-autocomplete
                      class="ma-3 my-1"
                      v-model="filters[header.value]"
                      :items="groupColumnValueList(header.value)"
                      multiple
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                          ripple
                          @mousedown.prevent
                          @click="toggle(header.value)"
                        >
                          <v-list-item-action>
                            <v-icon
                              v-if="
                                filters[header.value].length ==
                                desserts
                                  .map((d) => d[header.value])
                                  .reduce(function (accumulator, element) {
                                    if (accumulator.indexOf(element) === -1) {
                                      accumulator.push(element);
                                    }
                                    return accumulator;
                                  }, []).length
                              "
                            >
                              mdi-close-box
                            </v-icon>
                            <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title> Select All </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ index }">
                        <span v-if="index == 0">
                          {{ filters[header.value].length }} selected
                        </span>
                      </template>
                    </v-autocomplete>
                  </div>
                </th>
              </tr>
            </template>

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.usedAnnualLeave`]="{ item }">
              <div class="d-flex">
                <span>{{ item.usedAnnualLeave }}</span>
                <v-menu v-if="item.usedAnnualLeave != 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-4"
                      icon
                      height="18"
                      width="18"
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      @click="viewDetailReason(item.techerID)"
                    >
                      <v-icon>info</v-icon>
                    </v-btn>
                  </template>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr style="background-color: #f7f7f7">
                          <th class="text-left">Date</th>
                          <th class="text-left" width="200px">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(reason, index) in reasonList" :key="index">
                          <td class="fs-12">
                            {{ _dayjs(reason.fromTime).format("DD/MM/YYYY") }} -
                            {{ _dayjs(reason.toTime).format("DD/MM/YYYY") }}
                          </td>
                          <td class="fs-12">{{ reason.reason }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-menu>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div color="#fff" class="w-100 pl-10 pr-10">
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
        <v-col md="10" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
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
import { statistic_management } from "@/api/statistic-management.js";
import { account_managerment } from "@/api/account-management.js";
const querystring = require("querystring");
import dayjs from "dayjs";
import message from "@/components/Utils/message";

export default {
  components: {},
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      year: new Date().getFullYear(),
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
          sortable: false,
        },
        { text: "Teacher code", value: "teacherCode", sortable: false },
        { text: "Teacher name", value: "fullName", sortable: false },
        {
          text: "Number of days of leave in the year",
          value: "annualLeave",
          sortable: false,
        },
        {
          text: "Number of days of leave",
          value: "usedAnnualLeave",
          sortable: false,
        },
        {
          text: "Remaining leave days",
          value: "remainAnnualLeave",
          sortable: false,
        },
      ],
      teacherList: [],
      filters: {
        teacherCode: [],
        fullName: [],
        annualLeave: [],
        usedAnnualLeave: [],
        remainAnnualLeave: [],
      },
      reasonList: [],
      errorDialog: false,
      message: message,
    };
  },
  created() {
    this.searchYear();
  },
  computed: {
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 1900 },
        (value, index) => 1901 + index
      );
    },
    filtered() {
      return this.teacherList.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
  },
  methods: {
    async searchYear() {
      this.isLoading = true;
      let body = {
        year: this.year,
      };
      await statistic_management
        .getTeacherOnLeave(querystring.stringify(body))
        .then((res) => {
          if (res && !res.errors) {
            this.teacherList = res;
          } else {
            this.errorDialog = true;
          }
        })
        .catch(() => {
          this.errorDialog = true;
        });
      this.isLoading = false;
    },
    async viewDetailReason(teacherID) {
      let body = {
        pYear: this.year,
        pUserId: teacherID,
      };
      await account_managerment
        .getUserAbsence(querystring.stringify(body))
        .then((res) => {
          if (res) {
            this.reasonList = res;
          }
        });
    },
    viewDetail(centerId) {
      this.$router.push({
        name: "center-management-detail",
        params: { centerId: centerId },
      });
    },
    groupColumnValueList(val) {
      return this.teacherList.map((d) => d[val]).filter((y) => y);
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.teacherList
            .map((d) => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element);
              }
              return accumulator;
            }, []).length
        ) {
          this.filters[value] = [];
        } else {
          this.filters[value] = this.teacherList
            .map((d) => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element);
              }
              return accumulator;
            }, [])
            .slice();
        }
      });
    },
    back() {
      window.history.back();
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
.fs-12 {
  font-size: 12px !important;
}
</style>
