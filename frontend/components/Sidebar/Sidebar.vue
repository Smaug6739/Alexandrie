<template>
  <div :class="{ 'sidebar-mask': isMobile() && isOpened }"></div>
  <Resizable>
    <Dock v-if="!isMobile() && isDockOpened" />
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
            <NuxtLink @click="newCategory"><Icon name="add_folder" :mid="true" fill="var(--font-color-dark)" /></NuxtLink>
            <NuxtLink @click="sidebarTree.collapseAll"><Icon name="collapse" :mid="true" fill="var(--font-color-dark)" /></NuxtLink>
          </div>
        </div>
      </div>
      <SidebarWorkspaces :options="workspaces" />
      <Search />
      <CollapseItem v-for="item in tree" :key="item.id" :item="item" :root="true" />
    </div>
  </Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import SidebarWorkspaces from './SidebarWorkspaces.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import Search from './Search.vue';
import { navigationItems } from './helpers';
import NewCategoryModal from '../../pages/dashboard/categories/_modals/CreateCategoryModal.vue';
import Dock from './Dock.vue';

const { isOpened, hasSidebar, isDockOpened } = useSidebar();
const categoriesStore = useCategoriesStore();
const preferences = usePreferencesStore();
const userStore = useUserStore();
const filter = ref<string>('');
const showSearchModal = ref<boolean>(false);
const workspaces = computed(() => [{ text: 'All workspaces', value: null }, ...categoriesStore.categories.filter(c => c.role === 2).map(c => ({ text: c.name, value: c.id }))]);

const handleSearchShortCut = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'q') showSearchModal.value = !showSearchModal.value;
};
const navigationItemsComputed = computed<Item[]>(() =>
  navigationItems.map(item => ({
    id: item.id,
    parent_id: '',
    label: item.label,
    route: item.route,
    icon: item.icon,
    type: 'navigation',
    data: item,
    show: ref(true),
  })),
);
const sidebarTree = useSidebarTree();

const filterItems = (items: Item[]): Item[] => {
  if (!filter.value.trim()) return items;
  const filterRecursive = (items: Item[]): Item[] => {
    return items
      .map(item => {
        const matches = item.label.toLowerCase().includes(filter.value.toLowerCase());
        const filteredChildren = item.childrens ? filterRecursive(item.childrens) : [];
        if (matches || filteredChildren.length > 0) {
          return { ...item, childrens: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as Item[];
  };
  return filterRecursive(items);
};

const tree = computed(() => filterItems([...navigationItemsComputed.value, ...sidebarTree.filtered.value]));

const handleClickOutside = (e: MouseEvent) => {
  if (isOpened.value && e.target && !(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) isOpened.value = false;
};
const newCategory = (m: MouseEvent) => {
  onClick();
  useModal().add(new Modal(shallowRef(NewCategoryModal), { role: 1 }));
};
const onClick = () => {
  if (isMobile()) isOpened.value = false;
};

onMounted(() => {
  hasSidebar.value = true;
  isDockOpened.value = preferences.get('hideDock');
  console.log(isDockOpened.value);
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
  max-height: 100%;
  overflow-y: scroll;
  width: 100%;
  font-family: Inter;
  * {
    font-family: Inter;
  }
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
  padding: 0 3px;
  margin: 0;
}

.sidebar-mask {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
}
</style>
