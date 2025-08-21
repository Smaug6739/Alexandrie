<template>
  <div v-if="showSearchModal" class="modal-mask">
    <div ref="searchContainer" class="modal-container">
      <span class="search-input">
        <Icon name="search" />
        <input ref="searchInput" v-model="filter" type="text" placeholder="Search document" />
        <button style="background: none" @click="close">
          <Icon name="close" :big="true" />
        </button>
      </span>
      <span class="title">Documents</span>
      <NuxtLink v-for="doc of docs" :key="doc.id" class="item-search" :to="`/dashboard/docs/${doc.id}`" @click="close">
        <Icon name="draft" :big="true" fill="var(--font-color)" /> {{ doc.name }}
        <span class="category">
          <tag :class="getAppColor(categoryStore.getById(doc.category || '')?.color)">{{ categoryStore.getById(doc.category || '')?.name }}</tag>
        </span>
      </NuxtLink>
      <p v-if="!docs.length" class="no-result">No result found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const categoryStore = useCategoriesStore();

const documents = computed(() => useDocumentsStore().getAll.filter(c => c.name.toLowerCase().includes(filter.value.toLowerCase()) || c.tags?.toLowerCase().includes(filter.value.toLowerCase())));
const filter = ref<string>('');
const showSearchModal = ref<boolean>(false);

// Docs = max 5 docs
const docs = computed(() => documents.value.slice(0, 5));

const close = () => {
  showSearchModal.value = false;
  filter.value = '';
};
const searchContainer = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

const handleTab = (event: KeyboardEvent) => {
  event.preventDefault();
  if (!searchContainer.value) return;
  const focusableItems = Array.from(searchContainer.value.querySelectorAll('a'));
  const currentIndex = focusableItems.findIndex(item => item === document.activeElement);
  let nextIndex;
  if (event.shiftKey) {
    nextIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
  } else {
    nextIndex = (currentIndex + 1) % focusableItems.length;
  }
  focusableItems[nextIndex]?.focus();
};

onMounted(() => window.addEventListener('keydown', handleSearchShortCut));
onBeforeUnmount(() => window.removeEventListener('keydown', handleSearchShortCut));
const handleSearchShortCut = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'q') {
    if (!showSearchModal.value) {
      showSearchModal.value = true;
      nextTick(() => searchInput.value?.focus());
    } else close();
  }
  if (showSearchModal.value) {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') handleTab(e);
  }
};
</script>

<style lang="scss" scoped>
.modal-container {
  width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background-color: var(--bg-color);
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s ease;
}

.search-input {
  display: flex;
  align-items: center;

  input {
    width: 100%;
    border: none;
    background-color: var(--bg-color);
    outline: none;
  }

  svg {
    fill: var(--bg-contrast);
  }
}

.title {
  padding: 10px 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #737373;
}

.item-search {
  display: flex;
  margin: 2.5px 0;
  padding: 10px 0;
  border-radius: 5px;
  color: var(--font-color);
  align-items: center;
  cursor: pointer;
  justify-content: flex-start;

  &:hover {
    background: var(--bg-contrast-2);
  }

  &:focus {
    outline: 2px solid var(--font-color);
  }

  .icon {
    display: flex;
    align-items: center;

    &:deep(svg) {
      width: 35px;
      margin-right: 5px;
    }
  }
}

.category {
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 1.1rem;
  color: var(--font-color);
  margin-left: auto;
}

.no-result {
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}
</style>
