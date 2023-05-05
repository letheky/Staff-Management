<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2 class="d-flex">
              <v-icon @click="back()">arrow_back_ios</v-icon>
              <div class="d-flex align-center">
                Leave of absence request history - {{ teacherName }}
              </div>
            </h2>
            <v-btn
              color="primary"
              class="ml-4"
              elevation="0"
              @click="requestAbsence()"
              >Request a Leave of Absence</v-btn
            >
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
              fixed-header
              height="65vh"
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.reason`]="{ item }"
                >{{ item.reason }}
              </template>

              <template v-slot:[`item.until`]="{ item }">{{
                item.until
              }}</template>

              <template v-slot:[`item.from`]="{ item }">{{
                item.from
              }}</template>

              <template v-slot:[`item.status`]="{ item }">
                <v-chip
                  text-color="blue"
                  small
                  v-if="item.status === 'PENDING'"
                  >{{ item.status }}</v-chip
                >
                <v-chip
                  text-color="error"
                  small
                  v-if="item.status === 'REJECTED'"
                  >{{ item.status }}</v-chip
                >
                <v-chip
                  text-color="success"
                  small
                  v-if="item.status === 'APPROVED'"
                  >{{ item.status }}</v-chip
                >
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex">
                  <i
                    @click="edit(item.recordID)"
                    class="isax isax-edit-2 fs-18 font-weight-bold mr-4"
                    v-if="item.status === 'PENDING'"
                  ></i>
                  <v-icon
                    size="18"
                    color="primary"
                    @click="
                      $refs.confirmDelete.open();
                      recordID = item.recordID;
                    "
                    v-if="item.status === 'PENDING'"
                    >close</v-icon
                  >
                </div>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-footer
      v-if="!isLoading"
      fixed
      absolute
      height="60"
      color="#fff"
      class="pl-10 pr-10"
    >
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
        <v-col class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            elevation="0"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-footer>
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
        <v-icon x-large color="error" class="mb-5" outline
          >mdi-close-circle</v-icon
        >
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
import { teacher_absence } from "@/api/teacher-absence.js";
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
        { text: "From", value: "fromTime", sortable: false, width: "25%" },
        { text: "Until", value: "toTime", sortable: false, width: "25%" },
        { text: "Status", value: "status", sortable: false, width: "15%" },
        { text: "Action", value: "action", sortable: false, width: "15%" },
      ],
      userInfor: JSON.parse(localStorage.getItem("currentUser")).userInfo,
      teacherID: this.$route.params.teacherId,
      teacherName: JSON.parse(localStorage.getItem("teacherName")),
      recordID: "",
      checkSuccess: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await teacher_absence
        .leaveAbsence(this.userInfor.teacherID)
        .then((res) => {
          if (res) {
            res.teacherAbsence.forEach((x) => {
              this.leaveOfAbsence.push({
                recordID: x.recordID,
                fromTime: dayjs(x.fromTime).format("DD/MM/YYYY HH:mm:ss"),
                toTime: dayjs(x.toTime).format("DD/MM/YYYY HH:mm:ss"),
                teacherID: x.teacherID,
                reason: x.reason,
                status: x.status ? x.status : "PENDING",
              });
            });
          }
        });
    },
    requestAbsence() {
      this.$router.push({ name: "my-calendar-register-the-absence" });
    },
    cancelDelete() {},
    confirmDelete() {
      this.isLoading = true;
      this.leaveOfAbsence = [];
      this.page = 1;
      teacher_absence.deleteAbsence(this.recordID).then((res) => {
        if (res.code == 200) {
          this.init();
          this.isLoading = false;
        }
      });
    },
    edit(recordID) {
      this.$router.push({
        name: "my-calendar-edit-the-absence",
        params: { recordID: recordID },
      });
    },
    back() {
      window.history.back();
    },
  },
};
</script>
<style lang="scss" scoped></style>
