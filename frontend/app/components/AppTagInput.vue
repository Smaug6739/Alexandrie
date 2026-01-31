<template>
  <div :class="[display === 'row' ? 'row' : 'column']">
    <div class="tags-input-wrapper">
      <div class="tags-input">
        <input
          v-model="tagInput"
          type="text"
          placeholder="Enter to add tag"
          :class="{ minimal: minimal }"
          @keydown.enter="handleEnter"
          @keydown.arrow-up="tagHandleArrowUp"
          @keydown.arrow-down="tagHandleArrowDown"
          @keydown.escape="hideSuggestions"
          @input="handleTagInput"
          @focus="showSuggestions = true"
          @blur="hideSuggestions"
        />
        <button v-if="!minimal" class="add-tag-btn" @click="addTag()">
          <Icon name="plus" fill="#fff" />
        </button>
      </div>
      <div v-if="showSuggestions && filteredTagSuggestions.length > 0" class="tag-suggestions">
        <div
          v-for="(tag, index) in filteredTagSuggestions"
          :key="tag"
          class="tag-suggestion"
          :class="{ selected: selectedSuggestionIndex === index }"
          @mousedown="addTag(tag)"
          @mouseenter="selectedSuggestionIndex = index"
        >
          {{ tag }}
        </div>
      </div>
    </div>
    <div v-if="selectedTags?.length" :class="`selected-tags `">
      <span v-for="tag in selectedTags" :key="tag" class="tag-chip">
        {{ tag }}
        <button class="remove-tag" @click.stop="removeTag(tag)">×</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  display?: 'column' | 'row';
  minimal?: boolean;
  modelValue?: string; // separate tags with commas
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectedTags = ref<string[]>(stringToTags(props.modelValue || ''));
const tagInput = ref('');
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(-1);

const nodesStore = useNodesStore();

watch(
  () => props.modelValue,
  newVal => {
    selectedTags.value = stringToTags(newVal || '');
  },
);

function stringToTags(str: string): string[] {
  return str
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

const filteredTagSuggestions = computed(() => {
  if (!tagInput.value) return [];
  const input = tagInput.value.toLowerCase();
  return nodesStore.allTags.filter(tag => tag.toLowerCase().includes(input) && !tagInput.value.includes(tag)).slice(0, 5);
});

function addTag(tag?: string) {
  const newTag = tag?.trim() || tagInput.value.trim();
  if (newTag && !selectedTags.value.includes(newTag)) {
    selectedTags.value.push(newTag);
    tagInput.value = '';
    showSuggestions.value = false;
    emit('update:modelValue', selectedTags.value.join(','));
  }
}

function handleTagInput() {
  selectedSuggestionIndex.value = 0;
  showSuggestions.value = filteredTagSuggestions.value.length > 0;
}

function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
}

function handleEnter(event: KeyboardEvent) {
  event.preventDefault();
  let tagToAdd: string | undefined = '';
  if (showSuggestions.value && filteredTagSuggestions.value.length > 0) {
    tagToAdd = filteredTagSuggestions.value[selectedSuggestionIndex.value];
  }
  addTag(tagToAdd);
}

function tagHandleArrowUp(event: KeyboardEvent) {
  event.preventDefault();
  if (showSuggestions.value && filteredTagSuggestions.value.length > 0) {
    selectedSuggestionIndex.value = selectedSuggestionIndex.value > 0 ? selectedSuggestionIndex.value - 1 : filteredTagSuggestions.value.length - 1;
  }
}

function tagHandleArrowDown(event: KeyboardEvent) {
  event.preventDefault();
  if (showSuggestions.value && filteredTagSuggestions.value.length > 0) {
    selectedSuggestionIndex.value = selectedSuggestionIndex.value < filteredTagSuggestions.value.length - 1 ? selectedSuggestionIndex.value + 1 : 0;
  }
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
  emit('update:modelValue', selectedTags.value.join(','));
}
</script>

<style scoped lang="scss">
.column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.row {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: baseline;
}
.tags-input-wrapper {
  position: relative;
}

.tags-input {
  display: flex;
  gap: 6px;
}

input {
  flex: 1;
  min-width: 150px;

  &:focus {
    border-color: var(--primary);
  }
  &.minimal {
    font-size: 12px;
    padding: 6px 8px;
    border: none;
    &:hover,
    &:focus {
      background: var(--bg-ui);
    }
  }
}

.add-tag-btn {
  display: flex;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  color: white;
  background: var(--primary);
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    background: var(--primary-dark);
  }
}

.tag-suggestions {
  position: absolute;
  top: 100%;
  right: 40px;
  left: 0;
  z-index: 10;
  max-height: 150px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  margin-top: 2px;
  overflow-y: auto;
}

.tag-suggestion {
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover,
  &.selected {
    background: var(--border-color);
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.tag-chip {
  display: inline-flex;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 12px;
  background: var(--border-color);
  align-items: center;
  gap: 4px;

  .remove-tag {
    display: flex;
    width: 14px;
    height: 14px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    align-items: center;
    cursor: pointer;
    justify-content: center;

    &:hover {
      color: var(--opposite-color);
    }
  }
}
</style>
