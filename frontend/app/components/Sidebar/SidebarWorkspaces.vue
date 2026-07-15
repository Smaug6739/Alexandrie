<template>
  <div class="dropdown-container" @click.stop="toggleDropdown">
    <!-- stop propagation to avoid closing sidebar on mobile -->
    <div class="dropdown-selected" :class="{ open: isOpen }">
      <span v-if="selectedOption" class="selected"><SidebarWorkspace :option="selectedOption" /></span>
      <Icon name="expand" display="sm" />
    </div>
    <ul v-if="isOpen" class="dropdown-options">
      <li :class="{ selected: allWorkspaces.value === workspaceId }" @click="selectOption(allWorkspaces)">
        <SidebarWorkspace :option="allWorkspaces" />
      </li>
      <li :class="{ selected: sharedWorkspaces.value === workspaceId }" @click="selectOption(sharedWorkspaces)">
        <SidebarWorkspace :option="sharedWorkspaces" />
      </li>
      <hr />
      <span class="workspaces-label">{{ t('components.sidebar.workspaces') }}</span>
      <li v-for="option in workspaces" :key="option.meta?.id" :class="{ selected: option.value === workspaceId }" @click="selectOption(option)">
        <SidebarWorkspace :option="option" />
      </li>
      <div v-if="!workspaces.length" class="placeholder">{{ t('components.sidebar.noWorkspaces') }}</div>
      <hr />
      <span class="workspaces-label">Teams</span>
      <li
        v-for="option in flattenedWorkspaces"
        :key="option.meta?.id"
        :class="{ selected: option.value === workspaceId }"
        :style="{ paddingLeft: `${(option.depth ?? 0) * 16 + 4}px` }"
        @click="selectOption(option)"
      >
        <SidebarWorkspace :option="option" />
      </li>
      <div v-if="!teams.length" class="placeholder">No teams found</div>
      <hr />
      <div class="new-workspace" @click="createWorkspace"><Icon name="plus" fill="var(--text-secondary)" /> {{ t('components.sidebar.newWorkspace') }}</div>
      <div class="new-workspace" @click="joinWorkspace"><Icon name="link" fill="var(--text-secondary)" /> {{ t('components.sidebar.joinWorkspace') }}</div>
      <NuxtLink :to="`/dashboard/categories/${selectedOption.value}/edit`" class="new-workspace">
        <Icon name="settings" fill="var(--text-secondary)" /> {{ t('components.sidebar.editWorkspace') }}
      </NuxtLink>
    </ul>
  </div>
</template>
<script setup lang="ts">
import SidebarWorkspace from './SidebarWorkspace.vue';
import NewCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import JoinModal from '~/components/Node/Modals/Join.vue';
import localForage from 'localforage';
import type { Workspace } from './helpers';

const props = defineProps<{ workspaces: Workspace[]; teams: Workspace[] }>();

const { t } = useI18nT();
const { workspaceId } = useSidebar();
const modals = useModal();
const router = useRouter();

const isOpen = ref(false);

const allWorkspaces = computed(() => ({ text: t('components.sidebar.allWorkspaces'), value: undefined, meta: { color: -1 } }));
const sharedWorkspaces = computed(() => ({ text: t('components.sidebar.sharedWithMe'), value: 'shared', meta: { color: -1, icon: 'users' } }));
const selectedOption = computed(
  () => [...props.workspaces, ...flattenedWorkspaces.value, sharedWorkspaces.value].find(option => option.value == workspaceId.value) || allWorkspaces.value,
);
const flattenWorkspaces = (workspaces: Workspace[], depth = 0): Workspace[] => {
  return workspaces.flatMap(workspace => [{ ...workspace, depth }, ...(workspace.children ? flattenWorkspaces(workspace.children, depth + 1) : [])]);
};

const flattenedWorkspaces = computed(() => flattenWorkspaces(props.teams));
watch(
  () => props.workspaces,
  async opts => {
    const storage_item = await localForage.getItem<string>('filterWorkspace');
    if (storage_item && [...opts, ...flattenedWorkspaces.value, sharedWorkspaces.value].find(option => option.value == storage_item)) {
      workspaceId.value = storage_item;
    }
  },
  { immediate: true },
);

// Actions
const createWorkspace = () => modals.add(new Modal(shallowRef(NewCategoryModal), { props: { role: 1 } }));

const joinWorkspace = () => modals.add(new Modal(shallowRef(JoinModal)));

const toggleDropdown = () => (isOpen.value = !isOpen.value);

const closeDropdown = () => (isOpen.value = false);

const selectOption = (option: Workspace) => {
  workspaceId.value = option.value;
  if (option.meta?.role === 0) router.push('/dashboard/teams/' + option.value);
  if (option.value) localForage.setItem('filterWorkspace', option.value);
  else localForage.removeItem('filterWorkspace');
};
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement)!.closest('.dropdown-container')) closeDropdown();
};

// Lifecycle hooks
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
  width: calc(100% - 4px);
}

.dropdown-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
  padding: 4px 10px 4px 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  cursor: pointer;
  transition:
    border-color $transition-base ease,
    box-shadow $transition-base ease;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-sm);
  }

  svg {
    transition: transform $transition-base ease;
  }
}

.selected {
  flex: 1;
}

.placeholder {
  padding: 6px;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--text-secondary);
}

.dropdown-selected.open {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);

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
  border-radius: var(--radius-lg);
  color: var(--text-body);
  background-color: var(--surface-base);
  box-shadow: var(--shadow-lg);
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
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
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
  align-items: center;
  gap: 6px;
  margin: 2px 0;
  padding: 8px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--text-body);
    background-color: var(--surface-overlay);

    svg {
      fill: var(--accent) !important;
    }
  }
}
</style>
