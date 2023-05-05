<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-row>
            <v-col md="8">
              <h2 class="d-flex">
                <v-icon @click="back()">arrow_back_ios</v-icon>
                <div class="d-flex">Feedback detail</div>
              </h2>
              <div class="pl-8 pb-10">
                <div class="d-flex justify-space-between">
                  <div class="d-flex align-center">
                    <v-avatar size="75">
                      <img src="@/assets/images/ImageProfile.jpg" />
                    </v-avatar>
                    <div class="ml-3">
                      <p style="color: #1b1a57; font-size: 16px; font-weight: 400">
                        {{ detailFeedBack.fullName }}
                      </p>
                      <span style="color: #a1a1bc; font-size: 16px">{{
                        _dayjs(detailFeedBack.feedbackTime).format('DD/MM/YYYY HH:mm')
                      }}</span>
                    </div>
                    <v-icon
                      size="18"
                      color="primary"
                      class="ml-2"
                      @click="$refs.confirmDelete.open()"
                      >mdi-delete</v-icon
                    >
                  </div>
                  <v-btn
                    :color="detailFeedBack.isResolved ? 'error' : 'primary'"
                    v-if="
                      functionRole.filter(
                        x =>
                          (x.functionID == feedbackPermission && x.cModify == true) ||
                          (x.functionID == feedbackPermission && x.cFull == true)
                      ).length == 1
                    "
                    class="ml-4"
                    elevation="0"
                    @click="
                      detailFeedBack.isResolved
                        ? updateStatusFeedback()
                        : $refs.updateStatusFeedback.open()
                    "
                  >
                    {{ detailFeedBack.isResolved ? 'Unresolved' : 'Resolved' }}
                  </v-btn>
                </div>
                <h3 class="pt-2">Feedback:</h3>
                <span class="fs-16">
                  {{ detailFeedBack.contents }}
                </span>
                <h3 class="pt-2">Note:</h3>
                <span class="fs-16">{{ detailFeedBack.note }}</span>
              </div>
            </v-col>
            <v-divider vertical />
            <v-col md="4">
              <div class="pt-3">
                <div v-if="detailFeedBack.isResolved">
                  <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
                  <span class="ml-1 mt-2" style="font-size: 16px">Resolved</span>
                  <p class="ml-1 mt-1 mb-3">
                    Marked "Resolved" by
                    {{ detailFeedBack.resolverName || '' }} on
                    {{ _dayjs(detailFeedBack.resolveTime).format('DD/MM/YYYY HH:mm') }}
                  </p>
                </div>
                <div v-else class="d-flex mb-3">
                  <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
                  <span class="ml-1 mt-1">Unresolved</span>
                </div>
                <h2>Feedback information</h2>
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Center</v-col>
                      <v-col md="6">{{ detailFeedBack.locationName || '' }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Feedback about</v-col>
                      <v-col md="6">{{ detailFeedBack.type || '' }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class</v-col>
                      <v-col md="6">{{ detailFeedBack.classCode || '' }}</v-col>
                    </v-row>
                  </div>
                </div>

                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class admin</v-col>
                      <v-col md="6">{{ classAdmin }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">EC</v-col>
                      <v-col md="6">{{ customerCareStaff }}</v-col>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="error"
      ref="confirmDelete"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="error" class="mb-5" outline>mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm detele</h2>
        <p class="text-center" style="font-size: 14px">
          Are you sure to delete feedback? This action <br />
          cannot be undone
        </p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
    <popup-filter
      @confirm="updateStatusFeedback"
      @cancel="cancelUpdateStatus"
      :maxWidth="maxWidth"
      :width="widthFilter"
      ref="updateStatusFeedback"
    >
      <v-card-title
        slot="title"
        class="pt-0 mb-5 pa-0"
        style="display: flex; flex-direction: column !important; align-items: flex-start"
      >
        <h4 class="mb-5">Note</h4>
        <div class="mb-3">
          <v-textarea
            placeholder="Enter note *"
            style="width: 350px"
            filled
            v-model="note"
            counter="500"
            maxlength="500"
          >
          </v-textarea>
        </div>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-filter>
  </div>
</template>

<script>
import { center_managerment } from '@/api/center-management.js'
import { class_managerment } from '@/api/class-management.js'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import dayjs from 'dayjs'
import PopupFilter from '@/components/CenterManagement/FeedBackManagement/PopupFilter.vue'

export default {
  components: {
    'popup-confirm': PopupConfirm,
    'popup-filter': PopupFilter,
  },
  data() {
    return {
      isLoading: false,
      feedbackID: this.$route.params.feedBackID,
      detailFeedBack: '',
      error: 'error',
      maxWidth: 1000,
      width: 420,
      fromDate: this.$route.params.fromDate,
      toDate: this.$route.params.toDate,
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      feedbackPermission: process.env.VUE_APP_ENV_FUNCTION_FEEDBACK,
      note: '',
      classID: '',
      classAdmin: '',
      customerCareStaff: '',
    }
  },
  created() {
    this.getFeedback()
  },
  methods: {
    async getFeedback() {
      this.isLoading = true
      await center_managerment.feedBackDetail(this.feedbackID).then(res => {
        if (res) {
          this.isLoading = false
          this.detailFeedBack = res
          this.classID = res.classID
        }
      })
      await class_managerment.getClassInfo(this.classID).then(res => {
        if (res) {
          this.classAdmin = res.classInfo.classAdmin
          this.customerCareStaff = res.classInfo.customerCareStaff
        }
      })
    },
    updateStatusFeedback() {
      const statusFeedback = this.detailFeedBack.isResolved ? 'PENDING' : 'DONE'
      let body = {
        feedbackId: this.feedbackID,
        status: statusFeedback,
        note: this.note,
      }
      center_managerment.updateStatusFeedBack(body).then(res => {
        if (res.status === 200) {
          this.getFeedback()
        }
      })
    },
    cancelDelete() {},
    cancelUpdateStatus() {},
    confirmDelete() {
      center_managerment.feedBackDelete(this.detailFeedBack.recordID).then(res => {
        if (res.status === 200) {
          this.init()
        }
      })
      this.$router.push({
        name: 'center-management-feedback',
        params: {
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
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
#lesson-management {
  .list-info {
    position: relative;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
    .border-vertical {
      position: absolute;
      bottom: 24px;
      right: 0;
      width: 1px;
      height: 100%;
      background: url(~@/assets/images/line-vertical.png) no-repeat bottom center;
    }
  }
  .slot-infor {
    max-width: 500px;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
  }
  .imageVector {
    width: 19px;
    height: 18px;
  }
}
</style>
