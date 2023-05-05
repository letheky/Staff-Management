<template>
  <v-app>
    <v-row no-gutters id="change-password" fill-height>
      <v-col md="4">
        <div class="pa-6">
          <img src="@/assets/images/logo-white.svg" />
          <h1 class="white--text">Be confident to reach<br />our dream</h1>
        </div>
      </v-col>
      <v-col md="8">
        <div class="change-password-wrapper">
          <div class="change-password-inner">
            <h1 class="font-weight-bold pb-2">Check your email!</h1>
            <div class="pb-5">
              <span>We have sent a new password to your email.</span><br />
              <span
                >Please check your spam folder if you don't see the email in
                your box</span
              >
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {

  components: {},
  mounted: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
#change-password {
  background: url("~@/assets/images/bg-login.jpg") left bottom;
  .change-password-wrapper {
    background-color: #fff;
    border-radius: 25px 0px 0px 25px;
    height: 100vh;
    flex: 1;
    display: flex;
    align-items: center;
    .change-password-inner {
      width: 450px;
      margin: 0 auto;
    }
  }
}
@media (max-width: 641px) {
  #change-password {
    background: none;
    .change-password-inner {
      width: calc(100vw - 30px) !important;
    }
  }
}
</style>
