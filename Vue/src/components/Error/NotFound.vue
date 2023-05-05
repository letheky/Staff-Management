<template>
  <div class="page main-signin-wrapper bg-primary construction">
    <div class="container">
      <div class="title text-white">
        <h2 class="fs-140 mb-0" style="margin-top: -100px">404</h2>
        <h1 style="font-size: 2.5rem">
          Oops. This page you are looking for doesn't exist..
        </h1>
        <router-link :to="{ name: 'home' }">
          <v-btn class="button-action pl-7 pr-7" dark> Back to Home </v-btn>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data: () => ({}),
};
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.construction {
  background-image: url(/img/bg-error.46b630e8.png);
  position: relative;
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.construction:before {
  content: "";
  height: 100%;
  width: 100%;
  background: rgba(77, 76, 178, 0.96);
  position: absolute;
  left: 0;
  z-index: -1;
  top: 0;
}
.bg-primary {
  background-color: #6259ca !important;
}

.v-application {
  line-height: 0 !important;
}
.text-white {
  color: #ffffff !important;
}
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
.title {
  text-align: center;
  font-family: Roboto, sans-serif;
  line-height: 1.5;
}
.fs-140 {
  font-size: 140px;
}
.main-signin-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}
.button-action {
  background-color: #19b159 !important;
  border-color: #19b159 !important;
  margin-top: 50px;
}
</style>
