<template>
  <div class="workspace-item">
    <span class="workspace-name">
      <Icon :name="option.meta?.icon || 'workspace'" size="22" :class="[getAppAccent(option.meta?.color), 'icon']" />
      {{ option.text }}
    </span>
    <span>
      <Icon v-if="option.meta?.shared" name="users" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from './helpers';

defineProps<{ option: Workspace }>();

const { getAppAccent } = useAppColors();
</script>

<style scoped lang="scss">
.workspace-item {
  display: flex;
  font-weight: 500;
  align-items: center;
  justify-content: space-between;
}

.workspace-name {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  padding: 1px;
  border-radius: 5px;
}
</style>
