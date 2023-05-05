<template>
  <div id="center-management">
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-row no-gutters v-if="!isLoading">
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2 class="d-flex">
              <v-icon @click="back()">arrow_back_ios</v-icon>
              <div class="d-flex align-center">
                Leave of absence request detail
              </div>
            </h2>
          </div>
          <div class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Update absence status successfully
            </v-alert>
          </div>
          <div class="d-flex align-center">
            <div class="ml-10">
              <v-avatar class="d-flex" size="100">
                <img :src="'data:image/jpeg;base64,' + photo" />
              </v-avatar>
            </div>
            <div class="d-flex align-center">
              <span class="ml-5 mr-5 fs-24">{{ fullName }}</span>
              <div @click="viewProfile(teacherID)" class="link-action">
                View profile
              </div>
            </div>
            <div v-if="status == 'PENDING'" class="d-flex ml-15">
              <div
                class="label-action d-flex align-center"
                @click="
                  approvedOrReject = 'APPROVED';
                  $refs.confirmRejectOrApproved.open();
                "
              >
                <v-icon color="#0FA958"> mdi-check </v-icon>
                <span style="color: #246aff">Approve</span>
              </div>
              <div
                class="label-action d-flex align-center ml-10"
                @click="
                  approvedOrReject = 'REJECTED';
                  $refs.confirmRejectOrApproved.open();
                "
              >
                <v-icon color="#F44336"> mdi-close </v-icon>
                <span style="color: #f44336">Reject</span>
              </div>
            </div>
          </div>
          <div class="pt-2">
            <div class="reason-title">Reason for leave of absence:</div>
            <h3>{{ reason }}</h3>
          </div>
          <div class="d-flex pt-3">
            <v-row>
              <v-col md="3">
                <div class="mr-10">
                  <p class="reason-title mb-2">From</p>
                  <span>{{
                    _dayjs(fromTime).format("DD/MM/YYYY, HH:mm")
                  }}</span>
                </div>
              </v-col>
              <v-col md="3">
                <div class="ml-10">
                  <p class="reason-title mb-2">Until</p>
                  <span>{{ _dayjs(toTime).format("DD/MM/YYYY, HH:mm") }}</span>
                </div>
              </v-col>
              <v-col md="3">
                <div class="reason-title d-flex align-center">
                  <span class="pr-2">Status</span>
                  <v-chip color="orange" small v-if="status === 'PENDING'">
                    {{ status }}
                  </v-chip>
                  <v-chip
                    text-color="red"
                    small
                    v-else-if="status === 'REJECTED'"
                  >
                    {{ status }}
                  </v-chip>
                  <v-chip
                    text-color="blue"
                    small
                    v-else-if="status === 'APPROVED'"
                  >
                    {{ status }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <popup-confirm
      @confirm="confirmRejectOrApproved"
      @cancel="cancelRejectOrApproved"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="approvedOrReject == 'REJECTED' ? 'error' : 'success'"
      ref="confirmRejectOrApproved"
    >
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="icon"
        class="pt-0"
        v-if="approvedOrReject == 'REJECTED'"
      >
        <v-icon x-large color="error" class="mb-5" outline
          >mdi-close-circle</v-icon
        >
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
        v-if="approvedOrReject == 'REJECTED'"
      >
        <h2 class="text-center">Confirm reject</h2>
        <p class="text-center">Are you sure to reject request?</p>
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="icon"
        class="pt-0"
        v-if="approvedOrReject == 'APPROVED'"
      >
        <v-icon x-large color="success" outline class="mb-5"
          >mdi-checkbox-marked-circle</v-icon
        >
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
        v-if="approvedOrReject == 'APPROVED'"
      >
        <h2 class="text-center">Confirm approved</h2>
        <p class="text-center">Are you sure to approved request?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { staff_absence } from "@/api/staff-absence.js";
import PopupConfirm from "@/components/Utils/PopupConfirm.vue";
const querystring = require("querystring");

export default {
  components: {
    "popup-confirm": PopupConfirm,
  },
  data() {
    return {
      checkSuccess: false,
      isLoading: false,
      fullName: "",
      photo: "",
      reason: "",
      fromTime: "",
      toTime: "",
      status: "",
      teacherID: "",
      recordID: this.$route.params.recordID,
      approvedOrReject: "",
      maxWidth: 1000,
      width: 400,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await staff_absence.viewStaffAbsence(this.recordID).then((res) => {
        if (res) {
          this.fullName = res.fullName;
          this.photo = res.photo;
          this.reason = res.reason;
          this.fromTime = res.fromTime;
          this.toTime = res.toTime;
          this.status = res.status;
          this.teacherID = res.teacherID;
        }
      });
    },
    cancelRejectOrApproved() {},
    async confirmRejectOrApproved() {
      const body = {
        leaveOfAbsenceID: this.recordID,
        status: this.approvedOrReject == "APPROVED" ? "APPROVED" : "REJECTED",
      };
      await staff_absence
        .approveOrRejectAbsence(querystring.stringify(body))
        .then((res) => {
          if (res.mess.message == "Ok") {
            this.checkSuccess = true;
            setTimeout(() => {
              this.checkSuccess = false;
              localStorage.setItem("isBackFromDetailStaffAbsenceRequest", true);
              this.$router.push({ name: "staff-leave-of-absence-request" });
            }, 2000);
          }
        });
    },
    viewProfile(userId) {
      this.$router.push({
        name: "account-management-view-account",
        params: { userId: userId },
      });
    },
    back() {
      localStorage.setItem("isBackFromDetailStaffAbsenceRequest", true);
      window.history.back();
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
.success {
  width: 300px;
  position: absolute;
  right: 0;
  bottom: 5%;
  z-index: 999;
}
.reason-title {
  font-size: 14px;
  color: #000000;
}
.label-action {
  cursor: pointer;
}
.link-action {
  font-size: 16px;
  color: #246aff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
