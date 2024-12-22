<template>
  <div>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6 5C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H13V14C13 13.4477 13.4477 13 14 13H19V6C19 5.44772 18.5523 5 18 5H6ZM17.5858 15H15V17.5858L17.5858 15ZM3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V14C21 14.2652 20.8946 14.5196 20.7071 14.7071L14.7071 20.7071C14.5196 20.8946 14.2652 21 14 21H6C4.34315 21 3 19.6569 3 18V6Z"
          style="fill: var(--font-color)"
        ></path>
      </g>
    </svg>
    &nbsp; {{ option.text }}
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from './helpers';
defineProps<{
  option: Workspace;
}>();
</script>

<style scoped lang="scss">
div {
  display: flex;
  align-items: center;
}
</style>
