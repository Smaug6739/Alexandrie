<template>
  <aside>
    <div class="sidebar" :class="isOpened ? 'open' : ''">
      <div class="logo-details" style="margin: 6px 14px 0 14px">
        <img v-if="menuLogo" :src="menuLogo" alt="menu-logo" class="menu-logo icon" />
        <i v-else class="bx icon" :class="menuIcon" />
        <div class="logo_name">
          {{ menuTitle }}
        </div>
        <i class="bx" :class="isOpened ? 'bx-menu-alt-right' : 'bx-menu'" id="btn" @click="isOpened = !isOpened" />
      </div>

      <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
          max-height: calc(100% - 60px);
        ">

        <div id="my-scroll" style="margin: 6px 14px 0 14px">

          <ul class="nav-list" style="overflow: visible">
            <li class="li-style" v-if="isSearch" @click="isOpened = true">
              <i class="bx bx-search" />
              <input type="text" :placeholder="searchPlaceholder" v-model="searchInput" />
              <span class="tooltip">{{ searchTooltip }}</span>
            </li>

            <span v-for="(menuItem, index) of menuItems" :key="index">
              <li class="li-style">
                <span class="a-style">
                  <NuxtLink :to="`/docs/${route.params.theme}/${menuItem.path}`">
                    <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
                    <span class="links_name">{{ menuItem.name }}</span>
                  </NuxtLink>
                </span>
                <span class="tooltip">{{ menuItem.name }}</span>
                <ul v-if="isOpened">
                  <span v-for="(children, index) of menuItem.childrens" :key="index">
                    <li class="children" @click="close">
                      <NuxtLink :to="children.link" class="sub_link a-classic">
                        {{children.name}}
                      </NuxtLink>
                    </li>
                  </span>
                </ul>
              </li>
            </span>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'

import { useArticlesStore, useCategoriesStore } from '../../../store';

const route = useRoute();
const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();

articlesStore.fetchAll();

const { articles } = storeToRefs(articlesStore);
const { categories } = storeToRefs(categoriesStore);

defineProps({
  //! Menu settings
  menuTitle: {
    type: String,
    default: 'Docs',
  },
  menuLogo: {
    type: String,
    default: '',
  },
  menuIcon: {
    type: String,
    default: 'bxs-graduation',
  },
  isPaddingLeft: {
    type: Boolean,
    default: true,
  },
  menuOpenedPaddingLeftBody: {
    type: String,
    default: '300px',
  },
  menuClosedPaddingLeftBody: {
    type: String,
    default: '78px',
  },

  //! Search
  isSearch: {
    type: Boolean,
    default: true,
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
  searchTooltip: {
    type: String,
    default: 'Search',
  },
});

const isOpened = ref(false);
const searchInput = ref('');

onMounted(() => {
  if (process.client) window.document.body.style.paddingLeft = '78px';
  if (process.client) window.innerWidth > 768 ? isOpened.value = true : isOpened.value = false;
});
onBeforeUnmount(() => {
  if (process.client) window.document.body.style.paddingLeft = '0';
});


const menuItems = computed((): MenuItem[] => {
  const items: MenuItem[] = [];
  const subject = route.params.theme as string;
  const theme = categories.value.find(c => c.path == subject);

  if (!theme) return items;

  for (const category of theme.categories) {
    items.push({
      name: category.name,
      path: category.path,
      icon: category.icon,
      childrens: articles.value
        .filter(a => a.main_category == theme.path && a.sub_category == category.path)
        .map(a => ({ name: a.name, link: '/docs/' + theme.path + '/' + category.path + '/' + a.path })),
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

function close() {
  if (process.client && window.screen.width < 768) {
    isOpened.value = !isOpened.value;
  }
}

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  childrens: Children[];
}
interface Children {
  name: string;
  link: string;
}
</script>
<style lang="scss" scoped src="./sidebar.scss">

</style>
