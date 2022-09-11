<template>
  <header class="header">
    <nav>
      <p class="title" style="margin: 6px 14px 0 14px">
        Scientia
      </p>

      <ul class="main-ul">
        <li>
          <NuxtLink class="a-classic" to="/">Accueil</NuxtLink>
        </li>


        <li>
          <Dropdown title="Themes">
            <ul>
              <li v-for="(category, index) of categories" :key="index" class="destination">
                <NuxtLink class="a-classic" :to="`/docs/${category.path}`">{{ category.name }}</NuxtLink>
              </li>
            </ul>
          </Dropdown>
        </li>
        <li>
          <NuxtLink class="a-classic" to="/login">Connexion</NuxtLink>
        </li>
        <li class="icon">
          <i @click="toggleTheme" class='bx bx-moon' ref="themeIcon"></i>
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
    display: flex;
    align-items: center;
    height: 60px;
    min-width: 50px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
}

.main-ul {
  height: 40px;
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

.icon {
  cursor: pointer;
  opacity: 0.5;
  font-size: 1.5rem;

  &:hover {
    opacity: 1;
    color: $primary-400
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
<script lang="ts">
import { defineComponent } from "vue";
import { useCategoriesStore } from "../../../store";
import type { Theme } from "../../../store";
import Dropdown from "~/components/common/Dropdown.vue";
export default defineComponent({
  name: "Navbar",
  data() {
    return {
      categories: [] as Theme[]
    }
  },
  components: { Dropdown },
  methods: {
    toggleTheme() {
      const themeIcon = this.$refs.themeIcon as HTMLElement;
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.className = "bx bx-sun";
      } else if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.className = "bx bx-moon";
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.className = "bx bx-sun";
      }
    },
  },
  async beforeMount() {
    const store = useCategoriesStore();
    this.categories = await store.getAll()
  }
});
</script>
