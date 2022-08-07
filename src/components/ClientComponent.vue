<template>
  <div class="client">
    <avatar v-bind:username="userName" :size="60"></avatar>
    <span class="user-name">{{ userName }}</span>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  name: "ClientComponent",
  components: {
    Avatar,
  },
  props: {
    userName: String,
  },
  methods: {
    async init() {
      console.log("New 4 = " + this.userName);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.client {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.user-name {
  margin-top: 0.5rem;
}
</style>
