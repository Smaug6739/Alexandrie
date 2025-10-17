<template>
  <div :class="{ 'sidebar-mask': isMobile() && isOpened }" />
  <Resizable>
    <Dock v-if="!isMobile() && preferences.get('view_dock').value" />
    <div class="sidebar" :class="{ compact: preferences.get('compactMode').value }">
      <section class="header">
        <span class="name">
          <IconApp />
          <NuxtLink style="font-family: Arial; font-size: 19px; font-weight: 600" to="/dashboard">Alexandrie</NuxtLink>
        </span>
        <IconClose class="btn" />
      </section>
      <input v-model="filter" type="text" placeholder="Search or ctrl + q" />

      <div v-if="userStore.user" class="user">
        <img :src="useAvatar(userStore.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" />
        <div class="details">
          <NuxtLink to="/dashboard/settings?p=profile">
            <div>{{ userStore.user.username }}</div>
            <div class="email">{{ userStore.user.email }}</div>
          </NuxtLink>
          <div class="icons">
            <NuxtLink to="/dashboard/docs/new" class="nav-item" :prefetch="false" @click="onClick">
              <Icon name="add_file" :mid="true" fill="var(--font-color)" />
              <p class="hint-tooltip">New doc</p>
            </NuxtLink>
            <NuxtLink class="nav-item" @click="newCategory"
              ><Icon name="add_folder" :mid="true" fill="var(--font-color)" />
              <p class="hint-tooltip">New category</p></NuxtLink
            >
            <NuxtLink class="nav-item" @click="sidebarTree.collapseAll"
              ><Icon name="collapse" :mid="true" fill="var(--font-color)" />
              <p class="hint-tooltip">Close all</p></NuxtLink
            >
            <NuxtLink class="nav-item" @click="toggleDock"
              ><Icon name="dock" :mid="true" fill="var(--font-color)" />
              <p class="hint-tooltip">Toggle dock</p></NuxtLink
            >
          </div>
        </div>
      </div>
      <SidebarWorkspaces :options="workspaces" />
      <CollapseItem v-for="item in navigationItems" :key="item.id" :item="item" :root="true" />
      <hr style="width: 100%; margin: 5px 0" />

      <template v-if="tree.length">
        <CollapseItem v-for="item in tree" :key="item.id" :item="item" :root="true" />
      </template>
      <template v-else>
        <SidebarSkeleton :is-loading="isLoading" />
      </template>
    </div>
  </Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import SidebarWorkspaces from './SidebarWorkspaces.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import SidebarSkeleton from './SidebarSkeleton.vue';
import { navigationItems } from './helpers';
import NewCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';
import Dock from './Dock.vue';

const { isOpened, hasSidebar, filtered } = useSidebar();
const nodesStore = useNodesStore();
const preferences = usePreferences();
const userStore = useUserStore();
const filter = ref<string>('');
const workspaces = computed(() => [...nodesStore.getAll.filter(c => c.role === 1).map(c => ({ text: c.name, value: c.id, meta: c }))]);
const isLoading = computed(() => nodesStore.isFetching);

const sidebarTree = useSidebarTree();
const toggleDock = () => preferences.set('view_dock', !preferences.get('view_dock').value);
const filterItems = (items: Item[]): Item[] => {
  if (!filter.value.trim()) return items;
  return filterRecursive(items, filter);
};

const tree = computed(() => filterItems(filtered.value));

const handleClickOutside = (e: MouseEvent) => {
  if (isOpened.value && e.target && !(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) isOpened.value = false;
};
const newCategory = () => {
  onClick();
  useModal().add(new Modal(shallowRef(NewCategoryModal), { props: { role: 2 } }));
};
const onClick = () => {
  if (isMobile()) isOpened.value = false;
};

onMounted(() => {
  hasSidebar.value = true;
  if (isMobile()) return document.addEventListener('click', handleClickOutside);
  // ELSE: Desktop
  isOpened.value = true;
});
onBeforeUnmount(() => {
  hasSidebar.value = false;
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.sidebar {
  width: 100%;
  max-height: 100%;
  padding: 0.5rem 0.2rem 0.5rem 0.5rem;
  background: var(--bg-color);
  overflow-y: auto;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
}

.header {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;

  .btn {
    width: 30px;
    cursor: pointer;
    fill: var(--font-color);
  }

  .name {
    display: flex;
    font-size: 1rem;
    font-weight: 400;
    align-items: center;
  }
}

.nav-item:hover .hint-tooltip {
  display: block;
}

.icons {
  position: relative;
  display: flex;
  height: fit-content;

  a {
    padding: 2px;
    border-radius: 25%;

    &:hover {
      background: var(--selection-color);
    }

    svg {
      width: 20px;
      height: 20px;
      margin: 0;
      fill: var(--font-color);
    }
  }
}

input {
  height: 30px;
  margin: 3px 0;
  border: none;
  background-color: var(--bg-contrast);
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%235b5967" height="24" viewBox="0 -960 960 960" width="22"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>');
  background-position: 5px;
  transition: background-color $transition-duration;
  background-repeat: no-repeat;
  outline: none;
  padding-left: 30px;
}

.user {
  display: flex;
  margin: 4px 0 0 5px;
  align-items: center;

  .details {
    display: flex;
    width: 100%;
    font-size: 0.85rem;
    justify-content: space-between;
    margin-left: 5px;

    .email {
      font-size: 0.7rem;
      color: var(--font-color-light);
    }
  }
}

.compact:deep(.item) {
  margin: 0;
  padding: 0.5px 8px;
  font-size: 14px;
}

.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 50%);
}
</style>
