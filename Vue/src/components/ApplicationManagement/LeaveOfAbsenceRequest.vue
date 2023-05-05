<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2>My leave of absence request</h2>
          </div>
          <div class="d-flex justify-end mb-2">
            <v-btn color="primary" elevation="0" @click="requestAbsence()">
              Request a Leave of Absence
            </v-btn>
          </div>
          <div class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Update absence successfully
            </v-alert>
          </div>
          <div class="pb-5">
            <v-progress-linear
              v-if="isLoading"
              indeterminate
              color="primary"
              class="my-10"
            ></v-progress-linear>
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="leaveOfAbsence"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-0"
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.fromTime`]="{ item }">
                {{ _dayjs(item.fromTime).format("DD/MM/YYYY") }}
              </template>

              <template v-slot:[`item.toTime`]="{ item }">
                {{ _dayjs(item.toTime).format("DD/MM/YYYY") }}
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <v-chip
                  text-color="blue"
                  small
                  v-if="item.status === 'PENDING'"
                >
                  {{ item.status }}
                </v-chip>
                <v-chip
                  text-color="error"
                  small
                  v-if="item.status === 'REJECTED'"
                >
                  {{ item.status }}
                </v-chip>
                <v-chip
                  text-color="success"
                  small
                  v-if="item.status === 'APPROVED'"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex">
                  <i
                    @click="edit(item.leaveOfAbsenceID)"
                    v-if="item.status === 'REJECTED'"
                    class="isax isax-edit-2 fs-18 font-weight-bold mr-4"
                  ></i>
                  <v-icon
                    size="18"
                    color="primary"
                    @click="
                      $refs.confirmDelete.open();
                      leaveOfAbsenceID = item.leaveOfAbsenceID;
                    "
                    v-if="item.status === 'REJECTED'"
                  >
                    close
                  </v-icon>
                </div>
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
        <v-col md="10" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            elevation="0"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="maxWidth"
      :width="width"
      confirmColor="error"
      ref="confirmDelete"
    >
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="icon"
        class="pt-0"
      >
        <v-icon x-large color="error" class="mb-5" outline>
          mdi-close-circle
        </v-icon>
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
      >
        <h2 class="text-center">Confirm cancel</h2>
        <p class="text-center">Are you sure to cancel request?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
  </div>
</template>

<script>
import PopupConfirm from "@/components/Utils/PopupConfirm.vue";
import { staff_absence } from "@/api/staff-absence.js";
import dayjs from "dayjs";
export default {
  components: {
    "popup-confirm": PopupConfirm,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      maxWidth: 1000,
      width: 400,
      leaveOfAbsence: [],
      isLoading: false,
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
          sortable: false,
          width: "5%",
        },
        {
          text: "Reason for leave of absence",
          value: "reason",
          sortable: false,
          width: "30%",
        },
        { text: "From Time", value: "fromTime", sortable: false, width: "25%" },
        { text: "To Time", value: "toTime", sortable: false, width: "25%" },
        { text: "Status", value: "status", sortable: false, width: "15%" },
        { text: "Action", value: "action", sortable: false, width: "15%" },
      ],
      leaveOfAbsenceID: "",
      checkSuccess: false,
      userInfor: JSON.parse(localStorage.getItem("currentUser")).userInfo,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await staff_absence
        .listStaffAbsence(this.userInfor.userID)
        .then((res) => {
          if (res) {
            this.leaveOfAbsence = res;
          }
        });
    },
    requestAbsence() {
      this.$router.push({ name: "application-leave-absence" });
    },
    cancelDelete() {},
    confirmDelete() {
      this.isLoading = true;
      this.leaveOfAbsence = [];
      this.page = 1;
      staff_absence.deleteStaffAbsence(this.leaveOfAbsenceID).then((res) => {
        if (res.code == 200) {
          this.init();
          this.isLoading = false;
        }
      });
    },
    edit(leaveOfAbsenceID) {
      this.$router.push({
        name: "application-edit-staff-absence-request",
        params: { leaveOfAbsenceID: leaveOfAbsenceID },
      });
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
<style lang="scss" scoped></style>
