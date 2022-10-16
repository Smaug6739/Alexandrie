<template>
  <header>
    <nav>
      <h5 class="title" style="margin: 6px 14px 0 14px">

      </h5>

      <ul class="main-ul">
        <li>
          <NuxtLink class="a-nav" to="/">Accueil</NuxtLink>
        </li>

        <li>
          <Dropdown title="Matières">
            <ul class="dropdown-item-parent">
              <li v-for="(category, index) of getAll" :key="index">
                <NuxtLink class="a-nav dropdown-item" :to="`/docs/${category.path}`">{{ category.name }}</NuxtLink>
              </li>
            </ul>
          </Dropdown>
        </li>
        <li class="connect">
          <NuxtLink class="a-nav" to="/admin" no-prefetch>Connexion</NuxtLink>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  </header>

</template>

<style lang="scss" scoped>
.a-nav {
  color: var(--opposite-color);
  transition: color .25s;

  &:hover {
    color: $primary-400;
  }
}


nav {
  margin-top: 5px;
  width: 100%;
  height: 60px;
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
  .title {
    display: none;
  }

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
