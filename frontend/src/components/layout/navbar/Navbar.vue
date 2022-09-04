<template>
  <header class="header">
    <nav>
      <p class="title" style="margin: 6px 14px 0 14px">
        Scientia
      </p>

      <ul class="main-ul">
        <li>
          <router-link class="a-classic" to="/">Accueil</router-link>
        </li>

        <li class="dropdown">
          <a style="cursor:pointer;" class="dropbtn a-classic">Thèmes</a>
          <div class="dropdown-content">
            <ul>
              <li v-for="(category, index) of categories" :key="index" class="destination">
                <router-link class="a-classic" :to="'/doc/' + category.path">{{ category.name }}</router-link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a class="a-classic" href="https://github.com/Smaug6739/docs">Code</a>
        </li>
        <li class="icon">
          <i @click="toggleTheme" class='bx bx-moon' ref="themeIcon"></i>
        </li>
      </ul>
    </nav>
    <hr>
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
  display: flex;
  align-items: center;
}

ul {
  height: 40px;

  list-style: none;

  li {
    padding-right: 15px;
    height: auto
  }
}

.icon {
  cursor: pointer;
  opacity: 0.5;
  font-size: 1.5rem;

  &:hover {
    opacity: 1;
    color: $pink
  }
}

/* Dropdown Button */


/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;

  .dropbtn {
    padding: 16px;
    border: none;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: var(--bg-color-1);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;

    a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
  }

  &:hover .dropdown-content {
    display: block;
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
