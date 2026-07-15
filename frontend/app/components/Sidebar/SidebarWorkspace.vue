<template>
  <div>
    <span class="workspace-name">
      <Icon :name="option.meta?.icon || 'workspace'" size="22" :class="[getAppAccent(option.meta?.color), 'icon']" />
      {{ option.text }}
    </span>
    <span>
      <Icon v-if="option.meta?.shared" name="users" />
      <Icon v-if="option.meta?.user_id === userStore.user?.id && option.meta?.role === 0" name="owner" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from './helpers';

defineProps<{ option: Workspace }>();
const userStore = useUserStore();

const { getAppAccent } = useAppColors();
</script>

<style scoped lang="scss">
div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
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
