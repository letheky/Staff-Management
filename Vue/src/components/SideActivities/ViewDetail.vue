<template>
  <div class="mt-3 ml-5 mr-5">
    <v-row no-gutters>
      <div class="header-activity d-flex justify-space-between align-center">
        <div class="d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">{{ activityInfor.activityTypeName }}</div>
          </h2>
        </div>
        <v-btn
          outlined
          color="primary"
          @click="
            $router.push({
              name: 'create-activity',
              query: {
                activityID: activityID,
              },
            })
          "
          >Edit activity</v-btn
        >
      </div>
    </v-row>
    <v-row>
      <v-col cols="8">
        <div class="mb-2" :style="{ borderBottom: '2px solid #EBECED' }">
          <img style="max-width: 100%" :src="activityInfor.imgCover" alt="" />
          <h3>{{ activityInfor.title }}</h3>
        </div>
        <div
          class="detail-activity-content"
          v-html="activityInfor.content ? activityInfor.content : ''"
        ></div>
      </v-col>
      <v-col cols="4">
        <h3>Activity information</h3>
        <v-row
          :style="{ background: '#FAF9FF', borderRadius: '4px' }"
          class="mt-3 pt-2 pl-3 pr-3 pb-6"
        >
          <v-col cols="5"> Activity code </v-col>
          <v-col cols="7">{{ activityInfor.activityCode }} </v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Activity type </v-col>
          <v-col cols="7">{{ activityInfor.activityTypeCode }} </v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Start date </v-col>
          <v-col cols="7"> {{ dayjs(activityInfor.startDate).format('DD/MM/YYYY') }}</v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> End date </v-col>
          <v-col cols="7">{{ dayjs(activityInfor.endDate).format('DD/MM/YYYY') }}</v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Duration</v-col>
          <v-col cols="7"> {{ activityInfor.duration }}</v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Center</v-col>
          <v-col cols="7"
            >{{
              activityInfor.locationIDs
                ? activityInfor.locationIDs.map(i => i.location).join(',')
                : ''
            }}
          </v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Create date</v-col>
          <v-col cols="7">{{ dayjs(activityInfor.createAt).format('DD/MM/YYYY') }} </v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Create by</v-col>
          <v-col cols="7">{{ activityInfor.createBy }} </v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Update date </v-col>
          <v-col cols="7">{{ dayjs(activityInfor.updateAt).format('DD/MM/YYYY') }} </v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
          <v-col cols="5"> Update by </v-col>
          <v-col cols="7"> {{ activityInfor.updateBy }}</v-col>
          <v-col cols="12" :style="{ borderBottom: '1px dashed #dadbe6' }" class="pt-0 pb-0">
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { activities } from '@/api/activities'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      activityInfor: {},
      dayjs: dayjs,
      activityID: this.$route?.query?.activityID ? this.$route?.query?.activityID : 0,
    }
  },

  created() {
    this.getActivityInfor()
  },
  methods: {
    async getActivityInfor() {
      activities
        .getActivityByID(this.activityID)
        .then(res => {
          this.activityInfor = res
        })
        .catch(() => {
          this.activityInfor = {}
        })
    },
    back() {
      window.history.back()
    },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.header-activity {
  width: 100%;
}
</style>
