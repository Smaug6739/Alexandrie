<template>
  <header>
    <nav>
      <span>
        <Icon v-if="hasSidebar" name="bx-menu" class="open-sidebar" @click="isOpened = !isOpened" :big="true" />
      </span>
      <ul class="main-ul">
        <li>
          <NuxtLink class="a-classic no-mobile" to="/">Accueil</NuxtLink>
        </li>
        <li>
          <Dropdown title="Menu">
            <ul class="dropdown-item-parent">
              <li v-for="(category, index) of categoriesStore.getAll" :key="index">
                <NuxtLink class="a-classic dropdown-item" :to="`/docs/${category.path}`">{{ category.name }}</NuxtLink>
              </li>
            </ul>
          </Dropdown>
        </li>
        <li class="no-mobile">
          <NuxtLink class="a-classic" to="https://github.com/Smaug6739" target="_blank">Github</NuxtLink>
        </li>
        <li style="margin-right: 0px;">
          <Search />
        </li>
        <li style="margin-left: 0px; margin-right: 0px;">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  </header>

</template>

<style lang="scss" scoped>
nav {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
}

.dropdown-item-parent {
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 3px 0;

  li {
    padding: 0;
    margin: 0;
  }
}

.dropdown-item {
  display: block;
  padding: 4px;
  font-size: calc(100% - 1px);
}

.main-ul {
  display: flex;
  align-items: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-right: 10px;
}

// Mobile styles
@media screen and (max-width: 719px) {
  .no-mobile {
    display: none;
  }
}

// Desktop styles
@media screen and (min-width: 720px) {
  li {
    margin-right: 20px;
  }
}
</style>
<script lang="ts" setup>
import { useCategoriesStore } from "@/store";
import Dropdown from "@/components/Dropdown.vue";
import ThemeToggle from "./ThemeToggle.vue";
import Search from "./Search.vue";
import Icon from "../Icon.vue";

import { hasSidebar, isOpened } from "@/components/sidebar";

const categoriesStore = useCategoriesStore();
</script>
