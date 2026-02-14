<template>
  <div :class="['component', isModal ? 'modal' : '']" @keydown.stop>
    <button class="menu-toggle" @click="menuOpen = !menuOpen">
      <Icon :name="menuOpen ? 'close' : 'menu'" />
      {{ menuOpen ? 'Close menu' : 'Menu' }}
    </button>
    <nav :class="{ open: menuOpen }">
      <span v-if="isModal">Account settings</span>
      <div v-if="isModal && store.user" class="user">
        <img :src="api.avatarURL(store.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" />
        <div>
          <div class="username">{{ store.user.username }}</div>
          <div class="email">{{ store.user.email }}</div>
        </div>
      </div>
      <template v-for="section in navSections" :key="section.title">
        <span>{{ section.title }}</span>
        <template v-for="item in section.items" :key="item.label">
          <NuxtLink v-if="item.type === 'link'" :to="item.to" @click="close"> <Icon :name="item.icon" />{{ item.label }} </NuxtLink>
          <NuxtLink v-else-if="item.type === 'action'" @click="item.action?.()"> <Icon :name="item.icon" />{{ item.label }} </NuxtLink>
          <NuxtLink v-else :class="{ active: currentPage === item.key }" @click="setPage(item.key!)"> <Icon :name="item.icon" />{{ item.label }} </NuxtLink>
        </template>
      </template>
    </nav>
    <div class="content">
      <component :is="currentComponent" @close="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileView from './_views/profile.vue';
import ApparenceView from './_views/apparence.vue';
import DocumentsView from './_views/documents.vue';
import EditorView from './_views/editor.vue';
import SecurityView from './_views/security.vue';
import BackupView from './_views/backups.vue';
import ShortcutsView from './_views/shortcuts.vue';
import SnippetsView from './_views/snippets.vue';
import MarkdownView from './_views/markdown.vue';
import AboutView from './_views/about.vue';
import AdvancedView from './_views/advanced.vue';
import OtherView from './_views/other.vue';
import StylesView from './_views/styles.vue';

type PageKey = keyof typeof pages;

interface NavItem {
  type?: 'page' | 'link' | 'action';
  key?: PageKey;
  label: string;
  icon: string;
  to?: string;
  action?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const pages = {
  profile: ProfileView,
  apparence: ApparenceView,
  documents: DocumentsView,
  editor: EditorView,
  security: SecurityView,
  backup: BackupView,
  shortcuts: ShortcutsView,
  snippets: SnippetsView,
  markdown: MarkdownView,
  about: AboutView,
  advanced: AdvancedView,
  other: OtherView,
  styles: StylesView,
} as const;

defineProps<{ isModal?: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const route = useRoute();
const router = useRouter();
const store = useUserStore();
const api = useApi();

const currentPage = ref<PageKey>((route.query.p as PageKey) || 'profile');
const currentComponent = computed(() => pages[currentPage.value]);
const menuOpen = ref(false);

const close = () => emit('close');
const logout = () => {
  logoutUser();
  close();
};

const navSections: NavSection[] = [
  {
    title: 'General',
    items: [
      { key: 'profile', label: 'My profile', icon: 'profil' },
      { key: 'apparence', label: 'Apparence', icon: 'brush' },
      { key: 'security', label: 'Security', icon: 'security' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { key: 'documents', label: 'Documents settings', icon: 'bookmark-stack' },
      { key: 'editor', label: 'Editor settings', icon: 'editor' },
      { key: 'styles', label: 'Styles injection', icon: 'styles' },
      { key: 'other', label: 'Other', icon: 'advanced' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { key: 'snippets', label: 'Snippets', icon: 'snippets' },
      { key: 'backup', label: 'Backup', icon: 'backup' },
      { key: 'advanced', label: 'Advanced', icon: 'build' },
    ],
  },
  {
    title: 'Guides & Infos',
    items: [
      { key: 'shortcuts', label: 'Shortcuts', icon: 'shortcuts' },
      { key: 'markdown', label: 'Markdown', icon: 'markdown' },
    ],
  },
  {
    title: 'Other',
    items: [
      { key: 'about', label: 'About', icon: 'view' },
      { type: 'action', label: 'Logout', icon: 'logout', action: () => logout() },
    ],
  },
];

const setPage = (p: PageKey) => {
  router.push({ query: { ...route.query, p } });
  currentPage.value = p;
  menuOpen.value = false;
};

watchEffect(() => {
  const p = route.query.p;
  if (p && typeof p === 'string' && p in pages) currentPage.value = p as PageKey;
});
</script>

<style scoped lang="scss">
.component {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--surface-base);

  nav {
    width: 300px;
    padding: 1rem;
    border-right: 1px solid var(--border);
    gap: 1rem;
    overflow-y: auto;

    span {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    a {
      display: flex;
      margin: 0.4rem 0.2rem;
      padding: 0.05rem 0.4rem;
      border-radius: var(--radius-sm);
      color: inherit;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      &:hover,
      &.active {
        background-color: var(--surface-overlay);
      }
    }

    .user {
      display: flex;
      align-items: center;

      div {
        font-size: 0.8rem;
        margin-left: 5px;

        .email {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
      }
    }
  }
}

.content {
  position: relative;
  margin: 0 0.5rem;
  padding: 0 2rem;
  flex: 1;
  overflow-y: auto;
}

.menu-toggle {
  display: none;
}

.modal {
  nav {
    width: 270px;
    border: none;
    background-color: var(--surface-raised);
  }

  .content {
    margin: 0.5rem;
    padding: 1rem 2rem;
  }
}

@media screen and (width <= 920px) {
  .component {
    position: relative;
    flex-direction: column;

    .menu-toggle {
      display: flex;
      padding: 0.75rem 1rem;
      border: none;
      font-size: 0.9rem;
      color: inherit;
      background-color: var(--surface-raised);
      align-items: center;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      gap: 0.5rem;
    }

    nav {
      position: absolute;
      top: 45px;
      left: 0;
      z-index: 10;
      width: 100%;
      max-height: 0;
      padding: 0;
      background-color: var(--surface-base);
      transition:
        max-height $transition-base ease,
        padding $transition-base ease;
      border-right: none;
      overflow: hidden;

      &.open {
        max-height: 70vh;
        padding: 1rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border-bottom: 1px solid var(--border);
        overflow-y: auto;
      }
    }

    .content {
      margin: 0;
      padding: 1rem;
    }
  }

  .modal nav.open {
    background-color: var(--surface-raised);
  }
}
</style>
