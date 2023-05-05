import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import i18n from './i18n'
import './assets/js/validationRules'
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.config.productionTip = false
import VueObserveVisibility from 'vue-observe-visibility'

import './assets/scss/app.scss'
import './assets/iconsax.css'

import VueFlashMessage from '@smartweb/vue-flash-message'

Vue.use(VueFlashMessage)
Vue.use(VueI18n)
Vue.use(VueObserveVisibility)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA3MiiQ9ETVZhNeZcoRfos5sM9XbPfm8yo',
    libraries: 'places',
  },
})

new Vue({
  i18n,
  router,
  store,
  vuetify,

  render: h => h(App),
}).$mount('#app')
