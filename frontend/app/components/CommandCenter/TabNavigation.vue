<template>
  <div class="tab-navigation">
    <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }" @click="$emit('changeTab', tab.id)">
      <Icon :name="tab.icon" class="tab-icon" fill="var(--font-color)" />
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

defineProps<{
  activeTab: string;
}>();

defineEmits<{
  changeTab: [tabId: string];
}>();

const tabs: Tab[] = [
  {
    id: 'quick',
    label: 'Quick Search',
    icon: 'search',
  },
  {
    id: 'advanced',
    label: 'Advanced Search',
    icon: 'layers',
  },
];
</script>

<style scoped lang="scss">
.tab-navigation {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
}

.tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  flex: 1;
  border-radius: 0;

  &.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
    background: var(--bg-color-secondary);
  }
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.tab-label {
  white-space: nowrap;
}
</style>
