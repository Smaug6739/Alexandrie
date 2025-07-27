<template>
  <div :class="{ 'modal-mask': !isMobile() }" style="z-index: 100">
    <div class="component">
      <nav>
        <span>Account settings</span>
        <div class="user" v-if="store.user">
          <img :src="useAvatar(store.user)" alt="Avatar" style="width: 25px; height: 25px; border-radius: 50%" />
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
        <button @click="close" class="close-btn"><Icon name="close" :big="true" /></button>
        <ProfileView v-if="currentPage === 'profile'"></ProfileView>
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
  border-radius: 8px;
  height: 90%;
  box-shadow: 0 2px 10px var(--shadow);
  background-color: var(--bg-color);
  width: 1150px;
  height: calc(-100px + 100vh);
  max-width: calc(-100px + 100vw);
  max-height: 715px;
  margin: auto;
  nav {
    gap: 1rem;
    background-color: var(--bg-contrast);
    padding: 1rem;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;

    span {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--font-color-light);
    }

    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem;
      text-decoration: none;
      color: inherit;
      border-radius: 4px;

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
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin: 0.5rem;
}
.close-btn {
  position: absolute;
  right: 0px;
  top: 1rem;
  background: none;
}

@media screen and (max-width: 920px) {
  .component {
    width: 100%;
    max-width: 100%;
    height: 100%;
    display: block;
    box-shadow: none;
  }
  .close-btn {
    display: none;
  }
}
</style>
