<template>
  <div>
    <h2 class="ctitle">My Profile</h2>
    <p class="csubtitle">Manage your profile settings and preferences.</p>
    <form v-if="userStore.user" @submit.prevent="updateUser">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" v-model="userStore.user.username" type="text" disabled required />
      </div>
      <div class="form-group">
        <label for="firstname">First Name</label>
        <input id="firstname" v-model="userStore.user.firstname" type="text" />
      </div>
      <div class="form-group">
        <label for="lastname">Last Name</label>
        <input id="lastname" v-model="userStore.user.lastname" type="text" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="userStore.user.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Avatar</label>
        <img :src="avatarDisplayed" class="avatar" @click="selectAvatar" />
        <input ref="avatarInput" type="file" accept="image/*" style="display: none" @change="previewAvatar" />
      </div>
      <AppButton type="primary">Update profile</AppButton>
    </form>
    <hr style="margin: 10px 0" />
    <p><strong>Account creation:</strong> {{ shortDate(userStore.user?.created_timestamp) }}</p>
    <p><strong>Last update:</strong> {{ shortDate(userStore.user?.updated_timestamp) }}</p>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const ressourcesStore = useRessourcesStore();
const avatarInput = ref<HTMLInputElement | null>(null);
const selectAvatar = () => avatarInput.value?.click();

const avatarPreview = ref('');
const avatarDisplayed = computed(() => avatarPreview.value || useAvatar(userStore.user));

const uploadAvatar = async () => {
  if (!userStore.user) return;
  const file = avatarInput.value?.files?.[0];
  if (!file) return;
  const body = new FormData();
  body.append('file', file);
  const r = await ressourcesStore.postAvatar(body);
  return r.content_compiled || r.original_path;
};
const previewAvatar = (event: Event) => {
  if (!userStore.user) return;
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => (avatarPreview.value = reader.result as string);
  reader.readAsDataURL(file);
};

const updateUser = async () => {
  if (!userStore.user) return;
  try {
    await uploadAvatar();
    userStore.user.avatar = Date.now().toString();
    await userStore.update(userStore.user);
    useNotifications().add({ type: 'success', title: 'User updated' });
  } catch (e) {
    avatarPreview.value = '';
    useNotifications().add({ type: 'error', title: 'Error', message: e as string });
  }
};
</script>

<style scoped lang="scss">
.avatar {
  width: 100px;
  height: 100px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}
</style>
