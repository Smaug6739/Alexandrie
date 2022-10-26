<template>
  <header>
    <nav>
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
        <li class="connect">
          <NuxtLink class="a-classic" to="/admin" :no-prefetch="true">Connexion</NuxtLink>
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
  margin-top: 5px;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.95rem;
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
  .connect {
    display: none;
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
