<template>
  <div class="tab-navigation">
    <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }" @click="handleClick(tab.id)">
      <Icon :name="tab.icon" class="tab-icon" fill="var(--font-color)" />
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string;
  label: string;
  icon: string;
}

defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  'change-tab': [tabId: string];
}>();

const handleClick = (tabId: string) => {
  emit('change-tab', tabId);
};

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
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  display: flex;
  padding: 16px 20px;
  border: none;
  border-radius: 0;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  align-items: center;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  flex: 1;
  gap: 8px;
  justify-content: center;

  &.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
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
