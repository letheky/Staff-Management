<template>
  <v-app>
    <v-row no-gutters id="change-password" fill-height>
      <v-col md="4">
        <div class="pa-6">
          <router-link :to="{ name: 'login' }">
            <img src="@/assets/images/logo-white.svg" />
          </router-link>
          <h1 class="white--text slogan-action">
            Be confident to reach your dream
          </h1>
          <div v-if="code == 200" class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Reset password successfully!
            </v-alert>
          </div>
        </div>
      </v-col>
      <v-col md="8">
        <div class="change-password-wrapper">
          <div class="change-password-inner">
            <h1 class="font-weight-bold pb-3">Reset password</h1>
            <validation-observer ref="observer">
              <v-form ref="form" v-model="valid" @submit.prevent="validate()">
                <div>
                  <validation-provider
                    v-slot="{ errors }"
                    name="newPassword"
                    rules="required"
                  >
                    <v-text-field
                      label="New password"
                      :append-icon="passTypeNewPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="passTypeNewPass ? 'text' : 'password'"
                      @click:append="passTypeNewPass = !passTypeNewPass"
                      @keydown="loginErrorMessage = false"
                      :error-messages="errors"
                      v-model="newPassword"
                      required
                      outlined
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="confirmNewPassword"
                    rules="required"
                  >
                    <v-text-field
                      label="Confirm new password"
                      :append-icon="
                        passTypeConfirmNewPass ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :type="passTypeConfirmNewPass ? 'text' : 'password'"
                      @click:append="
                        passTypeConfirmNewPass = !passTypeConfirmNewPass
                      "
                      @keydown="loginErrorMessage = false"
                      :error-messages="errors"
                      v-model="confirmNewPassword"
                      required
                      outlined
                    ></v-text-field>
                  </validation-provider>
                </div>
                <p v-if="code == 400" style="color: red">
                  Token is expired. Please reset password try again!
                </p>
                <p
                  v-else-if="code && code != 400 && code != 200"
                  style="color: red"
                >
                  You have reset your password. Please try again!
                </p>
                <div class="d-flex justify-end">
                  <v-btn
                    color="secondary"
                    type="submit"
                    :disabled="
                      (newPassword == confirmNewPassword) == '' ||
                      !newPassword ||
                      !confirmNewPassword
                    "
                    >Save</v-btn
                  >
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
import {
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { loginadmin } from "@/api/login.js";
setInteractionMode("eager");
export default {
  name: "ResetPassword",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      valid: true,
      userAccount: "",
      accountRules: [
        (v) => v.length > 5 || "Account must be more than 5 characters",
      ],
      newPassword: "",
      confirmNewPassword: "",
      passTypeNewPass: false,
      passTypeConfirmNewPass: false,
      loginErrorMessage: "",
      token: this.$route.query.token,
      code: "",
      dialog: false,
      checkSuccess: false,
    };
  },
  methods: {
    validate() {
      if (this.valid) {
        loginadmin.resetPassword(this.token, this.newPassword).then((res) => {
          this.code = res.code;
          if (res.code == 200) {
            this.dialog = true;
            this.checkSuccess = true;
            setTimeout(() => {
              this.checkSuccess = false;
              this.$router.push({ name: "login" });
            }, 1000);
            this.dialog = false;
          }
        });
      }
    },
    back() {
      window.history.back();
    },
  },
};
</script>
<style lang="scss" scoped>
#change-password {
  background: url("~@/assets/images/bg-login.jpg") left bottom;
  .success {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
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
  img {
    height: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .slogan-action {
    font-size: 36px;
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
