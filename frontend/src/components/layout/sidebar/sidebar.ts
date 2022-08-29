import { defineComponent } from 'vue';
import { useArticlesStore, useCategoriesStore } from '../../../store';
const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();
export default defineComponent({
  name: 'SidebarMenu',
  props: {
    //! Menu settings
    isMenuOpen: {
      type: Boolean,
      default: true,
    },
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
      default: '280px',
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
  },
  data() {
    return {
      isOpened: false,
      searchInput: '',
    };
  },

  mounted() {
    this.isOpened = window.innerWidth > 768;
    window.document.body.style.paddingLeft = '78px';
  },
  beforeUnmount() {
    window.document.body.style.paddingLeft = '';
  },
  computed: {
    menuItems(): MenuItem[] {
      const items: MenuItem[] = [];
      const subject = this.$route.params.subject as string;
      const theme = categoriesStore.categories.find(c => c.path == subject);

      if (!theme) return items;

      for (const category of theme.categories) {
        items.push({
          name: category.name,
          icon: category.icon,
          childrens: articlesStore.articles
            .filter(a => a.sub_category == category.path)
            .map(a => ({ name: a.name, link: '/doc/' + theme.path + '/' + category.path + '/' + a.path })),
        });
      }
      // Handle search input
      if (this.searchInput) {
        const copy = items;
        copy.forEach(item => {
          item.childrens = item.childrens.filter(child => child.name.toLowerCase().includes(this.searchInput.toLowerCase()));
        });
        return copy.filter(item => item.childrens.length > 0);
      }
      return items;
    },
    themes() {
      return categoriesStore.categories;
    },
    close(): undefined {
      if (window.screen.width < 768) {
        this.isOpened = !this.isOpened;
      }
      return;
    },
  },
  watch: {
    isOpened() {},
  },
});

interface MenuItem {
  name: string;
  icon: string;
  childrens: Children[];
}
interface Children {
  name: string;
  link: string;
}
