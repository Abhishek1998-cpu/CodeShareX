<template>
  <div>
    <codemirror
      :value="content"
      :options="cmOptions"
      @ready="onCmReady"
      @focus="onCmFocus"
      @changes="onChange"
      style="text-align: left !important"
    >
    </codemirror>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

import { codemirror } from "vue-codemirror";
import ACTIONS from "../Actions";

export default {
  name: "EditorComponent",
  props: {
    socket: Object,
    roomId: String,
  },
  components: {
    codemirror,
  },
  data() {
    return {
      content: "console.log('Hello World')",
      cmOptions: {
        mode: {
          name: "javascript",
          json: true,
        },
        connect: "align",
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      },
    };
  },
  methods: {
    async init() {
      this.socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("It should be working", code);
        if (code !== null) {
          this.content = code;
          this.$emit("onCodeChange", code);
        }
      });
    },
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
      this.socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("It should be working", code);
        if (code !== null) {
          this.content = code;
        }
      });
    },
    onCmFocus(cm) {
      console.log("the editor is focus!", cm);
    },
    onChange(instance, changes) {
      console.log(instance);
      console.log(changes);
      const { origin } = changes[0];
      const code = instance.getValue();
      this.$emit("onCodeChange", code);
      if (origin !== "setValue") {
        console.log("Working", code);
        this.socket.emit(ACTIONS.CODE_CHANGE, {
          roomId: this.roomId,
          code,
        });
      }
      this.socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("It should be working", code);
        if (code !== null) {
          this.content = code;
        }
      });
      console.log("New 5 = " + code);
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.socket.off(ACTIONS.CODE_CHANGE);
  },
};
</script>

<style scoped>
.CodeMirror {
  font-size: 20px;
  line-height: 1.6;
  padding-top: 20px;
}
</style>
