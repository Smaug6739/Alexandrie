<template>
  <aside class="sidebar" :class="{ open: isOpened }">
    <section class="header">
      <svg class="btn" @click="logout" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path
          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
      </svg>
      <p class="name">Alexandrie</p>
      <svg class="btn" @click="isOpened = !isOpened" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z" />
      </svg>
    </section>
    <section class="body">
      <Collapse v-for="(item) in items">
        <template v-slot:header>
          <NuxtLink class="item" @click="isMobile() ? isOpened = false : null">
            <i v-if="item.icon" v-html="item.icon" class="icon"></i> <strong>{{ item.title }}</strong>
          </NuxtLink>
        </template>
        <template v-slot:body>
          <NuxtLink v-for="(child) in item.childrens" :class="{ item: true, children: true, active: isActive(child.id) }"
            @click="isMobile() ? isOpened = false : null" :to="child.route">
            <i v-html="child.icon" class="icon"></i> <span>{{ child.title }}</span>
          </NuxtLink>
        </template>
      </Collapse>
    </section>
  </aside>
</template>

<script setup lang="ts" scoped>
import { useCategoriesStore, type Category, useNotifications } from '~/store';
import { isOpened, type Item, defaultItems, hasSidebar } from "./helpers";
import Collapse from './Collapse.vue';

const route = useRoute();
const isActive = (id: string) => route.query.category === id;
const isMobile = () => process.client ? window.innerWidth <= 768 : false;
const handleClickOutside = (e: MouseEvent) => {
  if (isOpened.value && e.target && (!(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) && isMobile()) isOpened.value = false;
};
const categoriesStore = useCategoriesStore();
const items = computed((): Item[] => [
  ...defaultItems,
  ...formatCategoriesToItems()
]);

function formatCategoriesToItems(): Item[] {
  const parents = categoriesStore.getParents;
  const childs = categoriesStore.getChilds;
  const items: Item[] = [];
  parents.forEach((parent) => {
    const childrens: Item[] = [];
    childs(parent.id).forEach((child) => {
      childrens.push({
        id: child.id,
        title: child.name,
        icon: child.icon,
        route: `/dashboard/?category=${child.id}`,
        childrens: []
      });
    });
    items.push({
      id: parent.id,
      title: parent.name,
      icon: parent.icon,
      childrens,
      route: ``
    });
  });
  return items;
}

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

function logout() {
  fetch(`${import.meta.env.VITE_BASE_API}/api/v1/auth/disconnection`, { credentials: "include" })
    .then(() => {
      const router = useRouter();
      useNotifications().add({ type: 'info', title: "Success", message: 'You are now disconnected', timeout: 5000 });
      router.push('/login');
    })
    .catch(() => {
      useNotifications().add({ type: 'error', title: "Error", message: 'An error occured', timeout: 5000 });
    });
}


</script>
<style lang="scss" scoped>
@import "./sidebar.scss";
</style>

