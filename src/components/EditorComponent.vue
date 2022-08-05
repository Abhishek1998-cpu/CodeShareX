<template>
  <div>
    <h2>This is a Editor Component</h2>
    <h3>{{ this.userName }}</h3>
  </div>
</template>

<script>
export default {
  name: "EditorComponent",
  props: {
    userName: String,
  },
};
</script>

<style scoped></style>
