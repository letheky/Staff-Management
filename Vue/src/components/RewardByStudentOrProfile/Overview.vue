<template>
  <div
    :style="{
      width: '99%',
      overflowX: 'scroll',
      fontSize: '1.1rem',
    }"
  >
    <div
      class="d-flex align-center mb-3"
      :style="{
        width: 'fit-content',
        gap: '20px',
      }"
    >
      <RewardItem
        v-for="reward in rewardList"
        :key="reward.rewardID"
        :reward="reward"
        @setLog="setLogReward"
        @callData="callData"
        :viewType="viewType"
      />
    </div>
    <FormReward
      :dialog="dialogReward"
      :reward="rewardSelect"
      :type="'update'"
      @callData="getRewardList"
      @setLog="setLogReward"
    />
  </div>
</template>

<script>
import FormReward from '@/components/Report/AchievementReward/FormReward.vue'
import RewardItem from './RewardItem.vue'
export default {
  components: { RewardItem, FormReward },
  data() {
    return {
      dialogReward: false,
      rewardSelect: {},
    }
  }, // studentID:
  //   this.viewType === 'profile'
  //     ? 1
  //     : JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID,
  setup() {
    return {}
  },
  props: ['rewardList', 'viewType'],
  methods: {
    getRewardList() {
      this.$emit('callData')
    },
    openRewardLog(item) {
      this.setLogReward({
        openLog: true,
        reward: item,
      })
      this.rewardSelect = item
    },
    setLogReward(data) {
      console.log(data)
      this.dialogReward = data.openLog
      this.rewardSelect = data.reward
    },
    callData() {
      this.$emit('callData')
    },
    // async getRewardByStudent() {
    //   await rewardApi.getRewardByStudent()
    // },
  },
}
</script>

<style lang="scss" scoped></style>
