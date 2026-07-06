<script setup lang="ts">
const markStore = useMark();

const RELEASE_MARK_ID: MarkId = 'support';

const isVisible = ref(false);

onMounted(() => {
  if (markStore.hasMark(RELEASE_MARK_ID)) {
    isVisible.value = true;
  }
});

function handleClose() {
  isVisible.value = false;
  setTimeout(() => {
    markStore.dismissMark(RELEASE_MARK_ID);
  }, 400);
}
</script>

<template>
  <div v-if="isVisible" class="welcome-banner">
    <Support closeable @close="handleClose" />
  </div>
</template>
