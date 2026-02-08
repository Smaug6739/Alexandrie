<template>
  <div class="tab-navigation">
    <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }" @click="handleClick(tab.id)">
      <Icon :name="tab.icon" class="tab-icon" />
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ 'change-tab': [tabId: string] }>();

const handleClick = (tabId: string) => emit('change-tab', tabId);
const { changeTab, activeTab } = useCommandCenter();

interface Tab {
  id: string;
  label: string;
  icon: string;
}

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

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.stopImmediatePropagation();
    e.preventDefault();
    changeTab(activeTab.value === 'quick' ? 'advanced' : 'quick');
  }
};

// Add global keydown listener for tab switching (priority capture to override other handlers)
onMounted(() => {
  window.addEventListener('keydown', handleKeydown, { capture: true });
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown, { capture: true });
});
</script>

<style scoped lang="scss">
.tab-navigation {
  display: flex;
  background: var(--surface-base);
  border-bottom: 1px solid var(--border);
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
