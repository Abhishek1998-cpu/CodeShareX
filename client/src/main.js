import Vue from "vue";
import App from "./App.vue";
import VueRotuer from "vue-router";
import router from "./router";
import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import Vuelidate from "vuelidate";

Vue.use(VueRotuer, Vuelidate);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("https://intense-mesa-48160.herokuapp.com"),
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");