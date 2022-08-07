<template>
  <div class="main-wrapper">
    <div class="aside">
      <div class="aside-inner">
        <div class="logo">
          <h2 class="logo-image">Logo will be here</h2>
        </div>
        <h3>Connected</h3>
        <div
          class="clients-list"
          v-for="client in clients"
          :key="client.socketId"
        >
          <ClientComponent :userName="client.userName" />
        </div>
      </div>
      <button class="copy-button">Copy Room ID</button>
      <button class="leave-button">Leave</button>
    </div>
    <div class="editor-wrapper">
      <EditorComponent />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

import ClientComponent from "./ClientComponent";
import EditorComponent from "./EditorComponent";
// import { initSocket } from "../socket";
import io from "socket.io-client";
import ACTIONS from "../Actions";
Vue.use(VueToast);
export default {
  name: "EditorPageComponent",
  props: {
    userName: String,
    roomId: String,
  },
  components: {
    ClientComponent,
    EditorComponent,
  },
  data() {
    return {
      clients: [],
      socket: io("http://localhost:5000"),
    };
  },
  methods: {
    handleErrors(err) {
      console.log("Socket error", err);
      Vue.$toast.open({
        message: "Socket connection failed, Please try again",
        type: "error",
      });
      this.$router.push({
        name: "Home",
      });
    },
    async init() {
      console.log("New 2 = " + this.roomId);
      // console.log("New 3 = " + ACTIONS.JOIN);
      this.socket.on("connect_error", (err) => this.handleErrors(err));
      this.socket.on("connect_failed", (err) => this.handleErrors(err));
      this.socket.emit(ACTIONS.JOIN, {
        roomId: this.roomId,
        userName: this.userName,
      });

      // Listening for the Joined event
      this.socket.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
        console.log("Hi");
        if (userName !== this.userName) {
          Vue.$toast.open({
            message: `${userName} joined the room.`,
          });
          console.log(`${userName} joined`);
          console.log(clients);
          console.log(socketId);
        }
        console.log("New 3 = " + JSON.stringify(clients));
        this.clients = clients;
      });

      // Listening for disconnected
      this.socket.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        Vue.$toast.open({
          message: `${userName} left the room.`,
        });
        this.clients = this.clients.filter(
          (client) => client.socketId !== socketId
        );
      });
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.socket.off(ACTIONS.JOINED);
    this.socket.off(ACTIONS.DISCONNECTED);
    this.socket.disconnect();
  },
  sockets: {
    connect: function () {
      console.log("Socket Connected");
    },
  },
};
</script>

<style scoped>
.main-wrapper {
  display: grid;
  height: 100vh;
  grid-template-columns: 230px 1fr;
}
.aside {
  display: flex;
  flex-direction: column;
  background: #1c1e29;
  padding: 16px;
  color: #fff;
}
.aside-inner {
  flex: 1;
}
.clients-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo {
  border-bottom: 1px solid #424242;
  padding-bottom: 10px;
}
.logo-iamge {
  height: 60px;
}

.leave-button {
  margin-top: 20px;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid grey;
  min-width: 5rem;
  margin: 0.5rem;
  font-weight: bold;
}

.leave-button:hover {
  background-color: red;
  color: white;
  font-weight: bold;
}

.copy-button {
  margin-top: 20px;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid grey;
  min-width: 5rem;
  margin: 0.5rem;
  font-weight: bold;
}

.copy-button:hover {
  background-color: white;
  color: red;
  font-weight: bold;
}
</style>
