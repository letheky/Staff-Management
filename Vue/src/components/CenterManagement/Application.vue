<template>
  <v-app>
    <div id="center-management">
      <v-row no-gutters>
        <v-col md="12">
          <div class="pa-10 pt-5">
            <div class="d-flex justify-space-between mb-2">
              <h2 class="d-flex">
                <v-icon @click="back()">arrow_back_ios</v-icon>
                <div class="d-flex align-center">Application</div>
              </h2>
            </div>
            <h3 class="mb-3">Teacher</h3>
            <div>
              <v-card
                max-width="130"
                min-height="70"
                outlined
                class="ml-10 mb-3"
                style="background: rgba(235, 242, 255, 1)"
              >
                <router-link :to="{ name: 'teacher-leave-of-absence-request' }">
                  <v-card-title class="d-flex justify-center">
                    <i
                      class="isax isax-calendar fs-40"
                      style="color: rgba(244, 67, 54, 1)"
                    ></i>
                  </v-card-title>
                </router-link>
                <div class="text-center">
                  <span>Leave of Absence</span>
                </div>
              </v-card>
            </div>
            <h3>Student</h3>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-app>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    back() {
      window.history.back();
    },
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
</style>
