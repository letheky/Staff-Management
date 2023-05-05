<template>
  <v-app>
    <the-sidebar />
    <the-header />
    <v-main>
      <!-- <div class="content-wrap"> -->
      <router-view></router-view>
      <!-- </div> -->
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from '../components/Header/TheHeader.vue'
import TheSidebar from '../components/Sidebar/TheSidebar.vue'

export default {
  components: {
    TheHeader,
    TheSidebar,
  },
  data() {
    return {}
  },
  created() {
    window.onbeforeunload = () => {
      localStorage.removeItem('dateOfDailyClasses')
      localStorage.removeItem('filterDailyClass')
      localStorage.removeItem('dailyClassCenterSearch')
      localStorage.removeItem('listFilterStuAveByClass')
      localStorage.removeItem('filterQcSalary')
      localStorage.removeItem('searchKeyQC')
      localStorage.removeItem('searchFromDate')
      localStorage.removeItem('searchToDate')
      localStorage.removeItem('revenueReportSearchYear')
      localStorage.removeItem('CusFrom')
      localStorage.removeItem('CusTo')
      localStorage.removeItem('CusCenter')
      localStorage.removeItem('CosCenter')
      localStorage.removeItem('saleLocation')
      localStorage.removeItem('saleDate')
      localStorage.removeItem('outstandingLocation')
      localStorage.removeItem('aveLocation')
      localStorage.removeItem('absDate')
      localStorage.removeItem('absCenter')

      localStorage.removeItem('stopTo')
      localStorage.removeItem('stopFrom')
      localStorage.removeItem('stopCenter')
      localStorage.removeItem('fbmSearch')
      localStorage.removeItem('monthlycommentLocation')
      localStorage.removeItem('monthlycommentStatus')
      localStorage.removeItem('monthlycommentFrom')
      localStorage.removeItem('monthlycommentTo')
      localStorage.removeItem('fclassDetailM')
      localStorage.removeItem('fgualM')
      localStorage.removeItem('fevalM')
      localStorage.removeItem('noHwFilter')
      localStorage.removeItem('noHwDate')
      localStorage.removeItem('noHwCenter')
      localStorage.removeItem('telesaleToDate')
      localStorage.removeItem('telesaleFromDate')
      localStorage.removeItem('telesaleCenter')
      localStorage.removeItem('telesaleFilter')
    }
  },
  computed: {
    isActiveSidebar() {
      return this.$store.state.isActiveSidebar
    },
  },
  methods: {},
}
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
