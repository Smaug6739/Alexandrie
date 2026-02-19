<template>
  <div class="modal">
    <h2>{{ isEdit ? t('settings.snippets.action.titleEdit') : t('settings.snippets.action.titleNew') }}</h2>

    <label>
      <span>{{ t('settings.snippets.action.shortcut') }}</span>
      <input v-model="form.id" type="text" placeholder="!example" :class="{ error: formError }" @input="formError = ''" />
      <small v-if="formError" class="error-text">{{ formError }}</small>
      <small v-else class="hint">
        <i18n-t scope="global" keypath="settings.snippets.action.shortcutHint">
          <template #code><code>!</code></template>
        </i18n-t>
      </small>
    </label>

    <label> Content </label>
    <textarea v-model="form.label" rows="6" :placeholder="t('settings.snippets.action.contentPlaceholder')" />
    <div class="actions-row">
      <AppButton type="secondary" @click="$emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="primary" @click="save">{{ isEdit ? t('common.actions.save') : t('common.actions.create') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Snippet } from '~/composables/useSnippets';

const props = defineProps<{
  snippet?: Snippet;
  onSave: (snippet: Snippet, originalId?: string) => boolean;
}>();

const emit = defineEmits<{ close: [] }>();

const { t } = useI18nT();

const formError = ref('');
const form = ref<Snippet>({ id: props.snippet?.id ?? '', label: props.snippet?.label ?? '' });

const isEdit = computed(() => !!props.snippet);

const save = () => {
  const trimmedId = form.value.id.trim();
  if (!trimmedId) {
    formError.value = t('settings.snippets.action.required');
    return;
  }

  const success = props.onSave({ id: trimmedId, label: form.value.label }, isEdit.value ? props.snippet?.id : undefined);

  if (success) {
    emit('close');
  } else {
    formError.value = t('settings.snippets.action.alreadyExists');
  }
};
</script>

<style scoped lang="scss">
textarea {
  width: 100%;
}

.actions-row {
  justify-content: flex-end;
}
</style>
