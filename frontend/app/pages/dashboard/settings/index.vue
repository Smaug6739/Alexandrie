<template>
  <div :class="['component', isModal ? 'modal' : '']">
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
      <span>General</span>
      <NuxtLink @click="setPage('profile')"><Icon name="profil" />My profile</NuxtLink>
      <NuxtLink @click="setPage('preferences')"><Icon name="settings" />Preferences</NuxtLink>
      <NuxtLink @click="setPage('security')"><Icon name="security" />Security</NuxtLink>
      <NuxtLink @click="setPage('backup')"><Icon name="backup" />Backup</NuxtLink>
      <span>Workspaces</span>
      <NuxtLink to="/dashboard/categories" @click="close"><Icon name="categories" />Manage categories</NuxtLink>
      <NuxtLink to="/dashboard/docs" @click="close"><Icon name="draft" />Manage documents</NuxtLink>
      <NuxtLink to="/dashboard/import" style="display: flex; align-items: center" @click="close"><Icon name="import" />Manage importations</NuxtLink>
      <span>Utils <tag blue>New</tag></span>
      <NuxtLink @click="setPage('shortcuts')"><Icon name="shortcuts" />Shortcuts</NuxtLink>
      <NuxtLink @click="setPage('snippets')"><Icon name="snippets" />Snippets</NuxtLink>
      <NuxtLink @click="setPage('markdown')"><Icon name="markdown" />Markdown</NuxtLink>
      <NuxtLink @click="setPage('advanced')"><Icon name="advanced" />Advanced</NuxtLink>

      <span>Other</span>
      <NuxtLink @click="setPage('about')"><Icon name="view" />About</NuxtLink>
      <NuxtLink @click="logout"><Icon name="logout" />Logout</NuxtLink>
    </nav>
    <div class="content">
      <ProfileView v-if="currentPage === 'profile'" />
      <PreferencesView v-else-if="currentPage === 'preferences'" />
      <SecurityView v-else-if="currentPage === 'security'" @close="close" />
      <BackupView v-else-if="currentPage == 'backup'" />
      <ShortcutsView v-else-if="currentPage == 'shortcuts'" />
      <SnippetsView v-else-if="currentPage == 'snippets'" />
      <MarkdownView v-else-if="currentPage == 'markdown'" />
      <AboutView v-else-if="currentPage == 'about'" />
      <AdvancedView v-else-if="currentPage == 'advanced'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileView from './_views/profile.vue';
import SecurityView from './_views/security.vue';
import PreferencesView from './_views/preferences.vue';
import BackupView from './_views/backups.vue';
import ShortcutsView from './_views/shortcuts.vue';
import SnippetsView from './_views/snippets.vue';
import MarkdownView from './_views/markdown.vue';
import AboutView from './_views/about.vue';
import AdvancedView from './_views/advanced.vue';

defineProps<{ isModal?: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const route = useRoute();
const router = useRouter();
const store = useUserStore();

const api = useApi();

const currentPage = ref(route.query.p || 'profile');
const menuOpen = ref(false);

const setPage = (p: string) => {
  router.push({ query: { ...route.query, p: '' } });
  currentPage.value = p;
  menuOpen.value = false;
};
watchEffect(() => {
  if (route.query.p && typeof route.query.p === 'string') currentPage.value = route.query.p;
});
const logout = () => {
  logoutUser();
  emit('close');
};
const close = () => emit('close');
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

      &:hover {
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
        max-height 0.25s ease,
        padding 0.25s ease;
      border-right: none;
      overflow: hidden;

      &.open {
        max-height: 70vh;
        padding: 1rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
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
