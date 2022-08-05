<template>
  <div>
    <h3>Please provide the details and then click on Join button</h3>
    <div class="main-wrapper">
      <input
        type="text"
        class="inputField"
        v-model="roomId"
        placeholder="Enter Room Id"
      />
      <input
        type="text"
        class="inputField"
        v-model="userName"
        placeholder="Enter Username"
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
      const data = {
        roomId: this.roomId,
        userName: this.userName,
      };
      console.log(data);
      this.$router.push({ name: "Editor", params: { roomId: "123" } });
    },
    createNewRoom() {
      console.log("createNewRoom is called");
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
