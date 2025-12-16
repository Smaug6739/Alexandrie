<template>
  <div class="home-container">
    <!-- Header with greeting and quick actions -->
    <header class="home-header">
      <div class="greeting">
        <h1>👋 Hey, {{ userName }}</h1>
        <p class="subtitle">{{ todayFormatted }} · {{ documentsCount }} documents · {{ workspacesCount }} workspaces</p>
      </div>
      <div class="quick-actions">
        <AppButton type="primary" @click="createNewDocument">+ New document</AppButton>
      </div>
    </header>

    <!-- Quick search bar -->
    <div class="search-section">
      <div class="search-wrapper" :class="{ focused: isSearchFocused }">
        <Icon name="search" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search documents, workspaces, categories..."
          class="search-input"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        />
        <div v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
          <Icon name="close" />
        </div>
      </div>
      <Transition name="dropdown">
        <div v-if="searchResults?.length" class="search-results">
          <NuxtLink v-for="result in searchResults" :key="result.id" class="search-result" :to="getNodeLink(result)">
            <Icon :name="resolveIcon(result)" :class="`node-icon ${getAppColor(result.color as number, true)}`" />
            <div class="result-content">
              <span class="result-name">{{ result.name }}</span>
              <span class="result-path">{{ getNodePath(result) }}</span>
            </div>
            <span class="result-type">{{ getNodeType(result) }}</span>
          </NuxtLink>
        </div>
      </Transition>
    </div>

    <!-- Section "Continue Working" -->
    <section v-if="recentlyEdited.length" class="section">
      <div class="section-header">
        <h2><Icon name="work" />Continue Working</h2>
        <NuxtLink to="/dashboard/docs" class="see-all">See all</NuxtLink>
      </div>
      <div class="continue-working">
        <NuxtLink v-for="doc in recentlyEdited" :key="doc.id" :to="`/dashboard/docs/${doc.id}`">
          <NodeRecentCard :node="doc" />
        </NuxtLink>
      </div>
    </section>

    <!-- Section Pinned Documents -->
    <section v-if="pinnedDocuments.length" class="section">
      <div class="section-header">
        <h2><Icon name="pin" /> Pinned Documents</h2>
      </div>
      <div class="pinned-grid">
        <NuxtLink v-for="doc in pinnedDocuments" :key="doc.id" :to="`/dashboard/docs/${doc.id}`">
          <NodeRecentCard :node="doc" />
        </NuxtLink>
      </div>
    </section>

    <!-- Workspaces Section -->
    <section class="section">
      <div class="section-header">
        <h2><Icon name="workspace" /> Your Workspaces</h2>
        <NuxtLink to="/dashboard/categories" class="see-all">Manage</NuxtLink>
      </div>
      <div class="workspaces-grid">
        <NuxtLink v-for="workspace in workspaces" :key="workspace.id" :to="`/dashboard/categories/${workspace.id}`">
          <NodeWorkspaceCard :workspace="workspace" />
        </NuxtLink>
        <button class="add-workspace" @click="openCreateWorkspace">New workspace</button>
      </div>
    </section>

    <!-- Recent Activity Section -->
    <section class="section">
      <div class="section-header">
        <h2><Icon name="recent" /> Recent Activity</h2>
      </div>
      <div class="activity-timeline">
        <div v-for="(group, date) in activityByDate" :key="date" class="activity-group">
          <div class="activity-date">{{ date }}</div>
          <div class="activity-items">
            <NuxtLink v-for="item in group" :key="item.id" :to="getNodeLink(item)" class="activity-item">
              <Icon
                :name="resolveIcon(item)"
                display="md"
                :class="`activity-icon ${getAppColor(item.color || getCategory(item.parent_id)?.color as number, true)}`"
              />
              <div class="activity-content">
                <span class="activity-name">{{ item.name }}</span>
                <span class="activity-time">{{ formatTime(item.updated_timestamp) }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick stats -->
    <section class="section stats-section">
      <div class="stat-card">
        <Icon name="files" display="xll" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ documentsCount }}</span>
          <span class="stat-label">Documents</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="categories" display="xll" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ workspacesCount }}</span>
          <span class="stat-label">Workspaces</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="advanced" display="xll" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ tagsCount }}</span>
          <span class="stat-label">Tags</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="import" display="xll" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ resourcesCount }}</span>
          <span class="stat-label">CDN Files</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { resolveIcon, resolveNodeLink, resolveNodeType } from '~/helpers/node';
import type { Node } from '~/stores';
import CreateCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';

const router = useRouter();
const nodesStore = useNodesStore();
const userStore = useUserStore();

// Search state
const searchQuery = ref('');
const isSearchFocused = ref(false);

// User info
const userName = computed(() => userStore.user?.firstname || userStore.user?.username || '');

// Stats
const documentsCount = computed(() => nodesStore.documents.size);
const workspacesCount = computed(() => nodesStore.getAll.filter(n => n.role === 1).size);
const tagsCount = computed(() => nodesStore.getAllTags.length);
const resourcesCount = computed(() => nodesStore.ressources.size);

// Recently edited documents (last 5, sorted by update time)
const recentlyEdited = computed(() => {
  return nodesStore.documents
    .toArray()
    .toSorted((a, b) => b.updated_timestamp - a.updated_timestamp)
    .slice(0, 5);
});

// Pinned documents (order === -1)
const pinnedDocuments = computed(() => {
  return nodesStore.documents.filter(d => d.order === -1).toArray();
});

// Workspaces
const workspaces = computed(() => {
  return nodesStore.getAll
    .filter(n => n.role === 1)
    .toArray()
    .toSorted((a, b) => a.name.localeCompare(b.name));
});

// Activity grouped by date
const activityByDate = computed(() => {
  const docs = nodesStore.documents
    .toArray()
    .toSorted((a, b) => b.updated_timestamp - a.updated_timestamp)
    .slice(0, 15);

  const groups: Record<string, Node[]> = {};
  docs.forEach(doc => {
    const date = formatDateLabel(doc.updated_timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(doc);
  });
  return groups;
});

// Search results
const searchResults = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return [];

  return nodesStore.getAll
    .filter((node: Node) => {
      const name = (node.name || '').toLowerCase();
      const description = (node.description || '').toLowerCase();
      const tags = (node.tags || '').toLowerCase();
      return name.includes(query) || description.includes(query) || tags.includes(query);
    })
    .toArray()
    .slice(0, 8);
});

// Helpers
const getCategory = (id?: string) => nodesStore.getById(id || '');
const getNodeLink = resolveNodeLink; // Use centralized helper
const getNodeType = resolveNodeType; // Use centralized helper

const getNodePath = (node: Node) => {
  const parts: string[] = [];
  let current = node;
  while (current.parent_id) {
    const parent = nodesStore.getById(current.parent_id);
    if (parent) {
      parts.unshift(parent.name);
      current = parent;
    } else break;
  }
  return parts.join(' / ') || 'Racine';
};

// Actions
const createNewDocument = () => router.push('/dashboard/docs/new');
const openCreateWorkspace = () => useModal().add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1 } }));
</script>

<style scoped lang="scss">
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

// Header
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.greeting h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--font-color-light);
  font-size: 0.9rem;
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
}

// Search
.search-section {
  position: relative;
  margin-bottom: 2rem;
}

.search-wrapper {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  transition: all 0.2s;

  &.focused {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-bg);
  }
}

.search-icon {
  color: var(--font-color-light);
  margin-right: 0.75rem;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: var(--font-color);
  outline: none;

  &::placeholder {
    color: var(--font-color-light);
  }
}

.search-clear {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: var(--bg-contrast);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  padding: 2px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
}

.search-result {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--font-color);
  transition: background 0.15s;
  border-radius: 8px;
  &:hover {
    background: var(--bg-contrast);
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-name {
  display: block;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-path {
  display: block;
  font-size: 0.8rem;
  color: var(--font-color-light);
}

.result-type {
  font-size: 0.75rem;
  color: var(--font-color-light);
  padding: 0.2rem 0.5rem;
  background: var(--bg-contrast);
  border-radius: 4px;
}

// Sections
.section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    flex: 1;
  }
}

.see-all {
  font-size: 0.9rem;
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

// Continue working cards
.continue-working {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

// Pinned
.pinned-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

// Workspaces
.workspaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.add-workspace {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  transition: all 0.2s;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  min-height: 150px;
  font-size: 0.9rem;
  color: var(--font-color-light);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
    background: var(--primary-bg);
  }
}

// Activity timeline
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-date {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--font-color-light);
  text-transform: capitalize;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border-color);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--font-color);
  transition: background 0.15s;

  &:hover {
    background: var(--bg-contrast);
  }
}

.activity-icon {
  padding: 0.3rem;
  border-radius: 4px;
}

.activity-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-name {
  font-weight: 500;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--font-color-light);
}

// Stats
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
}

.stat-icon {
  padding: 0.4rem;
  background: var(--primary-bg);
  border-radius: 8px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--font-color-light);
}

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// Responsive
@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .home-header {
    flex-direction: column;
  }

  .quick-actions {
    width: 100%;
  }

  .greeting h1 {
    font-size: 1.5rem;
  }

  .continue-working,
  .workspaces-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
