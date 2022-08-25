<template >
  <span class="container">
    <i class="katex-i" v-html="mathRender"></i> </span>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import katex from "katex";
export default defineComponent({
  name: "kt",
  components: {},
  props: {
    src: {
      type: String,
      required: false,
      default: "",
    },
    size: {
      type: String,
      default: "normal",
    },
  },
  computed: {
    mathRender(): string {
      let src = this.src
      if (this.$slots.default) {
        src = this.$slots.default()[0].children as string
      }
      return katex.renderToString(src, {
        throwOnError: false,
        displayMode: true,
        leqno: true,
        trust: true,
      });
    },
  },
});
</script>
<style lang="scss">
@import url("/katex/katex.css");

.normal {
  font-size: 14px;
}

.math-size {
  font-size: var(--math-size);
}

.katex-display,
.katex-display>.katex,
.katex-display>.katex>.katex-html {
  display: inline !important;
}

.katex-display {
  text-align: left !important;
}

.katex-display>.katex {
  text-align: left !important;
}


.container {
  display: inline-flex;
  vertical-align: baseline;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}

.katex-i {
  padding-right: 2px !important;
}
</style>