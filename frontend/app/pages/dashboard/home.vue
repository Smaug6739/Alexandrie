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
            <Icon :name="resolveIcon(result)" :class="`node-icon ${getAppAccent(result.color as number, true)}`" />
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
          <NodeCardRecent :node="doc" />
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
          <NodeCardRecent :node="doc" />
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
          <NodeCardWorkspace :workspace="workspace" />
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
                :class="`activity-icon ${getAppAccent(item.color || (getCategory(item.parent_id)?.color as number), true)}`"
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
        <Icon name="files" display="xxl" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ documentsCount }}</span>
          <span class="stat-label">Documents</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="categories" display="xxl" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ workspacesCount }}</span>
          <span class="stat-label">Workspaces</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="advanced" display="xxl" class="stat-icon" fill="var(--primary)" />
        <div class="stat-content">
          <span class="stat-value">{{ tagsCount }}</span>
          <span class="stat-label">Tags</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="import" display="xxl" class="stat-icon" fill="var(--primary)" />
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
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import type { Node } from '~/stores';

const router = useRouter();
const nodesStore = useNodesStore();
const userStore = useUserStore();

const { todayFormatted, formatTime, shortDateLabel } = useDateFormatters();
const { getAppAccent } = useAppColors();

// Search state
const searchQuery = ref('');
const isSearchFocused = ref(false);

// User info
const userName = computed(() => userStore.user?.firstname || userStore.user?.username || '');

// Stats
const documentsCount = computed(() => nodesStore.documents.size);
const workspacesCount = computed(() => nodesStore.getAll.filter(n => n.role === 1).size);
const tagsCount = computed(() => nodesStore.getAllTags.length);
const resourcesCount = computed(() => nodesStore.resources.size);

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
    const date = shortDateLabel(doc.updated_timestamp);
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
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.greeting h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
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
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;
  align-items: center;

  &.focused {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-bg);
  }
}

.search-icon {
  color: var(--text-secondary);
  margin-right: 0.75rem;
}

.search-input {
  border: none;
  font-size: 1rem;
  color: var(--text-body);
  background: transparent;
  flex: 1;
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
  }
}

.search-clear {
  padding: 0.25rem;
  border-radius: var(--radius-xs);
  cursor: pointer;

  &:hover {
    background: var(--surface-raised);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  z-index: 100;
  max-height: 400px;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
}

.search-result {
  display: flex;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  color: var(--text-body);
  transition: background $transition-fast;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;

  &:hover {
    background: var(--surface-raised);
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
}

.node-icon {
  padding: 3px;
  border-radius: var(--radius-sm);
  margin-right: 10px;
}

.result-content {
  min-width: 0;
  flex: 1;
}

.result-name {
  display: block;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-path {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.result-type {
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--surface-raised);
}

// Sections
.section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    display: flex;
    font-size: 1.1rem;
    align-items: center;
    flex: 1;
    gap: 0.5rem;
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
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

// Pinned
.pinned-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

// Workspaces
.workspaces-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.add-workspace {
  display: flex;
  min-height: 150px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: transparent;
  transition:
    border-color $transition-fast,
    background $transition-fast,
    box-shadow $transition-fast,
    transform $transition-fast;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;

  &:hover {
    border-color: var(--primary);
    background: var(--primary-bg);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
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
  color: var(--text-secondary);
  text-transform: capitalize;
}

.activity-items {
  display: flex;
  border-left: 2px solid var(--border);
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1rem;
}

.activity-item {
  display: flex;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  color: var(--text-body);
  transition: background $transition-fast;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;

  &:hover {
    background: var(--surface-raised);
  }
}

.activity-icon {
  padding: 0.3rem;
  border-radius: var(--radius-xs);
}

.activity-content {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
}

.activity-name {
  font-weight: 500;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

// Stats
.stats-section {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.stat-card {
  display: flex;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  padding: 0.4rem;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
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
  color: var(--text-secondary);
}

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity $transition-fast ease,
    transform $transition-fast ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// Responsive
@media (width <= 768px) {
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
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
