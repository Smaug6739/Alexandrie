<template>
  <div class="stats-modal">
    <div class="stats-header">
      <Icon name="info" class="stats-icn"/>
      <h2>Document Statistics</h2>
    </div>
    <div class="stats-body">
      <div class="stats-row"><span>Words</span><span>{{ wordCount }}</span></div>
      <div class="stats-row"><span>Characters</span><span>{{ charCount }}</span></div>
      <div class="stats-row"><span>Lines</span><span>{{ lineCount }}</span></div>
      <div class="stats-row"><span>Paragraphs</span><span>{{ paragraphCount }}</span></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue';
import Icon from '../Icon.vue';
const props = defineProps<{ content: string }>();
const charCount = computed(() => props.content.length);
const wordCount = computed(() => (props.content.match(/\b\w+\b/g) || []).length);
const lineCount = computed(() => props.content.split(/\r?\n/).length);
const paragraphCount = computed(() => (props.content.trim().split(/\n{2,}/).filter(p => p.trim().length > 0)).length);
</script>
<style scoped lang="scss">
.stats-modal {
  padding: 26px 32px 24px 32px;
  min-width: 270px;
}
.stats-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  .stats-icn {
    margin-top:-10px;
    font-size: 2.2em;
    color: var(--primary);
    opacity: 0.93;
  }
  h2 {
    font-size: 1.2em;
    margin: 0;
    font-weight: 600;
    color: var(--primary-dark);
  }
}
.stats-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.07em;
  color: var(--font-color-dark);
  padding: 4px 0;
  border-bottom: 1px dashed var(--border-color);
  &:last-child { border-bottom: none; }
}

</style>
