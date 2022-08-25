import { defineComponent } from 'vue';
import { useCategoriesStore, useArticlesStore, Theme, Article } from '../../../store';
const CategoriesStore = useCategoriesStore();
const articlesStore = useArticlesStore();
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
      categories: [] as Theme[],
      articles: [] as Article[],
    };
  },
  async beforeMount() {
    const subject = this.$route.params.subject as string;
    this.categories = await CategoriesStore.getAll();
    this.articles = await articlesStore.getAll(this.categories.find(c => c.path == subject)?.path);
  },
  mounted() {
    this.isOpened = this.isMenuOpen;
    window.document.body.style.paddingLeft = '78px';
  },
  beforeUnmount() {},
  computed: {
    menuItems2(): MenuItem2[] {
      const items: MenuItem2[] = [];
      const subject = this.$route.params.subject as string;
      const theme = this.categories.find(c => c.path == subject);

      if (!theme) return items;

      for (const category of theme.categories) {
        items.push({
          name: category.name,
          icon: category.icon,
          childrens: this.articles
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

interface MenuItem2 {
  name: string;
  icon: string;
  childrens: Children[];
}
interface Children {
  name: string;
  link: string;
}
