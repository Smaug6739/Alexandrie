<template>
  <div>
    <Icon :name="option.meta?.icon || 'workspace'" size="22" :class="option.meta?.color ? getAppColor(option.meta?.color) : '' + 'icon'" />
    &nbsp; {{ option.text }}
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from './helpers';
defineProps<{ option: Workspace }>();
</script>

<style scoped lang="scss">
div {
  display: flex;
  align-items: center;
  font-weight: 500;
}
.icon {
  padding: 1px;
  border-radius: 5px;
}
</style>
