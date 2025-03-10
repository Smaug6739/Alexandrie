<template>
  <div :class="{ 'modal-mask': isMobile() && isOpened }"></div>
  <Resizable>
    <div class="sidebar" :class="{ compact: preferences.get('compactMode') }">
      <section class="header">
        <span class="name">
          <IconApp />
          <NuxtLink style="font-size: 19px; font-weight: 600" to="/dashboard">Alexandrie</NuxtLink>
        </span>
        <IconClose class="btn" />
      </section>
      <input type="text" placeholder="Search or ctrl + q" class="search" v-model="filter" />

      <div class="user" v-if="userStore.user">
        <img :src="useAvatar(userStore.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" />
        <div class="details">
          <div>
            <div>{{ userStore.user.username }}</div>
            <div class="email">{{ userStore.user.email }}</div>
          </div>
          <div class="icons">
            <NuxtLink @click="onClick" to="/dashboard/docs/new"><Icon name="add_file" :mid="true" fill="var(--font-color-dark)" /></NuxtLink>
            <NuxtLink @click="onClick" to="/dashboard/categories/new"><Icon name="add_folder" :mid="true" fill="var(--font-color-dark)" /></NuxtLink>
            <NuxtLink @click="collapseAll"><Icon name="collapse" :mid="true" fill="var(--font-color-dark)" /></NuxtLink>
          </div>
        </div>
      </div>
      <SidebarWorkspaces :options="workspaces" />
      <Search />
      <CollapseItem v-for="item in items" :key="item.id" :item="item" :root="true" />
    </div>
  </Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import SidebarWorkspaces from './SidebarWorkspaces.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import Search from './Search.vue';
import { ItemsManager, type Item } from './tree_builder';
import { navigationItems } from './helpers';
import type { Category } from '~/stores';

const { isOpened, hasSidebar, workspaceId } = useSidebar();
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();
const preferences = usePreferencesStore();
const userStore = useUserStore();
const filter = ref<string>('');
const showSearchModal = ref<boolean>(false);
const workspaces = computed(() => [{ text: 'All workspaces', value: null }, ...categoriesStore.categories.filter(c => c.role === 2).map(c => ({ text: c.name, value: c.id }))]);

const handleSearchShortCut = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'q') showSearchModal.value = !showSearchModal.value;
};

if (import.meta.client && useUserStore().user?.role === 2) {
  if (navigationItems[navigationItems.length - 1]?.id !== 'manage-users')
    navigationItems.push({
      id: 'manage-users',
      type: 'default',
      title: 'Manage users',
      icon: 'users',
      route: '/dashboard/admin/users',
      childrens: [],
    });
}

const items = computed((): Item[] => {
  const navigation: Item[] = navigationItems.map(item => ({ id: item.id, parent_id: '', title: item.title, route: item.route, icon: item.icon, type: 'navigation', data: item, show: ref(true) }));
  const categories: Item[] = categoriesStore.categories
    .map((category: Category) => ({
      id: category.id,
      parent_id: category.parent_id || '',
      title: category.name,
      route: category.parent_id ? `/dashboard/categories/${category.id}` : '',
      icon: category.icon,
      data: category,
      show: localStorage.getItem(`collapse-${category.id}`) === 'false' ? ref(false) : ref(true),
    }))
    .filter(c => c.data.role === 1 && c.data.name.toLowerCase().includes(filter.value.toLowerCase()));
  const documents: Item[] = documentsStore.documents
    .map(document => ({
      id: document.id,
      parent_id: document.parent_id || document.category || '',
      title: document.name,
      route: `/dashboard/docs/${document.id}`,
      data: document,
      show: localStorage.getItem(`collapse-${document.id}`) === 'false' ? ref(false) : ref(true),
    }))
    .filter(c => c.data.name.toLowerCase().includes(filter.value.toLowerCase()));

  return new ItemsManager([...navigation, ...documents, ...categories]).generateTree().filter(c => {
    if (c.data.type === 'category' && workspaceId.value) return c.data.workspace_id == workspaceId.value;
    if (c.data.type === 'document' && workspaceId.value) return c.data.category === workspaceId.value;
    return true;
  });
});

const handleClickOutside = (e: MouseEvent) => {
  if (isOpened.value && e.target && !(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) isOpened.value = false;
};

const collapseAll = () => {
  items.value.forEach(item => {
    if (item.show.value) {
      localStorage.setItem(`collapse-${item.id}`, 'false');
      item.show.value = false;
    }
  });
};
const onClick = (m: MouseEvent) => {
  if (isMobile()) isOpened.value = false;
};

onMounted(() => {
  hasSidebar.value = true;
  if (isMobile()) return document.addEventListener('click', handleClickOutside);
  // ELSE: Desktop
  isOpened.value = true;
  document.addEventListener('keypress', handleSearchShortCut);
});
onBeforeUnmount(() => {
  hasSidebar.value = false;
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keypress', handleSearchShortCut);
});
</script>

<style scoped lang="scss">
.sidebar {
  padding: 0.5rem 0.7rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;

  .btn {
    fill: var(--font-color);
    width: 30px;
    cursor: pointer;
  }

  .name {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 400;
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
      fill: var(--font-color);
      width: 20px;
      height: 20px;
      margin: 0;
    }
  }
}
.search {
  height: 30px;
  margin: 2.5px 0;
  border-radius: 8px;
  width: 98%;
  outline: none;
  border: none;
  background-color: var(--bg-contrast);
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%232573cf" height="24" viewBox="0 -960 960 960" width="22"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>');
  background-repeat: no-repeat;
  background-position: 5px;
  padding-left: 30px;
}
.user {
  display: flex;
  align-items: center;
  margin: 4px 0 0 5px;
  .details {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.85rem;
    margin-left: 5px;
    .email {
      font-size: 0.7rem;
      color: var(--font-color-light);
    }
  }
}
.compact:deep(.item) {
  font-size: 15px;
  padding: 0 2.5px;
  margin: 0;
}
</style>
