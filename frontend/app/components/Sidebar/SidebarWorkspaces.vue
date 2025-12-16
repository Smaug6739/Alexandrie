<template>
  <div class="dropdown-container" @click.stop="toggleDropdown">
    <!-- stop propagation to avoid closing sidebar on mobile -->
    <div class="dropdown-selected" :class="{ open: isOpen }">
      <span v-if="selectedOption" style="flex: 1"><SidebarWorkspace :option="selectedOption" /></span>
      <Icon name="expand" display="sm" />
    </div>
    <ul v-if="isOpen" class="dropdown-options">
      <li :class="{ selected: all_workspaces.value === workspaceId }" @click="selectOption(all_workspaces)">
        <SidebarWorkspace :option="all_workspaces" />
      </li>
      <li :class="{ selected: shared_workspaces.value === workspaceId }" @click="selectOption(shared_workspaces)">
        <SidebarWorkspace :option="shared_workspaces" />
      </li>
      <hr style="margin: 2px 0" />
      <span style="margin: 4px 6px; font-size: small; font-weight: 600; color: var(--font-color-light)">Workspaces</span>
      <li v-for="option in options" :key="option.meta?.id" :class="{ selected: option.value === workspaceId }" @click="selectOption(option)">
        <SidebarWorkspace :option="option" />
      </li>
      <div v-if="!options.length" class="placeholder" style="padding: 6px; font-size: 0.9rem; font-style: italic">No workspaces found</div>
      <hr />
      <div class="new-workspace" @click="create_workspace"><Icon name="plus" fill="var(--font-color-light)" /> New Workspace</div>
      <NuxtLink :to="`/dashboard/categories/${selectedOption.value}/edit`" class="new-workspace"
        ><Icon name="settings" fill="var(--font-color-light)" /> Edit Workspace</NuxtLink
      >
    </ul>
  </div>
</template>
<script setup lang="ts">
import SidebarWorkspace from './SidebarWorkspace.vue';
import NewCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';

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
  padding: 2px 10px 2px 4px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
}

.placeholder {
  color: var(--font-color-light);
}

.dropdown-selected.open {
  border-color: var(--selection-color);
  box-shadow: 0 2px 10px var(--shadow);
}

.dropdown-options {
  position: absolute;
  z-index: 100;
  width: 98%;
  margin: 0;
  padding: 2px 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--font-color);
  background-color: var(--bg-color);
  list-style: none;
  overflow-y: auto;
}

li {
  margin: 1px 4px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}

li.selected,
li:hover {
  background-color: var(--selection-color);
}

.new-workspace {
  display: flex;
  margin: 4px;
  padding: 4px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  gap: 4px;

  &:hover {
    background-color: var(--selection-color);
  }
}
</style>
