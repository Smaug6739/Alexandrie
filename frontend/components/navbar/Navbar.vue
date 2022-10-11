<template>
  <header>
    <nav>
      <h5 class="title" style="margin: 6px 14px 0 14px">
        Scientia
      </h5>

      <ul class="main-ul">
        <li>
          <NuxtLink class="a-classic" to="/">Accueil</NuxtLink>
        </li>

        <li>
          <Dropdown title="Themes">
            <ul class="dropdown-item-parent">
              <li v-for="(category, index) of getAll" :key="index" class="dropdown-item">
                <NuxtLink class="a-classic" :to="`/docs/${category.path}`">{{ category.name }}</NuxtLink>
              </li>
            </ul>
          </Dropdown>
        </li>
        <li>
          <NuxtLink class="a-classic" to="/admin" no-prefetch>Connexion</NuxtLink>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  </header>

</template>

<style lang="scss" scoped>
header {
  width: 100%;
  background: var(--bg-color);
}

a {
  font-weight: 600;
}


nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 20px;
    font-weight: 600;
  }
}


.dropdown-item-parent {
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 3px 0;
}

.dropdown-item {
  display: block;
  padding: 5px;
  border-radius: 6px;
  list-style: none;
  margin: 0;

  &:hover {
    background: var(--contrast-color);
  }
}

.main-ul {
  display: flex;
  align-items: center;
}

ul {
  list-style: none;

  li {
    padding-right: 11px;
    padding-left: 11px;
    height: auto
  }
}

@media screen and (max-width: 600px) {
  .title {
    display: none !important;
  }

  nav {
    justify-content: flex-end;
  }
}
</style>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from "@/store";
import Dropdown from "@/components/Dropdown.vue";
import ThemeToggle from "./ThemeToggle.vue";


const categoriesStore = useCategoriesStore();

const { getAll } = storeToRefs(categoriesStore);
</script>
