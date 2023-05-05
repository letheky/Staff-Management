<template>
  <div class="reward-item">
    <h3>{{ reward.rewardType }}</h3>
    <div class="d-flex align-center mt-1 mb-1">
      <div class="d-flex align-center mr-3">
        <img class="mr-2" src="../../assets/images/icon-graduate-hat.svg" alt="" />
        <span>{{ reward.classCode }}</span>
      </div>
      <div class="d-flex align-center">
        <img class="mr-2" src="../../assets/images/icon-date-brow.svg" alt="" />
        <span>{{ dayjs(reward.rewardDate).format('DD/MM/YYYY') }}</span>
      </div>
    </div>
    <p>
      {{ reward.description }}
    </p>
    <div>
      <a class="mt-3 mb-3 d-flex align-center" :href="reward.referLink">
        <img
          :style="{ width: '17px' }"
          class="mr-3"
          src="../../assets/images/icon-link.svg"
          alt=""
        />
        <p class="link">Reference link</p>
      </a>
    </div>
    <div class="reward-certi">
      <img :src="reward.certiLink" alt="" />
    </div>
    <div v-if="viewType === 'profile'" class="d-flex justify-end mt-3">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <div
            @click="$refs.confirmDelete.open()"
            class="d-flex align-center mr-4 cursor"
            v-bind="attrs"
            v-on="on"
          >
            <img
              :style="{ marginRight: '10px', width: '19px' }"
              src="../../assets/images/icon-delete.svg"
            />
            <p :style="{ color: 'red' }">Delete</p>
          </div>
        </template>
        <span>Delete</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <div
            @click="() => openRewardLog(reward)"
            class="d-flex align-center cursor"
            v-bind="attrs"
            v-on="on"
          >
            <img
              :style="{ marginRight: '10px', width: '19px' }"
              src="../../assets/images/icon-edit-underline.svg"
            />
            <span>Edit</span>
          </div>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <popup-confirm
        @confirm="confirmDelete"
        @cancel="cancelDelete"
        :maxWidth="450"
        confirmText="Yes, delete it!"
        :width="width"
        ref="confirmDelete"
      >
        <v-card-title slot="icon">
          <div :style="{ margin: '0 auto' }">
            <img src="../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
        ></v-card-title>
        <v-card-title slot="title">
          <h2 :style="{ width: '100%' }" class="text-center">Confirm delete</h2>
        </v-card-title>
        <v-card-title slot="content">
          <p class="text-center">
            Are you sure to delete this achievement & reward? You can not undo this action.
          </p>
        </v-card-title>
      </popup-confirm>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { rewardApi } from '@/api/reward.js'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'

export default {
  components: { 'popup-confirm': PopupConfirm },
  data() {
    return {}
  },
  methods: {
    confirmDelete() {
      this.deleteReward(this.reward.rewardID)
    },
    async deleteReward(rewardID) {
      await rewardApi.deleteReward(rewardID).then(() => {
        this.$emit('callData')
      })
    },
    openRewardLog(reward) {
      this.$emit('setLog', {
        openLog: true,
        reward: reward,
      })
    },
  },
  props: ['viewType', 'reward'],
  setup() {
    return {
      dayjs: dayjs,
    }
  },
}
</script>

<style lang="scss" scoped>
.reward-item {
  padding: 1rem 1.5rem;
  width: 400px;
  background: #f1f6ff;
  overflow: hidden;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.reward-certi {
  height: 200px;
  background: #000;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }
}
.cursor {
  cursor: pointer;
}
</style>
