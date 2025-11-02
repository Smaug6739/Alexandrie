<template>
  <div style="display: flex; align-items: center; justify-content: space-between">
    <span style="display: flex; align-items: center">
      <Icon :name="option.meta?.icon || 'workspace'" size="22" :class="getAppColor(option.meta?.color) + ' icon'" />
      &nbsp; {{ option.text }}
    </span>
    <span>
      <Icon v-if="option.meta?.shared" name="users" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from './helpers';
defineProps<{ option: Workspace }>();
</script>

<style scoped lang="scss">
div {
  display: flex;
  font-weight: 500;
  align-items: center;
}

.icon {
  padding: 1px;
  border-radius: 5px;
}
</style>
