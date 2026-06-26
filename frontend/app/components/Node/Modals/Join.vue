<template>
  <div class="modal">
    <div class="eyebrow">{{ t('nodes.modals.join.access') }}</div>
    <h1>{{ t('nodes.modals.join.title') }}</h1>
    <p class="subtitle">{{ t('nodes.modals.join.subtitle') }}</p>

    <form class="join-form" @submit.prevent="joinWorkspace">
      <label for="invite">{{ t('nodes.modals.join.label') }}</label>
      <input id="invite" v-model="inviteInput" type="text" autocomplete="off" :placeholder="t('nodes.modals.join.inputPlaceholder')" />
      <AppButton type="primary" :disabled="isJoining">{{ isJoining ? t('nodes.modals.join.joining') : t('nodes.modals.join.join') }}</AppButton>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { resolveNodeLink } from '~/helpers/node';

const props = defineProps<{ code?: string }>();
const emit = defineEmits(['close']);

const router = useRouter();
const nodesStore = useNodesStore();
const notifications = useNotifications();
const { t } = useI18nT();

const inviteInput = ref('');
const isJoining = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const joinWorkspace = async () => {
  const code = inviteInput.value.trim();
  if (!code) {
    errorMessage.value = 'Enter an invitation code or link.';
    return;
  }

  isJoining.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await nodesStore.joinInvitation(code);
    await nodesStore.init();
    successMessage.value = 'Joined successfully.';
    notifications.add({ type: 'success', title: 'Workspace joined' });
    await router.push(resolveNodeLink(result.node));
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    emit('close');
    isJoining.value = false;
  }
};

onMounted(() => {
  const code = props.code;
  if (!code) return;
  inviteInput.value = Array.isArray(code) ? code[0] || '' : String(code);
});
</script>

<style scoped lang="scss">
.eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.subtitle {
  margin: 0 0 1.5rem;
  color: var(--text-secondary);
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    font-weight: 600;
  }

  input {
    min-height: 48px;
    background: var(--surface-raised);
  }
}

.error-message {
  color: var(--red);
  margin-top: 1rem;
}

.success-message {
  color: var(--green);
  margin-top: 1rem;
}
</style>
