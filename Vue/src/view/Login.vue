<template>
  <v-app>
    <v-row no-gutters id="login" fill-height>
      <v-col md="4">
        <div class="pa-6">
          <img src="@/assets/images/logo-white.svg" />
          <h1 class="white--text slogan-action">Be confident to reach your dream</h1>
        </div>
      </v-col>
      <v-col md="8">
        <div class="login-wrapper">
          <!-- <div class="sign-up">
            <span class="fs-14">
              Want to create a new account?
              <router-link class="font-weight-bold" :to="{ name: 'signup' }">
                <b>Sign Up</b>
              </router-link>
            </span>
          </div> -->
          <div class="login-inner">
            <h1 class="font-weight-bold pb-10">Sign in to your CEC system</h1>
            <validation-observer ref="observer">
              <v-form ref="form" v-model="valid" @submit.prevent="validate()">
                <div>
                  <validation-provider v-slot="{ errors }" name="account" rules="required">
                    <v-text-field
                      placeholder="User account"
                      v-model="account"
                      :error-messages="errors"
                      @keydown="loginErrorMessage = false"
                      required
                      outlined
                      label="User account"
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="password" rules="required">
                    <v-text-field
                      placeholder="User password"
                      label="User password"
                      :append-icon="passType ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="passType ? 'text' : 'password'"
                      @click:append="passType = !passType"
                      :error-messages="errors"
                      @keydown="loginErrorMessage = false"
                      v-model="password"
                      required
                      outlined
                    ></v-text-field>
                  </validation-provider>
                  <p v-if="code == 400" style="color: red">
                    The account or password you enter is not correct!
                  </p>
                </div>
                <p v-if="loginErrorMessage" style="color: red; margin-bottom: 10px">
                  {{ loginErrorMessage }}
                </p>

                <div class="d-flex justify-space-between align-center">
                  <router-link :to="{ name: 'forgot-password' }"> Forgot password? </router-link>
                  <v-btn class="pl-15 pr-15" color="secondary" type="submit">Login</v-btn>
                </div>
              </v-form>
            </validation-observer>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="notInLocationDialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>This account does not belong to any location. Please contact administrator!</p>
          </div>
          <div class="text-center">
            <v-btn class="mt-2" color="error" elevation="0" @click="cancel()" outlined>
              Cancel
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </v-app>
</template>

<script>
import { loginadmin } from '@/api/login.js'
import { center_managerment } from '@/api/center-management.js'
// const querystring = require("querystring");
setInteractionMode('eager')
import { ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'

export default {
  name: 'Login',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      valid: true,
      isLoading: false,
      message: this.$t('VIETNAMESE'),
      passType: false,
      status: false,
      account: null,
      password: null,
      loginErrorMessage: null,
      informationUser: null,
      roleId: null,
      currentCenter: JSON.parse(localStorage.getItem('currentCenter'))
        ? JSON.parse(localStorage.getItem('currentCenter'))
        : null,
      groupID: null,
      code: '',
      notInLocationDialog: false,
    }
  },
  created() {
    localStorage.clear()
  },
  methods: {
    validate() {
      let valid = this.$refs.observer.validate()
      if (valid) {
        this.isLoading = true
        let body = {
          userName: this.account,
          passWord: this.password,
        }
        loginadmin
          .login(body)
          .then(res => {
            if (res) {
              this.code = res.code
              const userWithoutPhoto = res
              localStorage.removeItem('dateOfDailyClasses')
              localStorage.removeItem('filterDailyClass')
              localStorage.removeItem('dailyClassCenterSearch')
              if (userWithoutPhoto.userInfo) {
                userWithoutPhoto.userInfo.photo = null
                const dataUserView = userWithoutPhoto.locationPermissions[0]
                const userInfo = userWithoutPhoto.userInfo
                localStorage.setItem(
                  'qcDetailViewMe',
                  JSON.stringify({
                    qcId: userInfo.teacherID,
                    locationID: dataUserView ? dataUserView.locationID : null,
                    year: new Date().getFullYear(),
                    month: new Date().getMonth(),
                  })
                )
                var currentUser = JSON.stringify(userWithoutPhoto)
                localStorage.setItem('currentUser', currentUser)
              }

              this.informationUser = userWithoutPhoto

              if (this.currentCenter) {
                if (res.userInfo.accountTypeID === 4) {
                  this.$router.push({ name: 'my-calendar-overview' })
                  localStorage.setItem('accountTypeID', res.userInfo.accountTypeID)
                } else if (res.userInfo.accountTypeID === 1) {
                  this.$router.push({ name: 'student-calendar-overview' })
                  localStorage.setItem('accountTypeID', res.userInfo.accountTypeID)
                } else {
                  res.locationPermissions.forEach(x => {
                    if (x.locationID == this.currentCenter) {
                      this.groupID = x.groupID
                    }
                  })
                  if (this.groupID == null) {
                    if (
                      Array.isArray(res.locationPermissions) &&
                      res.locationPermissions.length > 1
                    ) {
                      this.$router.push({ name: 'choose-center' })
                    } else {
                      this.groupID = res.locationPermissions[0].groupID
                      localStorage.setItem(
                        'currentCenter',
                        JSON.stringify(res.locationPermissions[0].locationID)
                      )
                    }
                  }
                  center_managerment.functionRole(this.groupID).then(res => {
                    if (res) {
                      localStorage.setItem('functionRole', JSON.stringify(res))
                      this.groupID != null ? this.$router.push({ name: 'home' }) : null
                    }
                  })
                }
              } else {
                if (
                  res.locationPermissions &&
                  res.locationPermissions.length > 1 &&
                  res.userInfo &&
                  res.userInfo.accountTypeName
                ) {
                  this.$router.push({ name: 'choose-center' })
                  if (res.userInfo.accountTypeName === 'Teacher') {
                    this.$router.push({ name: 'my-calendar-overview' })
                    localStorage.setItem('accountTypeID', res.userInfo.accountTypeID)
                  }
                } else if (res.userInfo.accountTypeName === 'Student') {
                  this.$router.push({ name: 'student-calendar-overview' })
                  localStorage.setItem('accountTypeID', res.userInfo.accountTypeID)
                } else if (res.locationPermissions && res.locationPermissions.length === 1) {
                  localStorage.setItem(
                    'currentCenter',
                    JSON.stringify(res.locationPermissions[0].locationID)
                  )

                  if (res.userInfo && res.userInfo.accountTypeName === 'Teacher') {
                    this.$router.push({ name: 'my-calendar-overview' })
                  } else if (res.userInfo && res.userInfo.accountTypeName === 'Student') {
                    this.$router.push({ name: 'student-calendar-overview' })
                    localStorage.setItem('accountTypeID', res.userInfo.accountTypeID)
                  } else {
                    center_managerment
                      .functionRole(res.locationPermissions[0].groupID)
                      .then(res => {
                        if (res) {
                          localStorage.setItem('functionRole', JSON.stringify(res))
                          this.$router.push({ name: 'home' })
                        }
                      })
                  }
                } else {
                  if (res.userInfo && res.userInfo.accountTypeID === 5) {
                    localStorage.clear()
                    this.notInLocationDialog = true
                  } else if (
                    res.userInfo &&
                    (res.userInfo.accountTypeID == 1 || res.userInfo.accountTypeID == 2)
                  ) {
                    this.$router.push({ name: 'home' })
                  } else if (res.userInfo && res.userInfo.accountTypeID == 4) {
                    this.$router.push({ name: 'my-calendar-overview' })
                  } else if (res.userInfo && res.userInfo.accountTypeID == 1) {
                    this.$router.push({ name: 'student-calendar-overview' })
                  } else if (res.userInfo.accountTypeID == 4) {
                    this.$router.push({ name: 'my-calendar-overview' })
                  }
                }
              }
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    cancel() {
      this.notInLocationDialog = false
    },
  },
}
</script>
<style lang="scss" scoped>
#login {
  background: url('~@/assets/images/bg-login.jpg') left bottom;

  .login-wrapper {
    background-color: #fff;
    border-radius: 25px 0px 0px 25px;
    height: 100vh;
    flex: 1;
    display: flex;
    align-items: center;

    .sign-up {
      position: absolute;
      top: 30px;
      right: 30px;
    }

    .login-inner {
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
    font-size: 24px;
    text-align: center;
  }
}

@media (max-width: 641px) {
  #login {
    background: none;

    .login-inner {
      width: calc(100vw - 30px) !important;
    }
  }
}
</style>
