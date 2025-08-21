<template>
  <div :class="{ 'sidebar-mask': isMobile() && isOpened }" />
  <Resizable>
    <Dock v-if="!isMobile() && preferences.get('view_dock')" />
    <div class="sidebar" :class="{ compact: preferences.get('compactMode') }">
      <section class="header">
        <span class="name">
          <IconApp />
          <NuxtLink style=" font-family: Arial;font-size: 19px; font-weight: 600" to="/dashboard">Alexandrie</NuxtLink>
        </span>
        <IconClose class="btn" />
      </section>
      <input v-model="filter" type="text" placeholder="Search or ctrl + q" />

      <div v-if="userStore.user" class="user">
        <img :src="useAvatar(userStore.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" />
        <div class="details">
          <div>
            <div>{{ userStore.user.username }}</div>
            <div class="email">{{ userStore.user.email }}</div>
          </div>
          <div class="icons">
            <NuxtLink to="/dashboard/docs/new" :prefetch="false" @click="onClick"><Icon name="add_file" :mid="true" fill="var(--font-color)" /></NuxtLink>
            <NuxtLink @click="newCategory"><Icon name="add_folder" :mid="true" fill="var(--font-color)" /></NuxtLink>
            <NuxtLink @click="sidebarTree.collapseAll"><Icon name="collapse" :mid="true" fill="var(--font-color)" /></NuxtLink>
            <NuxtLink @click="toggleDock"><Icon name="dock" :mid="true" fill="var(--font-color)" /></NuxtLink>
          </div>
        </div>
      </div>
      <SidebarWorkspaces :options="workspaces" />
      <CollapseItem v-for="item in navigationItems" :key="item.id" :item="item" :root="true" />
      <hr style=" width: 100%;margin: 5px 0" />
      <CollapseItem v-for="item in tree" :key="item.id" :item="item" :root="true" />
    </div>
  </Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import SidebarWorkspaces from './SidebarWorkspaces.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import { navigationItems } from './helpers';
import NewCategoryModal from '@/pages/dashboard/categories/_modals/CreateCategoryModal.vue';
import Dock from './Dock.vue';

const { isOpened, hasSidebar } = useSidebar();
const categoriesStore = useCategoriesStore();
const preferences = usePreferences();
const userStore = useUserStore();
const filter = ref<string>('');
const workspaces = computed(() => [...categoriesStore.categories.filter(c => c.role === 2).map(c => ({ text: c.name, value: c.id, meta: c }))]);

const sidebarTree = useSidebarTree();
const toggleDock = () => preferences.set('view_dock', !preferences.get('view_dock'));
const filterItems = (items: Item[]): Item[] => {
  if (!filter.value.trim()) return items;
  return filterRecursive(items, filter);
};

const tree = computed(() => filterItems(sidebarTree.filtered.value));

const handleClickOutside = (e: MouseEvent) => {
  if (isOpened.value && e.target && !(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) isOpened.value = false;
};
const newCategory = () => {
  onClick();
  useModal().add(new Modal(shallowRef(NewCategoryModal), { role: 1 }));
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
  padding: 0.5rem;
  background: var(--bg-color);
  transition: background-color $transition-duration;
  overflow-y: scroll;

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

.icons {
  display: flex;
  height: fit-content;

  a {
    padding: 2px;
    border-radius: 25%;
    align-self: center;

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
