<template>
  <div style=" margin: 5vh auto;text-align: center; gap: 20px">
    <h1>Alexandrie dashboard</h1>
    <img style="max-width: 300px; max-height: 300px" :src="`/empty-${colorMode.value}.png`" /> <br />

    <div class="global-search-hint">
      <Icon name="search" class="hint-icon" />
      <span>Press <kbd>Ctrl+K</kbd> for quick global search</span>
    </div>

    <div class="search-container">
      <input v-model="searchQuery" type="text" placeholder="Search documents..." class="search-input" />
      <div v-if="results.length" class="results">
        <NuxtLink v-for="result in results" :key="result.id" class="result" :to="`/dashboard/docs/${result.id}`">
          <Icon :name="category(result.category)?.icon || 'files'" :class="`category-icon ${getAppColor(category(result.category)?.color as number, true)}`" />{{ result.name }}</NuxtLink
        >
      </div>
    </div>
    <div class="apps">
      <NuxtLink to="/dashboard/docs" class="app">
        <Icon name="files" :big="true" fill="var(--primary)" />
        <span>Documents</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/categories" class="app">
        <Icon name="categories" :big="true" fill="var(--primary)" />
        <span>Organizer</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/cdn" class="app">
        <Icon name="cdn" :big="true" fill="var(--primary)" />
        <span>CDN</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/import" class="app">
        <Icon name="import" :big="true" fill="var(--primary)" />
        <span>Import</span>
      </NuxtLink>
    </div>
    <div style=" width: 90%; margin: 0 auto;text-align: left">
      <div class="recent">
        <DocumentCard v-for="doc in recentDocuments" :key="doc.id" :document="doc" />
      </div>
      <NuxtLink to="/dashboard/docs/new" :prefetch="false" class="add-doc">+</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '~/stores';

const colorMode = useColorMode();
const searchQuery = ref('');

const documentsStore = useDocumentsStore();
const categoryStore = useCategoriesStore();
function tokenize(text: string) {
  return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
const results = computed(() => {
  const tokens = tokenize(searchQuery.value);
  if (!tokens.length) return [];
  return documentsStore.getAll
    .filter((doc: Document) => {
      const name = String(doc.name || '');
      const tags = Array.isArray(doc.tags) ? doc.tags.join(' ') : String(doc.tags || '');
      return tokens.every(t => name.toLowerCase().includes(t) || tags.toLowerCase().includes(t));
    })
    .slice(0, 5);
});
const category = (id?: string) => categoryStore.getById(id || '');
const recentDocuments = computed(() => {
  return documentsStore.getAll
    .toSorted((a, b) => {
      return parseInt(b.updated_timestamp) - parseInt(a.updated_timestamp);
    })
    .slice(0, 3);
});
</script>
<style scoped lang="scss">
h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

.global-search-hint {
  display: flex;
  max-width: 500px;
  margin: 20px auto;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--border-color);
  align-items: center;
  gap: 8px;
  justify-content: center;

  .hint-icon {
    width: 16px;
    height: 16px;
    color: var(--primary);
  }

  kbd {
    padding: 4px 8px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
    background: var(--bg-color);
  }
}

.add-doc {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 30px;
  color: white;
  background-color: var(--primary);
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.search-container {
  position: relative;
  max-width: 500px;
  margin: 20px auto;
}

.search-input {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.results {
  position: absolute;
  z-index: 10;
  width: 500px;
  max-height: 300px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-align: left;
  background-color: var(--bg-color);
  gap: 4px;
  overflow-y: auto;
}

.result {
  display: flex;
  padding: 5px;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-contrast);
  }
}

.category-icon {
  padding: 2px;
  border-radius: 4px;
  margin-right: 10px;
}

.apps {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.app {
  display: flex;
  width: 150px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  transition: background-color 0.2s, transform 0.2s;
  align-items: center;
  flex-direction: column;
  text-decoration: none;

  &:hover {
    background-color: var(--bg-contrast);
    transform: scale(1.05);
  }

  span {
    font-size: 14px;
    margin-top: 5px;
  }
}

.recent {
  display: grid;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
