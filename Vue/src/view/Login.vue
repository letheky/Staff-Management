<template>
  <v-app>
    <v-row no-gutters id="login" fill-height>
      <v-col md="4">
        <div class="pa-6">
          <img src="@/assets/logo.png" />
          <h1 class="white--text slogan-action">Hệ thống quản lý nghiên cứu khoa học</h1>
        </div>
      </v-col>
      <v-col md="8">
        <div class="login-wrapper">
          <div class="login-inner">
            <h1 class="font-weight-bold pb-10">Đăng nhập tài khoản của bạn vào hệ thống</h1>
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
                  <p v-if="code" style="color: red">Tên tài khoản hoặc mật khẩu không đúng!</p>
                </div>
                <p v-if="loginErrorMessage" style="color: red; margin-bottom: 10px">
                  {{ loginErrorMessage }}
                </p>

                <div class="d-flex justify-space-between align-center">
                  <router-link :to="{ name: 'forgot-password' }"> Quên mật khẩu? </router-link>
                  <v-btn class="pl-15 pr-15" color="secondary" type="submit">Đăng nhập</v-btn>
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
import { loginadmin } from '@/api/login.js'
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
      groupID: null,
      code: false,
    }
  },
  created() {
    localStorage.clear()
  },
  methods: {
    async validate() {
      let valid = this.$refs.observer.validate()
      if (valid) {
        this.isLoading = true
        let body = {
          username: this.account,
          password: this.password,
        }
        await loginadmin
          .login(body)
          .then(res => {
            this.code = Object.keys(res.user).length > 0 ? false : true
            localStorage.setItem('currentUser', JSON.stringify(res))
            if (Object.keys(res.user).length > 0) {
              this.$router.push({ name: 'home' })
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
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
