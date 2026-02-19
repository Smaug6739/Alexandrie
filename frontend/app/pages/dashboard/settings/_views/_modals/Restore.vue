<template>
  <div class="modal">
    <h3>{{ t('settings.snippets.action.restoreDefaults') }}</h3>
    <p>{{ t('settings.snippets.action.restoreDefaultsConfirm') }}</p>

    <p class="description">{{ t('common.confirm.irreversible') }}</p>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="danger" @click="reset">{{ t('common.actions.confirm') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const snippets = useSnippets();

const emit = defineEmits<{ close: [] }>();
const { t } = useI18nT();

const reset = async () => {
  snippets.restoreDefaults();
  emit('close');
};
</script>
