<template>
  <div class="tag-input">
    <div v-for="(tag, index) in tagsArray" :key="index">
      <tag class="primary" style="padding: 5px 6px">{{ tag }}<button type="button" class="remove" @click="removeTag(index)">×</button></tag>
    </div>

    <input v-model="input" @keydown.enter.prevent="addTag" @keydown.delete="removeLastTag" placeholder="Add a tag (enter to add)..." />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: string }>(); // Separated by commas
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();
const input = ref('');

const tagsArray = computed(() =>
  props.modelValue
    ? props.modelValue
        .split(',')
        .map(t => t?.trim())
        .filter(Boolean)
    : [],
);

function updateModel(newTags: string[]) {
  emit('update:modelValue', newTags.join(', '));
}

function addTag() {
  const value = input.value?.trim();
  if (value && !tagsArray.value.includes(value)) {
    updateModel([...tagsArray.value, value]);
  }
  input.value = '';
}

function removeTag(index: number) {
  updateModel(tagsArray.value.filter((_, i) => i !== index));
}

function removeLastTag() {
  if (!input.value && tagsArray.value.length) {
    updateModel(tagsArray.value.slice(0, -1));
  }
}
</script>

<style scoped lang="scss">
.tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: var(--bg-color);
  padding: 0 7px;
  border-radius: 10px;
  width: 100%;
}
button {
  margin: 0;
  padding: 0;
}

.remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-weight: bold;
  margin-left: 4px;
}

input {
  border: none;
  outline: none;
  background: transparent;
  min-width: 80px;
  flex: 1;
  padding: 0 4px;
}
</style>
