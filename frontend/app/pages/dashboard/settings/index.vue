<template>
  <div :class="{ 'modal-mask': !isMobile() }" style="z-index: 100">
    <div class="component">
      <nav>
        <span>Account settings</span>
        <div v-if="store.user" class="user">
          <img :src="useAvatar(store.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" >
          <div>
            <div class="username">{{ store.user.username }}</div>
            <div class="email">{{ store.user.email }}</div>
          </div>
        </div>
        <span>General</span>
        <NuxtLink to="?p=profile"><Icon fill="var(--font-color)" name="profil" />My profile</NuxtLink>
        <NuxtLink to="?p=preferences"><Icon fill="var(--font-color)" name="settings" />Preferences</NuxtLink>
        <NuxtLink to="?p=security"><Icon fill="var(--font-color)" name="security" />Security</NuxtLink>
        <NuxtLink to="?p=backup"><Icon fill="var(--font-color)" name="backup" />Backup</NuxtLink>
        <span>Workspaces</span>
        <NuxtLink to="/dashboard/categories"><Icon fill="var(--font-color)" name="categories" />Manage categories</NuxtLink>
        <NuxtLink to="/dashboard/docs"><Icon fill="var(--font-color)" name="draft" />Manage documents</NuxtLink>
        <NuxtLink to="/dashboard/import" style="display: flex; align-items: center"><Icon fill="var(--font-color)" name="import" />Manage importations <tag yellow>Beta</tag></NuxtLink>
        <span>Utils <tag blue>New</tag></span>
        <NuxtLink to="?p=shortcuts"><Icon fill="var(--font-color)" name="shortcuts" />Shortcuts</NuxtLink>
        <NuxtLink to="?p=snippets"><Icon fill="var(--font-color)" name="snippets" />Snippets</NuxtLink>
        <NuxtLink to="?p=markdown"><Icon fill="var(--font-color)" name="markdown" />Markdown</NuxtLink>

        <span>Other</span>
        <NuxtLink to="?p=about"><Icon fill="var(--font-color)" name="view" />About</NuxtLink>
        <NuxtLink @click="logoutUser"><Icon fill="var(--font-color)" name="logout" />Logout</NuxtLink>
      </nav>
      <div class="content">
        <button class="close-btn" @click="close"><Icon name="close" :big="true" /></button>
        <ProfileView v-if="currentPage === 'profile'"/>
        <PreferencesView v-else-if="currentPage === 'preferences'" />
        <SecurityView v-else-if="currentPage === 'security'" />
        <BackupView v-else-if="currentPage == 'backup'" />
        <ShortcutsView v-else-if="currentPage == 'shortcuts'" />
        <SnippetsView v-else-if="currentPage == 'snippets'" />
        <MarkdownView v-else-if="currentPage == 'markdown'" />
        <AboutView v-else-if="currentPage == 'about'" />
      </div>
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
const route = useRoute();
const currentPage = ref(route.query.p || 'profile');
const store = useUserStore();
const router = useRouter();

const routeBeforeEnter = ref();
onBeforeMount(() => (routeBeforeEnter.value = useRouter().options.history.state.back));
watchEffect(() => (currentPage.value = route.query.p || 'profile'));
const close = () => router.push(!routeBeforeEnter.value?.startsWith('/dashboard/settings') ? routeBeforeEnter.value : '/dashboard');
</script>

<style scoped lang="scss">
.component {
  display: flex;
  width: 1150px;
  max-width: calc(-100px + 100vw);
  height: calc(-100px + 100vh);
  max-height: 715px;
  margin: auto;
  border-radius: 8px;
  background-color: var(--bg-color);
  box-shadow: 0 2px 10px var(--shadow);

  nav {
    padding: 1rem;
    background-color: var(--bg-contrast);
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    gap: 1rem;

    span {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--font-color-light);
    }

    a {
      display: flex;
      margin: 0.5rem;
      border-radius: 4px;
      color: inherit;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      &:hover,
      &.active {
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
  margin: 0.5rem;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 0;
  background: none;
}

@media screen and (width <= 920px) {
  .component {
    display: block;
    width: 100%;
    max-width: 100%;
    height: 100%;
    box-shadow: none;
  }

  .close-btn {
    display: none;
  }
}
</style>
