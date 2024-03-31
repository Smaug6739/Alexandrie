<template>
  <aside class="sidebar" :class="isOpened ? 'open' : ''">
    <section class="header">
      <NuxtLink to="/" class="name" @click="isOpened = false">
        <Icon
          svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M600-40q-33 0-56.5-23.5T520-120q0-23 11-41t29-29v-221q-18-11-29-28.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 23-11 40.5T640-411v115l160-53v-62q-18-11-29-28.5T760-480q0-33 23.5-56.5T840-560q33 0 56.5 23.5T920-480q0 23-11 40.5T880-411v119l-240 80v22q18 11 29 29t11 41q0 33-23.5 56.5T600-40ZM160-160v-560 560Zm0 0q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480h280v80H160Z"/></svg>' />
        Alexandrie
      </NuxtLink>
      <Icon
        svg='<svg class="btn" @click="isOpened = !isOpened" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd"d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z" /></svg>'
        id="btn" @click="isOpened = !isOpened" />
    </section>

    <section class="body">
      <SidebarSearch :isOpened="isOpened" :isSearch="true" searchPlaceholder="Search..."
        @search="(val: string) => searchInput = val" @open="isOpened = true" />
      <SidebarGroup v-for="(menuItem, index) of menuItems" :key="index" :menuItem="menuItem" :isOpened="isOpened"
        @closeMobile="isMobile() ? isOpened = false : null" />
    </section>
  </aside>
</template>

<script setup lang="ts">
import SidebarGroup from './SidebarGroup.vue';
import SidebarSearch from './SidebarSearch.vue';
import Icon from "@/components/Icon.vue";

import { hasSidebar, isOpened } from "./helpers"
import { useDocumentsStore, useCategoriesStore } from '@/store';

import type { MenuItem } from './types'

const route = useRoute();
const documentsStore = useDocumentsStore();
const categoriesStore = useCategoriesStore();

const searchInput = ref('');

const isMobile = () => process.client ? window.innerWidth <= 768 : false;

// Handle click outside
const handleClickOutside = (e: MouseEvent) => {
  if (isOpened.value && e.target && (!(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) && isMobile()) isOpened.value = false;
};

onMounted(() => {
  hasSidebar.value = true;
  if (!process.client) return;
  isMobile() ? isOpened.value = false : isOpened.value = true;
  window.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  hasSidebar.value = false;
  if (!process.client) return;
  window.removeEventListener('click', handleClickOutside);
});


// Watch isOpened
watch(isOpened, (val: boolean) => {
  if (process.client && val && isMobile()) document.getElementById('backdrop')?.classList.add('backdrop');
  if (process.client && !val && isMobile()) document.getElementById('backdrop')?.classList.remove('backdrop');
});

const menuItems = computed((): MenuItem[] => {
  const items: MenuItem[] = [];
  const category = categoriesStore.getById(route.params.category as string);
  if (!category) return items;
  const subCategories = categoriesStore.getChilds(category?.parent_id || category?.id)
  if (!subCategories) return items;
  for (const category of subCategories) {
    items.push({
      id: category.id,
      name: category.name,
      icon: category.icon,
      childrens: documentsStore.getByCategories(category.id).map(doc => ({
        id: doc.id,
        name: doc.name,
        link: `/docs/${category.parent_id}/${doc.id}`,
      }))
    });
  }
  // Handle search input
  if (searchInput.value) {
    const copy = items;
    copy.forEach(item => {
      item.childrens = item.childrens.filter(child => child.name.toLowerCase().includes(searchInput.value.toLowerCase()));
    });
    return copy.filter(item => item.childrens.length > 0);
  }
  return items;
})

</script>
<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0; // comment to fix sidebar with content
  top: 0;
  min-height: min-content;
  z-index: 100;
  transition: all $transition-duration ease;
  background: var(--bg-color);
  height: 100%;
  width: 300px;
  // No visible with transition
  transform: translateX(-300px);
  background-color: var(--bg-contrast);

  &.open {
    transform: translateX(0);
  }
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 14px 0 14px;

  #btn {
    display: block;
    text-align: right;
    font-size: 27px;
    cursor: pointer;
    transition: all $transition-duration ease;
  }

  .name {
    font-size: 19px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}

ul {
  margin: 10px 0;
}

.body {
  overflow-y: auto;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 60px);
  margin: 0 7px;

  &::-webkit-scrollbar {
    width: 5px;
  }
}

@media screen and (min-width: 768px) {
  #btn {
    display: none !important;
  }
}

@media print {
  .sidebar {
    display: none !important;
  }
}
</style>
