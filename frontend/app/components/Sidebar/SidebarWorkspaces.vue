<template>
  <div class="dropdown-container" @click.stop="toggleDropdown">
    <!-- stop propagation to avoid closing sidebar on mobile -->
    <div class="dropdown-selected" :class="{ open: isOpen }">
      <span v-if="selectedOption" class="selected"><SidebarWorkspace :option="selectedOption" /></span>
      <Icon name="expand" display="sm" />
    </div>
    <ul v-if="isOpen" class="dropdown-options">
      <li :class="{ selected: all_workspaces.value === workspaceId }" @click="selectOption(all_workspaces)">
        <SidebarWorkspace :option="all_workspaces" />
      </li>
      <li :class="{ selected: shared_workspaces.value === workspaceId }" @click="selectOption(shared_workspaces)">
        <SidebarWorkspace :option="shared_workspaces" />
      </li>
      <hr />
      <span class="workspaces-label">Workspaces</span>
      <li v-for="option in options" :key="option.meta?.id" :class="{ selected: option.value === workspaceId }" @click="selectOption(option)">
        <SidebarWorkspace :option="option" />
      </li>
      <div v-if="!options.length" class="placeholder">No workspaces found</div>
      <hr />
      <div class="new-workspace" @click="create_workspace"><Icon name="plus" fill="var(--text-secondary)" /> New Workspace</div>
      <NuxtLink :to="`/dashboard/categories/${selectedOption.value}/edit`" class="new-workspace"
        ><Icon name="settings" fill="var(--text-secondary)" /> Edit Workspace</NuxtLink
      >
    </ul>
  </div>
</template>
<script setup lang="ts">
import SidebarWorkspace from './SidebarWorkspace.vue';
import NewCategoryModal from '~/components/Node/Modals/CreateCategory.vue';

import type { Workspace } from './helpers';

const { workspaceId } = useSidebar();
const props = defineProps<{ options: Workspace[] }>();
const all_workspaces = ref({ text: 'All Workspaces', value: undefined, meta: { color: -1 } });
const shared_workspaces = ref({ text: 'Shared with me', value: 'shared', meta: { color: -1, icon: 'users' } });
watch(
  () => props.options,
  opts => {
    const storage_item = localStorage.getItem('filterWorkspace');
    if (storage_item && [...opts, shared_workspaces.value].find(option => option.value == storage_item)) {
      workspaceId.value = storage_item;
    }
  },
  { immediate: true }, // check also during mounting
);
const isOpen = ref(false);
const selectedOption = computed(() => [...props.options, shared_workspaces.value].find(option => option.value == workspaceId.value) || all_workspaces.value);
const toggleDropdown = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const selectOption = (option: Workspace) => {
  workspaceId.value = option.value;
  if (option.value) localStorage.setItem('filterWorkspace', option.value);
  else localStorage.removeItem('filterWorkspace');
};
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement)!.closest('.dropdown-container')) closeDropdown();
};
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
const create_workspace = (_: MouseEvent) => useModal().add(new Modal(shallowRef(NewCategoryModal), { props: { role: 1 } }));
</script>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
  width: calc(100% - 4px);
}

.dropdown-selected {
  display: flex;
  margin: 4px 0;
  padding: 4px 10px 4px 4px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-base);
  transition: all 0.2s ease;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: 0 4px 8px var(--shadow-sm);
  }

  svg {
    transition: transform 0.2s ease;
  }
}

.selected {
  flex: 1;
}

.placeholder {
  padding: 6px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
}

.dropdown-selected.open {
  border-color: var(--accent);
  box-shadow: 0 4px 16px var(--shadow-sm);

  svg {
    transform: rotate(180deg);
  }
}

.dropdown-options {
  position: absolute;
  z-index: 100;
  width: 100%;
  margin: 0;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-body);
  background-color: var(--surface-base);
  box-shadow:
    0 8px 24px var(--shadow-sm),
    0 2px 8px var(--shadow-sm);
  animation: slideDown 0.15s ease-out;
  list-style: none;
  overflow-y: auto;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

li {
  margin: 4px 0;
  padding: 2px 4px;
  border-radius: 6px;
  transition: all 0.15s ease;
  cursor: pointer;
}

li.selected {
  font-weight: 500;
  background: var(--accent-bg);
}

li:hover:not(.selected) {
  background-color: var(--surface-overlay);
}

li:active {
  transform: scale(0.98);
}

hr {
  margin: 6px 0;
  border: none;
  border-top: 1px solid var(--border-subtle);
}

.workspaces-label {
  display: block;
  margin: 4px 6px;
  font-size: small;
  font-weight: 600;
  color: var(--text-secondary);
}

.new-workspace {
  display: flex;
  margin: 2px 0;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.15s ease;
  align-items: center;
  cursor: pointer;
  gap: 6px;

  &:hover {
    color: var(--text-body);
    background-color: var(--surface-overlay);

    svg {
      fill: var(--accent) !important;
    }
  }
}
</style>
