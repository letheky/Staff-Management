import Vue from "vue";
import VueI18n from "vue-i18n";
import vi from "@/i18n/lang/vi.js";
import en from "@/i18n/lang/en.js";

Vue.use(VueI18n);

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("lang");
// console.log("local", myParam);
let test = null;
if (myParam && (myParam === "vi" || myParam === "en")) {
  test = myParam;
} else if (
  !localStorage.getItem("systemLanguage") ||
  localStorage.getItem("systemLanguage") === "" ||
  localStorage.getItem("systemLanguage") === null
) {
  if (navigator.languages[0] === "vi") {
    test = "vi";
  } else {
    test = "en";
  }
} else {
  test = localStorage.getItem("systemLanguage");
}
localStorage.setItem("systemLanguage", test);
const locale = localStorage.getItem("systemLanguage") || "en"; // default locale

export default new VueI18n({
  locale,
  messages: {
    en: Object.assign({}, en),
    vi: Object.assign({}, vi),
  },
});
