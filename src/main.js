import Vue from "vue";
import App from "./App.vue";
import VueRotuer from "vue-router";
import router from "./router";

Vue.use(VueRotuer);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
