import Vue from "vue";
import App from "./App.vue";
import VueRotuer from "vue-router";
import router from "./router";
import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";

// export const SocketInstance = socketio("http://localhost:5000");
// Vue.use(VueRotuer, VueSocketIO, SocketInstance);
Vue.use(VueRotuer);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://localhost:5000"),
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
