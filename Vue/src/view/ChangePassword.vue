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
            <h1 class="font-weight-bold pb-2">Change password</h1>
            <div class="pb-5">
              <span>You are using the default password.</span><br />
              <span>Protect your account with a different password</span>
            </div>
            <validation-observer ref="observer">
              <v-form ref="form" v-model="valid" @submit.prevent="validate()">
                <div>
                  <v-text-field
                    label="New password"
                    :append-icon="passTypeNewPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passTypeNewPass ? 'text' : 'password'"
                    @click:append="passTypeNewPass = !passTypeNewPass"
                    :error-messages="errors"
                    @keydown="loginErrorMessage = false"
                    v-model="newPassword"
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    label="Confirm new password"
                    :append-icon="passTypeReNewPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passTypeReNewPass ? 'text' : 'password'"
                    @click:append="passTypeReNewPass = !passTypeReNewPass"
                    :error-messages="errors"
                    @keydown="loginErrorMessage = false"
                    v-model="confirmNewPassword"
                    required
                    outlined
                  ></v-text-field>
                </div>
                <p v-if="loginErrorMessage" style="color: red">
                  {{ loginErrorMessage }}
                </p>

                <div class="text-right">
                  <v-btn color="secondary" type="submit">Change password</v-btn>
                </div>
              </v-form>
            </validation-observer>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  components: {},
  mounted: {},
  data() {
    return {
      valid: true,
      newPassword: null,
      confirmNewPassword: null,
      isLoading: false,
      message: this.$t("VIETNAMESE"),
      passTypeNewPass: false,
      passTypeReNewPass: false,
      status: false,
    };
  },
  methods: {
    validate() {
      //   if (valid) {
      //     let body = {
      //       username: this.username,
      //       password: this.password,
      //     };
      //     this.isLoading = true;
      //     user
      //       .login(body)
      //       .then((res) => {
      //         if (res) {
      //           var currentUser = JSON.stringify(res);
      //           localStorage.setItem("currentUser", currentUser);
      //           for (var i = 0; i < res.functions.length; i++) {
      //             if (this.permissions.indexOf(res.functions[i]) === -1) {
      //               this.permissions.push(res.functions[i]);
      //             }
      //           }
      //           localStorage.setItem(
      //             "permissions",
      //             JSON.stringify(this.permissions)
      //           );
      //           this.$router.push({ name: "homepage" });
      //         }
      //       })
      //       .catch((error) => {
      //         if (error.code === "DEE002") {
      //           this.loginErrorMessage = i18n.t("COMMON.INVALID_LOGIN");
      //         }
      //       })
      //       .finally(() => {
      //         this.isLoading = false;
      //       });
      //   }
    },
  },
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
