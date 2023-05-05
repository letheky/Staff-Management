<template>
  <v-app>
    <v-row no-gutters id="signup" fill-height>
      <v-col md="4" class="d-none d-md-block">
        <div class="pa-6">
          <router-link :to="{ name: 'login' }">
            <img src="@/assets/images/logo-white.svg" />
          </router-link>
          <h1 class="white--text slogan-action">
            Be confident to reach your dream
          </h1>
        </div>
      </v-col>
      <v-col md="8">
        <div class="signup-wrapper">
          <div class="signup">
            <span class="fs-14">
              Already have an account?
              <router-link class="font-weight-bold" :to="{ name: 'login' }">
                <b>Sign In</b>
              </router-link>
            </span>
          </div>
          <div class="signup-inner">
            <h1 class="font-weight-bold pb-10">Sign up to CEC system</h1>
            <v-form>
              <v-text-field
                label="User account"
                v-model="account"
                outlined
              ></v-text-field>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Last name"
                    outlined
                    v-model="lastname"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Mid name"
                    outlined
                    v-model="midname"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="First name"
                    outlined
                    v-model="firstname"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div>
                <v-text-field
                  label="Phone"
                  v-model="phone"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Email"
                  v-model="email"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Password"
                  :append-icon="passTypeCreatePass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passTypeCreatePass ? 'text' : 'password'"
                  @click:append="passTypeCreatePass = !passTypeCreatePass"
                  v-model="createPassword"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Confirm password"
                  :append-icon="passTypeConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passTypeConfirmPass ? 'text' : 'password'"
                  @click:append="passTypeConfirmPass = !passTypeConfirmPass"
                  hide-details
                  v-model="confirmPassword"
                  outlined
                ></v-text-field>
              </div>
              <div class="d-flex align-center">
                <v-checkbox v-model="checkbox" color="indigo darken-3">
                </v-checkbox>
                <span>
                  I agree to the
                  <router-link :to="{ name: 'ggg' }">
                    <span class="font-weight-bold"> Terms of Use </span>
                  </router-link>
                  and
                  <router-link :to="{ name: 'ggg' }">
                    <span class="font-weight-bold"> Privacy Policy </span>
                  </router-link>
                </span>
              </div>
              <div class="text-right">
                <v-btn class="pl-15 pr-15" color="secondary"> Sign Up </v-btn>
              </div>
            </v-form>
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
      password: null,
      isLoading: false,
      message: this.$t("VIETNAMESE"),
      passTypeCreatePass: false,
      passTypeConfirmPass: false,
      createPassword: null,
      confirmPassword: null,
      status: false,
      firstname: null,
      midname: null,
      lastname: null,
      phone: null,
      email: null,
    };
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
#signup {
  background: url("~@/assets/images/bg-login.jpg") left bottom;
  .signup-wrapper {
    background-color: #fff;
    border-radius: 25px 0px 0px 25px;
    height: 100vh;
    flex: 1;
    display: flex;
    align-items: center;
    .signup {
      position: absolute;
      top: 30px;
      right: 30px;
    }
    .signup-inner {
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
  #signup {
    background: none;
    .signup-inner {
      width: calc(100vw - 30px) !important;
    }
  }
}
</style>
