<template>
  <v-app>
    <the-header />
    <v-main>
      <!-- <div class="content-wrap"> -->
      <router-view></router-view>
      <!-- </div> -->
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from "../components/Header/TheHeader.vue";

export default {
  components: {
    TheHeader,
  },
  data() {
    return {};
  },
  computed: {
    isActiveSidebar() {
      return this.$store.state.isActiveSidebar;
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  align-items: stretch;
}
#main-container {
  width: calc(100% - 250px);
  min-height: 100vh;
  transition: all 0.3s;
  position: absolute;
  top: 0;
  right: 0;
}

#main-container.active-sidebar {
  width: calc(100% - 50px);
}
</style>
