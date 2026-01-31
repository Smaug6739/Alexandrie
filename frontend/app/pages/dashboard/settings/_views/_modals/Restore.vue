<template>
  <div class="modal">
    <h3>Restore default snippets</h3>
    <p>Are you sure you want to restore the default snippets?</p>

    <p class="description">This action is irreversible</p>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="reset">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const snippets = useSnippets();

const emit = defineEmits<{ close: [] }>();

const reset = async () => {
  snippets.restoreDefaults();
  emit('close');
};
</script>
