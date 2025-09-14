<template>
  <div style="display: flex; align-items: center; justify-content: space-between">
    <span style="display: flex; align-items: center">
      <Icon :name="option.meta?.icon || 'workspace'" size="22" :class="getAppColor(option.meta?.color) + ' icon'" fill="var(--font-color)" />
      &nbsp; {{ option.text }}
    </span>
    <span>
      <Icon v-if="option.meta?.shared" name="users" fill="var(--font-color)" />
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
