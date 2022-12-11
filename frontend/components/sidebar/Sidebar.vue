<template>
  <aside class="sidebar" :class="isOpened ? 'open' : ''">
    <section class="header">
      <b class="logo_name">
        <Icon name="bxs-graduation" :big="true" class="icon" />Orion docs
      </b>
      <Icon name="bx-menu-alt-right" id="btn" @click="isOpened = !isOpened" />
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

import { ref, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import SidebarGroup from './SidebarGroup.vue';
import SidebarSearch from './SidebarSearch.vue';
import Icon from "@/components/Icon.vue";

import { hasSidebar, isOpened } from "./index"
import { useArticlesStore, useCategoriesStore } from '@/store';

import type { MenuItem } from './types'

const route = useRoute();
const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();

const { articles } = storeToRefs(articlesStore);
const { categories } = storeToRefs(categoriesStore);

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
watch(isOpened, (val) => {
  if (process.client && val && isMobile()) document.getElementById('backdrop')?.classList.add('backdrop');
  if (process.client && !val && isMobile()) document.getElementById('backdrop')?.classList.remove('backdrop');
});

const menuItems = computed((): MenuItem[] => {
  const items: MenuItem[] = [];
  const subject = route.params.theme as string;
  const theme = categories.value.find(c => c.path == subject);

  if (!theme) return items;
  for (const category of theme.categories) {
    items.push({
      name: category.name,
      theme: route.params.theme as string,
      path: category.path,
      icon: category.icon,
      childrens: articles.value
        .filter(a => a.main_category == theme.path && a.sub_category == category.path)
        .map(a => ({ name: a.name, link: `/docs/${theme.path}/${category.path}/${a.path}` })),
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
  left: 0;
  top: 0;
  min-height: min-content;
  z-index: 100;
  transition: all 0.2s ease;
  background: var(--bg-color);
  height: 100%;
  width: 300px;
  // No visible with transition
  transform: translateX(-300px);

  &.open {
    transform: translateX(0);
  }

}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  margin: 6px 14px 0 14px;

  #btn {
    display: block;
    text-align: right;
    font-size: 27px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .logo_name {
    font-size: 18px;
    font-weight: 600;
    transition: all 0.2s ease;
  }
}

.body {
  overflow-y: auto;
  height: 100%; //calc(100% - 60px);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: calc(100% - 60px);
  margin: 6px 14px 6px 14px;

  &::-webkit-scrollbar {
    background-color: var(--contrast-color);
    width: 7px;
    border-radius: 5px
  }

  &::-webkit-scrollbar-button:vertical:start:decrement {
    display: none;
  }

  &::-webkit-scrollbar-button:vertical:end:increment {
    display: none;
  }

  .body::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb);
    border-radius: 5px
  }
}
</style>
