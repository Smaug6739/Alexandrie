<template>
  <div class="container" @click="toggle" ref="element">
    <span class="collapsible">
      <i class='bx bxs-right-arrow'></i>Open Collapsible
    </span>
    <div class="content" ref="content">
      <hr />
      <p>Lorem ipsum...</p>
    </div>
  </div>

</template>
<style lang="scss" scoped>
.container {
  cursor: pointer;
  background-color: var(--contrast-color);
  width: 100%;
  padding: 18px;
  border-radius: 12px;

  i {
    transition: 0.2s;
    /* Transition duration */
  }


}

.active {
  i {
    transform: rotate(90deg);
  }
}

.collapsible {
  color: var(--font-color-dimmed);
  background-color: var(--contrast-color);
  width: 100%;
  text-align: left;
  outline: none;
  font-size: 15px;
  border: none;
}


/* Style the collapsible content. Note: hidden by default */
.content {
  margin: 2px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;

  hr {
    margin-top: 5px;
  }

  p {
    margin-top: 5px;
  }
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
export default defineComponent({
  name: "Collapse",
  methods: {
    toggle() {
      const element: HTMLElement = this.$refs.element as HTMLElement;
      element.classList.toggle("active");
      var content = this.$refs.content as HTMLElement;
      if (content.style.maxHeight) {
        content.style.maxHeight = "";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    },
  },
});
</script>
