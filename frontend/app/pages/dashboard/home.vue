<template>
  <div style="text-align: center; margin: 5vh auto; gap: 20px">
    <h1>Alexandrie dashboard</h1>
    <img style="max-width: 300px; max-height: 300px" :src="`/empty-${colorMode.value}.png`" /> <br />
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Search documents..." class="search-input" />
      <div v-if="results.length" class="results">
        <NuxtLink v-for="result in results" :key="result.id" class="result" :to="`/dashboard/docs/${result.id}`">{{ result.name }}</NuxtLink>
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
    <div style="text-align: left; width: 90%; margin: 0 auto">
      <div class="recent">
        <DocumentCard v-for="doc in recentDocuments" :key="doc.id" :document="doc" />
      </div>
      <NuxtLink to="/dashboard/docs/new" class="add-doc">+</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const searchQuery = ref('');

const documentsStore = useDocumentsStore();
const results = computed(() => {
  if (!searchQuery.value) return [];
  return documentsStore.getAll.filter(doc => doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())).slice(0, 5);
});
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
.add-doc {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  text-decoration: none;
}
.search-container {
  position: relative;
  margin: 20px auto;
  max-width: 500px;
}
.search-input {
  max-width: 500px;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  margin: 0 auto;
}
.results {
  position: absolute;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px;
  width: 500px;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
}
.result {
  display: block;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--bg-contrast);
  }
}

.apps {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  max-width: 500px;
  margin: 0 auto;
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-color);
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: background-color 0.2s, transform 0.2s;
  width: 150px;
  &:hover {
    background-color: var(--bg-contrast);
    transform: scale(1.05);
  }
  span {
    margin-top: 5px;
    font-size: 14px;
  }
}

.recent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px auto;
  max-width: 1200px;
}
</style>
