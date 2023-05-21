<template>
  <v-app>
    <v-row no-gutters id="change-password" fill-height>
      <v-col md="4">
        <div class="pa-6">
          <router-link :to="{ name: 'login' }">
            <img src="@/assets/logo.png" />
          </router-link>
          <h1 class="white--text slogan-action">
            Be confident to reach your dream
          </h1>
        </div>
      </v-col>
      <v-col md="8">
        <div class="change-password-wrapper">
          <div class="change-password-inner">
            <h1 class="font-weight-bold pb-2">Forgot password</h1>
            <div class="pb-5">
              <span>Please enter your account.</span><br />
              <span>We will email you a link to reset your password</span>
            </div>
            <v-form ref="form" v-model="valid" @submit.prevent="validate()">
              <div>
                <v-text-field
                  label="User account"
                  type="text"
                  v-model="userAccount"
                  maxlength="30"
                  required
                  outlined
                ></v-text-field>
              </div>
              <div class="d-flex justify-space-between">
                <v-btn color="error" @click="back()" outlined>Back</v-btn>
                <v-btn
                  color="secondary"
                  type="submit"
                  :disabled="!userAccount"
                  >Send request</v-btn
                >
              </div>
            </v-form>
            <template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="350"
    >

      <v-card>
        <v-card-title class="text-h5 ">
       
         <div v-if="isSc== true" :style="{width : 'fit-content' , margin : '0 auto'}" class="text-center"> <img src="../assets/images/icon-done.svg" alt="" srcset=""></div>
         <div v-else :style="{width : 'fit-content' , margin : '0 auto'}"><img   @click=" dialog = false"  src="../assets/images/icon-pendding.svg" alt=""></div>
         <div  :style="{width : 'fit-content' }"><img   @click=" dialog = false"  src="../assets/images/icon-close.svg" alt=""></div>
        
        </v-card-title>

        <v-card-text>
          <div v-if="isSc ">
           <h3  class="text-center mb-5">Reset email has been sent successfully</h3>
          
<p class="text-center mb-5">Please check your email!</p>
</div>
           <h3 v-else class="text-center mb-5">Pendding</h3>
           <div class="d-flex justify-end">
           
           <v-btn color="primary"    outlined @click=" dialog = false , isSc= false">Close</v-btn>
           <v-btn color="primary" class="ml-3" @click="back()">Login</v-btn>
          </div>
        </v-card-text>

        

  
      </v-card>
    </v-dialog>
  </div>
</template>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import { loginadmin } from "@/api/login.js";

export default {
  name: "Login",

  data() {
    return {
      valid: true,
      userAccount: "",
      dialog : false , 
      isSc : false
      // accountRules: [
      //   (v) => v.length > 5 || "Account must be more than 5 characters",
      // ],
    };
  },
  methods: {
    validate() {
      if (this.valid) {
        this.dialog = true
        loginadmin.forgotPassword(this.userAccount).then((res) => {
          if (res) {
          this.isSc = true
           
          }
        }).catch(()=>{
          this.isSc = false
          this.dialog = false
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
    font-size: 24px;
    text-align: center;
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
