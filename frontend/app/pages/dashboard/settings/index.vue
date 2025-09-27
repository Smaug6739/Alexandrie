<template>
  <div :class="['component', isModal ? 'modal' : '']">
    <nav>
      <span v-if="isModal">Account settings</span>
      <div v-if="isModal && store.user" class="user">
        <img :src="useAvatar(store.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" />
        <div>
          <div class="username">{{ store.user.username }}</div>
          <div class="email">{{ store.user.email }}</div>
        </div>
      </div>
      <span>General</span>
      <NuxtLink @click="setPage('profile')"><Icon fill="var(--font-color)" name="profil" />My profile</NuxtLink>
      <NuxtLink @click="setPage('preferences')"><Icon fill="var(--font-color)" name="settings" />Preferences</NuxtLink>
      <NuxtLink @click="setPage('security')"><Icon fill="var(--font-color)" name="security" />Security</NuxtLink>
      <NuxtLink @click="setPage('backup')"><Icon fill="var(--font-color)" name="backup" />Backup</NuxtLink>
      <span>Workspaces</span>
      <NuxtLink to="/dashboard/categories"><Icon fill="var(--font-color)" name="categories" />Manage categories</NuxtLink>
      <NuxtLink to="/dashboard/docs"><Icon fill="var(--font-color)" name="draft" />Manage documents</NuxtLink>
      <NuxtLink to="/dashboard/import" style="display: flex; align-items: center"
        ><Icon fill="var(--font-color)" name="import" />Manage importations <tag yellow>Beta</tag></NuxtLink
      >
      <span>Utils <tag blue>New</tag></span>
      <NuxtLink @click="setPage('shortcuts')"><Icon fill="var(--font-color)" name="shortcuts" />Shortcuts</NuxtLink>
      <NuxtLink @click="setPage('snippets')"><Icon fill="var(--font-color)" name="snippets" />Snippets</NuxtLink>
      <NuxtLink @click="setPage('markdown')"><Icon fill="var(--font-color)" name="markdown" />Markdown</NuxtLink>
      <NuxtLink @click="setPage('advanced')"><Icon fill="var(--font-color)" name="advanced" />Advanced</NuxtLink>

      <span>Other</span>
      <NuxtLink @click="setPage('about')"><Icon fill="var(--font-color)" name="view" />About</NuxtLink>
      <NuxtLink @click="logoutUser"><Icon fill="var(--font-color)" name="logout" />Logout</NuxtLink>
    </nav>
    <div class="content">
      <ProfileView v-if="currentPage === 'profile'" />
      <PreferencesView v-else-if="currentPage === 'preferences'" />
      <SecurityView v-else-if="currentPage === 'security'" />
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

const route = useRoute();
const store = useUserStore();
defineProps<{ isModal?: boolean }>();
const currentPage = ref(route.query.p || 'profile');

const setPage = (p: string) => (currentPage.value = p);
watchEffect(() => {
  if (route.query.p && typeof route.query.p === 'string') currentPage.value = route.query.p;
});
</script>

<style scoped lang="scss">
.component {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);

  nav {
    padding: 1rem;
    gap: 1rem;
    overflow-y: auto;
    border-right: 1px solid var(--border-color);
    span {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--font-color-light);
    }

    a {
      display: flex;
      margin: 0.4rem 0.2rem;
      padding: 0.05rem 0.4rem;
      border-radius: 6px;
      color: inherit;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      &:hover {
        background-color: var(--bg-contrast-2);
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
          color: var(--font-color-light);
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

.modal {
  nav {
    border: none;
    background-color: var(--bg-contrast);
  }
  .content {
    margin: 0.5rem;
    padding: 1rem 2rem;
  }
}

@media screen and (width <= 920px) {
  .component {
    display: block;
    width: 100%;
    max-width: 100%;
    height: 100%;
    box-shadow: none;
  }
}
</style>
