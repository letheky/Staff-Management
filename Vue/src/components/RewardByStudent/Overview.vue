<template>
  <div class="mt-7 ml-10 mr-10">
    <h2 class="mb-7">Thành tích và khen thưởng</h2>
    <template v-if="loading">
      <div class="px-10">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <RewardByStudentOrProfile v-else :rewardList="rewardList" :viewType="'student'" />
  </div>
</template>

<script>
import { rewardApi } from '@/api/reward.js'
import RewardByStudentOrProfile from '../RewardByStudentOrProfile/Overview.vue'
export default {
  components: { RewardByStudentOrProfile },
  data() {
    return {
      studentID: JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID,
      rewardList: [],
      loading: false,
    }
  },
  created() {
    this.getRewardByStudent()
  },
  setup() {
    return {}
  },

  methods: {
    async getRewardByStudent() {
      this.loading = true
      await rewardApi.getRewardByStudent(this.studentID).then(res => {
        this.rewardList = res
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
