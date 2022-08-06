<template>
  <div>
    <h3>Please provide the details and then click on Join button</h3>
    <div class="main-wrapper">
      <input
        type="text"
        class="inputField"
        v-model="roomId"
        placeholder="Enter Room Id"
        v-on:keyup.enter="handleEnterPress"
      />
      <input
        type="text"
        class="inputField"
        v-model="userName"
        placeholder="Enter Username"
        v-on:keyup.enter="handleEnterPress"
      />
      <button v-on:click="onSubmit">Join</button>
    </div>
    <div>
      <h3>
        If you don't have an invite then create
        <a v-on:click="createNewRoom">New Room</a>
      </h3>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { v4 as uuidv4 } from "uuid";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

Vue.use(VueToast);

export default {
  name: "HomeComponent",
  props: {
    msg: String,
  },
  data() {
    return {
      roomId: "",
      userName: "",
    };
  },
  methods: {
    onSubmit() {
      if (!this.roomId || !this.userName) {
        Vue.$toast.open({
          message: "Please fill all the details before submitting",
          type: "error",
        });
      } else {
        const data = {
          roomId: this.roomId,
          userName: this.userName,
        };
        console.log(data);
        this.$router.push({
          name: "Editor",
          params: { roomId: this.roomId, userName: this.userName },
        });
      }
    },
    genNewUuid() {
      const id = uuidv4();
      return id;
    },
    createNewRoom() {
      console.log("createNewRoom is called");
      const id = this.genNewUuid();
      console.log(id);
      this.roomId = id;
      Vue.$toast.open("New room created!");
    },
    handleEnterPress: function () {
      this.onSubmit();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inputField {
  padding: 0.2rem;
  margin: 0.2rem;
  min-width: 25%;
}

button {
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid grey;
  min-width: 5rem;
  margin: 0.5rem;
  font-weight: bold;
}

button:hover {
  background-color: red;
  color: white;
  font-weight: bold;
}

a {
  cursor: pointer;
}

a:hover {
  color: red;
}
</style>
