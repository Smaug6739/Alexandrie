<template>
  <header>
    <nav>
      <span>
        <Icon v-if="hasSidebar" name="bx-menu" class="open-sidebar" @click="isOpened = !isOpened" :big="true" />
      </span>
      <ul class="main-ul">
        <li>
          <NuxtLink class="a-classic" to="/">Accueil</NuxtLink>
        </li>
        <li>
          <Dropdown title="Matières">
            <ul class="dropdown-item-parent">
              <li v-for="(category, index) of getAll" :key="index">
                <NuxtLink class="a-classic dropdown-item" :to="`/docs/${category.path}`">{{ category.name }}</NuxtLink>
              </li>
            </ul>
          </Dropdown>
        </li>
        <li class="external">
          <NuxtLink class="a-classic" to="https://github.com/Smaug6739" target="_blank">Github</NuxtLink>
        </li>
        <li>
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
  font-size: 14px;
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
  border-radius: 6px;
  font-size: 0.85rem;
}

.main-ul {
  display: flex;
  align-items: center;
}

ul {
  list-style: none;

  li {
    margin-left: 20px;
  }
}

@media screen and (max-width: 600px) {
  .external {
    display: none;
  }


}
</style>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from "@/store";
import Dropdown from "@/components/Dropdown.vue";
import ThemeToggle from "./ThemeToggle.vue";
import Icon from "../Icon.vue";

import { hasSidebar, isOpened } from "@/components/sidebar";

const categoriesStore = useCategoriesStore();
const { getAll } = storeToRefs(categoriesStore);
</script>
