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
          <ClientComponent v-bind:userName="client.userName" />
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
import ClientComponent from "./ClientComponent";
import EditorComponent from "./EditorComponent";
export default {
  name: "EditorPageComponent",
  props: {
    userName: String,
  },
  components: {
    ClientComponent,
    EditorComponent,
  },
  data() {
    return {
      clients: [
        { socketId: 1, userName: "Abhishek V" },
        { socketId: 2, userName: "Yash C" },
        { socketId: 2, userName: "Yash C" },
        { socketId: 2, userName: "Yash C" },
      ],
    };
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
