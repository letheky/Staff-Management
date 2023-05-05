import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#0B2585",
        secondary: "#246AFF",
        error: "#DC322D",
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
