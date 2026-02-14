<template>
  <div class="modal">
    <h2>{{ isEdit ? 'Edit Snippet' : 'New Snippet' }}</h2>

    <label>
      <span>Shortcut</span>
      <input v-model="form.id" type="text" placeholder="!example" :class="{ error: formError }" @input="formError = ''" />
      <small v-if="formError" class="error-text">{{ formError }}</small>
      <small v-else class="hint">Prefix with <code>!</code> for easy trigger in editor</small>
    </label>

    <label> Content </label>
    <textarea v-model="form.label" rows="6" placeholder="Snippet content...&#10;Use ${0}, ${1} for tab stops" />
    <div class="actions-row">
      <AppButton type="secondary" @click="$emit('close')">Cancel</AppButton>
      <AppButton type="primary" @click="save">{{ isEdit ? 'Save' : 'Create' }}</AppButton>
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

const isEdit = computed(() => !!props.snippet);
const form = ref<Snippet>({ id: props.snippet?.id ?? '', label: props.snippet?.label ?? '' });
const formError = ref('');

const save = () => {
  const trimmedId = form.value.id.trim();
  if (!trimmedId) {
    formError.value = 'Shortcut is required';
    return;
  }

  const success = props.onSave({ id: trimmedId, label: form.value.label }, isEdit.value ? props.snippet?.id : undefined);

  if (success) {
    emit('close');
  } else {
    formError.value = 'This shortcut already exists';
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
