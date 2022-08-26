<template>
  <header class="header">
    <nav>
      <p class="title" style="margin: 6px 14px 0 14px">
        Scientia
      </p>

      <ul>
        <li class="destination">
          <a href="#" class="nav-links">Home</a>
        </li>
        <li v-for="(category, index) of categories" :key="index">
          <router-link :to="'/doc/' + category.path">{{ category.name }}</router-link>
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
  background: var(--bg-color-1);
}

a {
  font-weight: 600;
}

nav {
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

    i {
      font-size: 28px;
      line-height: 60px;
    }
  }

}

ul {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: end;
  list-style: none;

}

li {
  padding-right: 15px;
  height: auto
}

.icon {
  cursor: pointer;
  opacity: 0.5;
  font-size: 1.5rem;
}

.icon:hover {
  opacity: 1;
  color: $pink
}

@media (max-width: 720px) {
  .destination {
    display: none;
  }

}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { useCategoriesStore } from "../../../store";
import type { Theme } from "../../../store";
export default defineComponent({
  name: "Navbar",
  data() {
    return {
      categories: [] as Theme[]
    }
  },
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
