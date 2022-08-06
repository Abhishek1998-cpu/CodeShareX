<template>
  <div>
    <!-- <h2>I am an Editor</h2> -->
    <textarea
      name=""
      id="realtimeEditor"
      v-model="content"
      cols="30"
      rows="10"
      class="textarea"
    ></textarea>
  </div>
</template>

<script>
import * as CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
export default {
  name: "EditorComponent",
  data() {
    return {
      content: "console.log('Sample Text')",
    };
  },
  methods: {
    async init() {
      CodeMirror.fromTextArea(document.getElementById("realtimeEditor"), {
        mode: {
          name: "javascript",
          json: true,
        },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.CodeMirror {
  min-height: calc(100vh - 20px);
  font-size: 20px;
  line-height: 1.6;
  padding-top: 20px;
}
.textarea {
  min-height: 100vh;
}
</style>
