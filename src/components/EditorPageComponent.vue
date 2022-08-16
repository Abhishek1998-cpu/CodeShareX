<template>
  <div class="main-wrapper">
    <div class="aside">
      <div class="aside-inner">
        <div class="logo">
          <h2 class="logo-image">Logo will be here</h2>
        </div>
        <h3>User Connected</h3>
        <div
          class="clients-list"
          v-for="client in clients"
          :key="client.socketId"
        >
          <ClientComponent :userName="client.userName" />
        </div>
      </div>
      <button class="copy-button" v-on:click="copyRoomId">Copy Room ID</button>
      <button class="leave-button" v-on:click="leaveRoom">Leave</button>
    </div>
    <div class="editor-wrapper">
      <EditorComponent
        v-bind:socket="socket"
        v-bind:roomId="roomId"
        @onCodeChange="syncOnCodeChange"
      />
      <div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
          "
        >
          <div style="display: flex; flex-direction: row; align-items: center">
            <h3 style="font-weight: 400">Select Language: &nbsp;</h3>
            <select name="" id="" v-model="language">
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="js">Javascript</option>
              <option value="py">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div>
            <button v-on:click="executeCode">Run</button>
            <button v-on:click="clearOutput">Clear Output</button>
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            gap: 1rem;
            padding-right: 1rem;
            padding-left: 1rem;
          "
        >
          <div>
            <h3 style="text-align: left; font-weight: 400">Output:</h3>
          </div>
          <div>
            <span>
              <h4 v-if="showOutput">{{ output }}</h4>
            </span>
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            gap: 1rem;
            padding-right: 1rem;
            padding-left: 1rem;
          "
        >
          <div>
            <button
              v-if="showOutput"
              v-on:click="renderMoreDetails"
              style="margin: 0rem"
            >
              {{ showMoreDetails ? "Hide More Detals" : "Show More Detals" }}
            </button>
          </div>
          <div v-if="showMoreDetails">
            <h4 style="text-align: left; font-weight: 400">
              Status: {{ this.status }}
            </h4>
            <h4 style="text-align: left; font-weight: 400">
              {{ this.jobId && `JobId: ${this.jobId}` }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import ClientComponent from "./ClientComponent";
import EditorComponent from "./EditorComponent";
import axios from "axios";
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
//       socket: io("http://localhost:5000", {
//    transports: ['websocket']
// }),
socket: io("http://localhost:5000"),
      codeRef: "Enter your code here",
      showOutput: false,
      output: "",
      language: "cpp",
      status: "",
      jobId: "",
      showMoreDetails: false,
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
      // console.log("New 2 = " + this.roomId);
      // console.log("New 3 = " + ACTIONS.JOIN);
      this.socket.on("connect_error", (err) => this.handleErrors(err));
      this.socket.on("connect_failed", (err) => this.handleErrors(err));
      this.socket.emit(ACTIONS.JOIN, {
        roomId: this.roomId,
        userName: this.userName,
      });

      // Listening for the Joined event
      this.socket.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
        // console.log("Hi");
        if (userName !== this.userName) {
          Vue.$toast.open({
            message: `${userName} joined the room.`,
          });
          // console.log(`${userName} joined`);
          // console.log(clients);
          // console.log(socketId);
        }
        // console.log("New 3 = " + JSON.stringify(clients));
        this.clients = clients;
        this.socket.emit(ACTIONS.SYNC_CODE, {
          code: this.codeRef,
          socketId,
        });
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
    async copyRoomId() {
      try {
        await navigator.clipboard.writeText(this.roomId);
        Vue.$toast.open({
          message: `Room Id has been copied`,
        });
      } catch (error) {
        Vue.$toast.open({
          message: "Could not copy Room Id",
          type: "error",
        });
        console.log(error);
      }
    },
    leaveRoom() {
      this.socket.off(ACTIONS.JOINED);
      this.socket.off(ACTIONS.DISCONNECTED);
      this.socket.disconnect();
      this.$router.push({
        name: "Home",
      });
    },
    syncOnCodeChange(value) {
      this.codeRef = value;
    },
    async executeCode() {
      const payload = {
        language: this.language,
        code: this.codeRef,
      };
      console.log(axios)
      console.log("New 1 = " + JSON.stringify(payload))
      try {
        this.jobId = "";
        this.status = "";
        this.output = "";
        const { data } = await axios.post("http://localhost:5000/run", payload);
        console.log("New 7 = " + JSON.stringify(data));
        this.jobId = data.jobId;
        let intervalId;

        // Polling Implementation
        intervalId = setInterval(async () => {
          const { data: dataRes } = await axios.get(
            "http://localhost:5000/status",
            { params: { id: data.jobId } }
          );
          const { success, job, error } = dataRes;
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            this.status = jobStatus;
            if (this.status === "pending") {
              return;
            }
            this.output = jobOutput;
            clearInterval(intervalId);
          } else {
            console.log(error);
            this.status = "Error: Please retry!";
            clearInterval(intervalId);
            this.output = error;
          }
          console.log(dataRes);
        }, 1000);
      } catch ({ response }) {
        if (response) {
          const errMsg = response.data.err.stderr;
          this.output = errMsg;
          console.log(response);
        } else {
          Vue.$toast.open({
            message: "Error connecting to server",
            type: "error",
          });
        }
      }
      this.showOutput = true;
    },
    clearOutput() {
      this.output = "";
      this.showOutput = false;
    },
    renderMoreDetails() {
      this.showMoreDetails = !this.showMoreDetails;
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
    disconnect: function () {
      console.log("Socket Disconnected");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,400;0,700;1,100;1,500&display=swap");

* {
  font-family: "Poppins", sans-serif;
}
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

button {
  background-color: lightblue;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  min-width: 5rem;
  margin: 0.5rem;
}

button:hover {
  background-color: red;
  color: white;
  font-weight: bold;
}

select {
  height: 2rem;
}

/* .leave-button {
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
} */
</style>
