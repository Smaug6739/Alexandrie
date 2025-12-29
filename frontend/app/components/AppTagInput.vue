<template>
  <div class="tag-input">
    <div v-for="(tag, index) in tagsArray" :key="index">
      <tag class="primary tag">{{ tag }}<button type="button" class="remove" @click="removeTag(index)">×</button></tag>
    </div>

    <input v-model="input" placeholder="Add a tag (enter to add)" @keydown.enter.prevent="addTag" @keydown.delete="removeLastTag" />
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
  width: 100%;
  padding: 0 7px;
  align-items: center;
  flex-wrap: wrap;
}
.tag {
  padding: 5px 6px;
}

button {
  margin: 0;
  padding: 0;
}

.remove {
  border: none;
  font-weight: bold;
  color: inherit;
  background: none;
  cursor: pointer;
  margin-left: 4px;
}

input {
  min-width: 100px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--font-color);
  background: transparent;
  transition: background 0.15s ease;
  flex: 1 1 150px;
  outline: none;

  &:hover,
  &:focus {
    background: var(--bg-ui);
  }

  &::placeholder {
    color: var(--font-color-light);
    opacity: 0.7;
  }
}
</style>
