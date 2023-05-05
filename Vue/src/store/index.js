import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isActiveSidebar: false,
  },
  mutations: {
    changeStatusSidebar(state, value) {
      // alert(state);
      state.isActiveSidebar = value
      // console.log(state);
    },
  },
  actions: {},
  modules: {},
})
