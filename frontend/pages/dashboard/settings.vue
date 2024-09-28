<template>
  <div :class="{ 'modal-mask': !isMobile() }">
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
        <NuxtLink to="?p=profile"><Icon fill="var(--font-color)" name="profil" />My profile</NuxtLink>
        <NuxtLink to="?p=preferences"><Icon fill="var(--font-color)" name="settings" />Preferences</NuxtLink>
        <NuxtLink to="?p=security"><Icon fill="var(--font-color)" name="security" />Security</NuxtLink>
        <NuxtLink to="?p=backup"><Icon fill="var(--font-color)" name="backup" />Backup</NuxtLink>
        <span>Workspaces</span>
        <NuxtLink to="/dashboard/categories"><Icon fill="var(--font-color)" name="categories" />Manage categories</NuxtLink>
        <NuxtLink to="/dashboard/docs"><Icon fill="var(--font-color)" name="draft" />Manage documents</NuxtLink>
        <span>Other</span>
        <NuxtLink @click="logoutUser"><Icon fill="var(--font-color)" name="logout" />Logout</NuxtLink>
      </nav>
      <div class="content">
        <button @click="close" class="close-btn"><Icon name="close" :big="true" /></button>
        <div v-show="currentPage === 'profile'" class="page profil_page">
          <h1>My Profile</h1>
          <form v-if="store.user" @submit.prevent="updateUser">
            <div class="form-group">
              <label for="username">Username</label>
              <input id="username" v-model="store.user.username" type="text" disabled required />
            </div>
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input id="firstname" v-model="store.user.firstname" type="text" />
            </div>
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input id="lastname" v-model="store.user.lastname" type="text" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="store.user.email" type="email" required />
            </div>
            <div class="form-group avatar-group">
              <label>Avatar</label>
              <img :src="avatarPreview || useAvatar(store.user)" class="avatar" @click="selectAvatar" />
              <input ref="avatarInput" type="file" accept="image/*" @change="previewAvatar" style="display: none" />
            </div>
            <AppButton type="primary">Update profile</AppButton>
          </form>
        </div>
        <div v-show="currentPage === 'preferences'" class="page preferences">
          <h1>Preferences</h1>
          <p>Preferences content goes here...</p>
        </div>
        <div v-show="currentPage === 'security'" class="page security_page">
          <h1>Security</h1>
          <h2>Last connection</h2>
          <div class="last_connection" v-if="store.last_connection">
            <div style="display: flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="569.4 86.3 83.6 48.2" width="100px">
                <path fill="var(--cl-chassis-back, black)" d="M577 89.8c0-1.4.2-2 .6-2.6.5-.5 1.2-.9 2.8-.9h61.7c1.4 0 2 .3 2.5.8s.7 1.2.7 2.7v41c0 1.4-.2 2-.5 2.4a2.7 2.7 0 0 1-2.2 1.1h-63c-.8 0-1.6-.3-2-1-.4-.4-.6-1-.6-2.5v-41Z"></path>
                <path fill="var(--cl-chassis-screen, #323232)" d="M578.4 132.9h65.5c.3 0 .6-.2.8-.4.2-.2.2-.5.2-1.4V89.8c0-1.2-.1-2-.6-2.4-.5-.5-1-.7-2.2-.7h-61.7c-1.3 0-2 .3-2.5.8-.4.4-.5 1-.5 2.3v41.3c0 .9 0 1.2.2 1.4.2.2.5.4.8.4Z"></path>
                <path fill-rule="evenodd" stroke="var(--cl-chassis-back1, 'gold')" stroke-width="0.3" d="M611.2 88.5a.3.3 0 1 0 0-.5.3.3 0 1 0 0 .5Z" clip-rule="evenodd"></path>
                <path fill="var(--cl-chassis-bottom, #191919)" fill-rule="evenodd" d="M569.4 133.3v-.5H653v.5s-1.9.6-4 .8c-1.4.1-3.7.4-8.9.4h-57.4c-4.5 0-8.3-.3-10-.5-1.7-.2-3.3-.7-3.3-.7Z" clip-rule="evenodd"></path>
                <path fill="var(--cl-screen, #111111)" fill-rule="evenodd" d="M579.7 89.5h63v39.4h-63V89.5Z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <p><strong>Last connection:</strong> {{ new Date(store.last_connection.timestamp).toLocaleString() }}</p>
                <p><strong>IP:</strong> {{ store.last_connection.ip_adress }} ({{ store.last_connection.location }})</p>
                <p><strong>Browser:</strong> {{ parseUserAgent(store.last_connection.user_agent).browser }}</p>
                <p><strong>OS:</strong> {{ parseUserAgent(store.last_connection.user_agent).os }}</p>
              </div>
            </div>
            <p>{{ store.last_connection.user_agent }}</p>
          </div>
          <p class="warning">If you don't recognize this connection, please change your password and click on "Log out from all devices".</p>
          <h2>Password</h2>
          <form @submit.prevent="changePassword">
            <div class="form-group">
              <label for="password">New password</label>
              <input id="password" type="password" required v-model="passwordValue" />
            </div>
            <div class="form-group">
              <span style="display: flex"><label for="password_confirm">Confirm password</label> <span v-if="errorMessages.passwordNotMatch" class="err"> Password do not match !</span></span>
              <input id="password_confirm" type="password" required v-model="passwordConfirmValue" />
            </div>
            <AppButton type="danger">Change password</AppButton>
          </form>
          <h2>Danger</h2>
          <AppButton type="danger" @click="logoutUser">Log out</AppButton>
          <AppButton type="danger" @click="logoutUserAll">Log out from all devices</AppButton>
        </div>
        <div v-show="currentPage == 'backup'" class="page backup_page">
          <h1>Create a Database Backup</h1>
          <p>Click the button below to create a backup of your database.</p>
          <AppButton @click="submitFile" type="primary">Create Backup</AppButton>
          <div v-if="isLoading" class="loading-spinner"></div>
          <div class="link-section" v-if="downloadLink">
            <p>Your backup is ready. You can copy the link to share it or download it.</p>
            <input type="text" v-model="downloadLink" readonly placeholder="Backup Link" />
            <div style="display: flex">
              <AppButton @click="copyLink" type="secondary">Copy Link</AppButton>
              <a :href="downloadLink" download><AppButton type="primary">Download Backup</AppButton></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const currentPage = ref(route.query.p || 'profile');
const store = useUserStore();
const ressourcesStore = useRessourcesStore();
const avatarInput = ref<HTMLInputElement | null>(null);
const passwordValue = ref('');
const passwordConfirmValue = ref('');
const router = useRouter();
const errorMessages = ref({
  passwordNotMatch: false,
});

watchEffect(() => (currentPage.value = route.query.p || 'profile'));

const close = () => router.push('/dashboard');
const avatarPreview = ref('');
const selectAvatar = () => avatarInput.value?.click();

const uploadAvatar = async () => {
  if (!store.user) return;
  const file = avatarInput.value?.files?.[0];
  if (!file) return;
  const body = new FormData();
  body.append('file', file);
  const r = await ressourcesStore.postAvatar(body);
  return r.transformed_path || r.original_path;
};
const previewAvatar = (event: Event) => {
  if (!store.user) return;
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => (avatarPreview.value = reader.result as string);
  reader.readAsDataURL(file);
};

const updateUser = async () => {
  if (!store.user) return;
  const newAvatar = await uploadAvatar();
  if (newAvatar) store.user.avatar = newAvatar;
  store
    .update(store.user)
    .then(() => useNotifications().add({ title: 'Success:', message: 'User updated', type: 'success', timeout: 3000 }))
    .catch(e => useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 3000 }));
};
const changePassword = async () => {
  if (!store.user) return;
  if (passwordValue.value !== passwordConfirmValue.value) return (errorMessages.value.passwordNotMatch = true);
  store.updatePassword(passwordValue.value);
};

const downloadLink = ref<string | null>(null);
const copyLink = () => navigator.clipboard.writeText(downloadLink.value!);
const isLoading = ref(false);

async function submitFile() {
  isLoading.value = true;
  const result = await makeRequest<{ url: string }>('backups', 'POST', {});
  isLoading.value = false;
  if (result.status != 'success') {
    return useNotifications().add({ type: 'error', title: 'Error', message: result.message, timeout: 3000 });
  }
  downloadLink.value = `${CDN}${result.result?.url || ''}`;
}
</script>

<style scoped lang="scss">
.component {
  display: flex;
  border-radius: 8px;
  height: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
.close-btn {
  position: absolute;
  right: 0px;
  top: 1rem;
  background: none;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .form-group {
    display: flex;
    flex-direction: column;
  }
}
.err {
  color: $red;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
}
.profil_page {
  .avatar-group {
    display: flex;
    gap: 1rem;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 1px solid var(--border-color);
  }
}

.security_page {
  .last_connection {
    align-items: center;
    padding: 0.3rem 0.5rem;
    border-radius: 15px;
    background-color: var(--bg-contrast-2);
  }
  p {
    margin: 0.5rem;
    font-size: 0.9rem;
  }

  .warning {
    color: $red;
    font-size: 0.9rem;
  }
}
.backup_page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .loading-spinner {
    border: 5px solid #f3f3f3;
    border-top: 5px solid $primary-400;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
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
