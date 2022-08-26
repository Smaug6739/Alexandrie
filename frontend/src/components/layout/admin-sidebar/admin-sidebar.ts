import { defineComponent } from 'vue';
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

    menuItems: {
      type: Array<MenuItem>,
      default: (): MenuItem[] => [
        {
          link: '/admin',
          name: 'Dashboard',
          tooltip: 'Dashboard',
          icon: 'bx-home',
        },
        {
          link: '/admin/articles',
          name: 'Articles',
          tooltip: 'Articles',
          icon: 'bx-news',
        },
        {
          link: '/admin/categories',
          name: 'Categories',
          tooltip: 'Categories',
          icon: 'bx-category',
        },
        {
          link: '/admin/tags',
          name: 'Sub-categories',
          tooltip: 'Analytics',
          icon: 'bx-pie-chart-alt-2',
        },
        {
          link: '/admin/files',
          name: 'File Manager',
          tooltip: 'Files',
          icon: 'bx-folder',
        },
      ],
    },
  },
  data() {
    return {
      isOpened: false,
      searchInput: '',
    };
  },

  mounted() {
    this.isOpened = this.isMenuOpen;
  },
  beforeUnmount() {
    window.document.body.style.paddingLeft = '0px';
  },
  computed: {
    close(): undefined {
      if (window.screen.width < 768) {
        this.isOpened = !this.isOpened;
      }
      return;
    },
  },
  watch: {
    isOpened() {
      window.document.body.style.transition = 'all 0.3s ease';
      window.document.body.style.paddingLeft =
        this.isOpened && this.isPaddingLeft ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody;
    },
  },
});

interface MenuItem {
  name: string;
  icon: string;
  link: string;
  tooltip: string;
}
