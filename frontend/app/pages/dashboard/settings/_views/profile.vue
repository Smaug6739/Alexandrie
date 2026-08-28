<template>
  <div>
    <h2 class="page-title">{{ t('settings.profile.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.profile.subtitle') }}</p>
    <form v-if="userStore.user" @submit.prevent="updateUser">
      <div v-if="devMode" class="form-group">
        <label for="id">{{ t('common.labels.id') }}</label>
        <input id="id" v-model="userStore.user.id" type="text" disabled />
      </div>
      <div class="form-group">
        <label for="username">{{ t('settings.profile.username') }}</label>
        <input id="username" v-model="userStore.user.username" type="text" disabled required />
      </div>
      <div class="form-group">
        <label for="firstname">{{ t('settings.profile.firstname') }}</label>
        <input id="firstname" v-model="userStore.user.firstname" type="text" />
      </div>
      <div class="form-group">
        <label for="lastname">{{ t('settings.profile.lastname') }}</label>
        <input id="lastname" v-model="userStore.user.lastname" type="text" />
      </div>
      <div class="form-group">
        <label for="email">{{ t('settings.profile.email') }}</label>
        <input id="email" v-model="userStore.user.email" type="email" />
      </div>
      <div class="form-group">
        <label>{{ t('settings.profile.avatar') }}</label>
        <div class="avatar-wrapper">
          <img :src="avatarDisplayed" class="avatar" @click="selectAvatar" />
          <button v-if="avatarDisplayed !== avatarURL(null)" class="remove-avatar-btn" title="Remove" @click.prevent="removeAvatar">
            <Icon name="close" />
          </button>
        </div>
        <input ref="avatarInput" type="file" accept="image/*" style="display: none" @change="previewAvatar" />
      </div>
      <AppButton type="primary">{{ t('common.actions.update') }}</AppButton>
    </form>
    <hr style="margin: 10px 0" />
    <p>
      <strong>{{ t('settings.profile.accountCreation') }}:</strong> {{ shortDate(userStore.user?.created_timestamp) }}
    </p>
    <p>
      <strong>{{ t('settings.profile.lastUpdate') }}:</strong> {{ shortDate(userStore.user?.updated_timestamp) }}
    </p>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const resourcesStore = useResourcesStore();
const preferencesStore = usePreferencesStore();

const { avatarURL } = useApi();
const { shortDate } = useDateFormatters();
const { t } = useI18nT();

const avatarInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref('');
const avatarDisplayed = computed(() => {
  if (avatarPreview.value === 'removed') return avatarURL(null);
  return avatarPreview.value || avatarURL(userStore.user);
});
const devMode = preferencesStore.get('developerMode');

const selectAvatar = () => avatarInput.value?.click();

const removeAvatar = () => {
  avatarPreview.value = 'removed';
  if (avatarInput.value) {
    avatarInput.value.value = '';
  }
};

const uploadAvatar = async () => {
  if (!userStore.user) return;
  const file = avatarInput.value?.files?.[0];
  if (!file) return;
  const body = new FormData();
  body.append('file', file);
  await resourcesStore.postAvatar(body);
  userStore.user.avatar = Date.now().toString();
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
    if (avatarPreview.value === 'removed') {
      userStore.user.avatar = '';
    } else {
      await uploadAvatar();
    }
    await userStore.update(userStore.user);
    useNotifications().add({ type: 'success', title: t('settings.profile.notifications.updated') });
  } catch (e) {
    avatarPreview.value = '';
    useNotifications().add({ type: 'error', title: t('settings.profile.notifications.error'), message: e as string });
  }
};
</script>

<style scoped lang="scss">
.avatar-wrapper {
  position: relative;
  width: max-content;
}

.remove-avatar-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  color: var(--text-primary);
  background: var(--surface-raised);
  box-shadow: var(--shadow-sm);
  cursor: pointer;

  :deep(svg) {
    width: 14px;
    height: 14px;
    fill: currentcolor;
  }
}

.avatar {
  width: 100px;
  height: 100px;
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}
</style>
