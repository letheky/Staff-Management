<template>
  <!-- <v-app> -->
  <div id="center-management">
    <v-row no-gutters id="change-password">
      <v-col md="12">
        <div class="pa-6 pt-5 d-flex">
          <h2>
            <v-icon @click="back()">arrow_back_ios</v-icon>
          </h2>
          <h2 class="pt-1">Change password</h2>
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
        <div class="change-password-wrapper">
          <div class="change-password-inner">
            <validation-observer ref="observer">
              <v-form ref="form" v-model="valid" @submit.prevent="validate()">
                <div>
                  <validation-provider
                    v-slot="{ errors }"
                    name="oldPassword"
                    rules="required"
                  >
                    <v-text-field
                      label="Old password"
                      :append-icon="passTypeOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="passTypeOldPass ? 'text' : 'password'"
                      @click:append="passTypeOldPass = !passTypeOldPass"
                      :error-messages="errors"
                      @keydown="loginErrorMessage = false"
                      v-model="oldPassword"
                      required
                      outlined
                    ></v-text-field>
                  </validation-provider>
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
                      :error-messages="errors"
                      @keydown="loginErrorMessage = false"
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
                        passTypeReNewPass ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :type="passTypeReNewPass ? 'text' : 'password'"
                      @click:append="passTypeReNewPass = !passTypeReNewPass"
                      :error-messages="errors"
                      @keydown="loginErrorMessage = false"
                      v-model="confirmNewPassword"
                      required
                      outlined
                    ></v-text-field>
                  </validation-provider>
                </div>
                <p v-if="code != 200 && code" style="color: red">
                  Change password failed!
                </p>

                <div class="text-right">
                  <v-btn class="mr-3" color="error" @click="back()" outlined
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="secondary"
                    type="submit"
                    @click="dialog = true"
                    :disabled="
                      !oldPassword ||
                      !newPassword ||
                      !confirmNewPassword ||
                      newPassword != confirmNewPassword
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
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <v-btn
              elevation="0"
              height="36"
              class="pl-4 pr-4 mr-3 mb-5"
              :loading="dialog"
              style="background: white"
            >
            </v-btn>
          </div>
          <div class="text-center">
            <b style="font-size: 1.5rem">Saving!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
  <!-- </v-app> -->
</template>

<script>
import { my_profile } from "@/api/my-profile.js";
import {
  ValidationProvider,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
setInteractionMode("eager");
const querystring = require("querystring");
export default {
  name: "ChangePassword",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mounted: {},
  data() {
    return {
      valid: true,
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null,
      isLoading: false,
      message: this.$t("VIETNAMESE"),
      passTypeOldPass: false,
      passTypeNewPass: false,
      passTypeReNewPass: false,
      loginErrorMessage: "",
      status: false,
      code: "",
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
      userName: "",
      fullName: "",
      dialog: false,
    };
  },
  created() {
    this.userName = this.currentUser.userInfo.userName;
    this.fullName = this.currentUser.userInfo.fullName;
  },
  methods: {
    validate() {
      if (this.valid) {
        this.isLoading = true;
        const body = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
        my_profile
          .changePassword(querystring.stringify(body))
          .then((res) => {
            this.code = res.code;
            if (res.code == 200) {
              this.dialog = true;
              this.checkSuccess = true;
              setTimeout(() => {
                this.checkSuccess = false;
                this.$router.push({ name: "my-profile" });
              }, 2000);
              this.dialog = false;
            } else {
              this.dialog = false;
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            this.isLoading = false;
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
  .success {
    width: 300px;
    position: absolute;
    right: 0;
    top: 5%;
    z-index: 999;
  }
  .change-password-wrapper {
    background-color: #fff;
    border-radius: 25px 0px 0px 25px;
    height: 70vh;
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
