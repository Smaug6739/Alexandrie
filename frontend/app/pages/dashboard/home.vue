<template>
  <div class="home-container">
    <!-- Header avec salutation et actions rapides -->
    <header class="home-header">
      <div class="greeting">
        <h1>Hey, {{ userName }}</h1>
        <p class="subtitle">{{ todayFormatted }} · {{ documentsCount }} documents · {{ workspacesCount }} workspaces</p>
      </div>
      <div class="quick-actions">
        <button class="action-btn primary" @click="createNewDocument"><Icon name="new" /> New document</button>
      </div>
    </header>

    <!-- Barre de recherche rapide -->
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
            <Icon :name="getNodeIcon(result)" :class="`result-icon ${getAppColor(result.color as number, true)}`" />
            <div class="result-content">
              <span class="result-name">{{ result.name }}</span>
              <span class="result-path">{{ getNodePath(result) }}</span>
            </div>
            <span class="result-type">{{ getNodeType(result) }}</span>
          </NuxtLink>
        </div>
      </Transition>
    </div>

    <!-- Section "Continuer à travailler" -->
    <section v-if="recentlyEdited.length" class="section">
      <div class="section-header">
        <h2><Icon name="schedule" />Continue Working</h2>
        <NuxtLink to="/dashboard/docs" class="see-all">See all →</NuxtLink>
      </div>
      <div class="continue-working">
        <NuxtLink v-for="doc in recentlyEdited" :key="doc.id" :to="`/dashboard/docs/${doc.id}`" class="continue-card">
          <div class="continue-header">
            <Icon
              :name="getNodeIcon(doc)"
              display="xl"
              :class="`continue-icon ${getAppColor(doc.color || getCategory(doc.parent_id)?.color as number, true)}`"
            />
            <span class="continue-time">{{ relativeTime(doc.updated_timestamp) }}</span>
          </div>
          <h3 class="continue-title">{{ doc.name }}</h3>
          <p v-if="doc.description" class="continue-desc">{{ doc.description }}</p>
          <div class="continue-meta">
            <span v-if="getCategory(doc.parent_id)" class="continue-category">
              {{ getCategory(doc.parent_id)?.name }}
            </span>
            <div v-if="doc.tags" class="continue-tags">
              <tag v-for="tag in doc.tags.split(',').slice(0, 2)" :key="tag" class="mini">{{ tag.trim() }}</tag>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Section documents épinglés -->
    <section v-if="pinnedDocuments.length" class="section">
      <div class="section-header">
        <h2><Icon name="pin" /> Pinned Documents</h2>
      </div>
      <div class="pinned-grid">
        <NuxtLink v-for="doc in pinnedDocuments" :key="doc.id" :to="`/dashboard/docs/${doc.id}`" class="pinned-card">
          <Icon :name="getNodeIcon(doc)" :class="`pinned-icon ${getAppColor(doc.color || getCategory(doc.parent_id)?.color as number, true)}`" />
          <span class="pinned-name">{{ doc.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Section Workspaces -->
    <section class="section">
      <div class="section-header">
        <h2><Icon name="workspace" /> Your Workspaces</h2>
        <NuxtLink to="/dashboard/categories" class="see-all">Manage →</NuxtLink>
      </div>
      <div class="workspaces-grid">
        <NuxtLink
          v-for="workspace in workspaces"
          :key="workspace.id"
          :to="`/dashboard/categories/${workspace.id}`"
          class="workspace-card"
          :class="getAppColor(workspace.color as number, true)"
        >
          <div class="workspace-header">
            <Icon :name="workspace.icon || 'workspace'" class="workspace-icon" />
            <span class="workspace-count">{{ getWorkspaceDocCount(workspace.id) }}</span>
          </div>
          <h3 class="workspace-name">{{ workspace.name }}</h3>
          <p v-if="workspace.description" class="workspace-desc">{{ workspace.description }}</p>
          <div class="workspace-children">
            <span v-for="child in getWorkspaceCategories(workspace.id).slice(0, 3)" :key="child.id" class="child-badge">
              {{ child.name }}
            </span>
            <span v-if="getWorkspaceCategories(workspace.id).length > 3" class="child-more"> +{{ getWorkspaceCategories(workspace.id).length - 3 }} </span>
          </div>
        </NuxtLink>
        <button class="workspace-card add-workspace" @click="openCreateWorkspace">
          <Icon name="add" class="add-icon" />
          <span>Nouveau workspace</span>
        </button>
      </div>
    </section>

    <!-- Section activité récente -->
    <section class="section">
      <div class="section-header">
        <h2><Icon name="timeline" /> Recent Activity</h2>
      </div>
      <div class="activity-timeline">
        <div v-for="(group, date) in activityByDate" :key="date" class="activity-group">
          <div class="activity-date">{{ date }}</div>
          <div class="activity-items">
            <NuxtLink v-for="item in group" :key="item.id" :to="getNodeLink(item)" class="activity-item">
              <Icon :name="getNodeIcon(item)" :class="`activity-icon ${getAppColor(item.color as number, true)}`" />
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
        <Icon name="files" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">{{ documentsCount }}</span>
          <span class="stat-label">Documents</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="workspace" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">{{ workspacesCount }}</span>
          <span class="stat-label">Workspaces</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="tag" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">{{ tagsCount }}</span>
          <span class="stat-label">Tags</span>
        </div>
      </div>
      <div class="stat-card">
        <Icon name="cdn" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">{{ resourcesCount }}</span>
          <span class="stat-label">CDN Files</span>
        </div>
      </div>
    </section>

    <!-- Floating action button -->
    <NuxtLink to="/dashboard/docs/new" :prefetch="false" class="fab">
      <Icon name="add" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
import CreateCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';

const router = useRouter();
const nodesStore = useNodesStore();
const userStore = useUserStore();
const locale = 'en-US';

// Search state
const searchQuery = ref('');
const isSearchFocused = ref(false);

// User info
const userName = computed(() => userStore.user?.firstname || userStore.user?.username || '');

// Formatted date
const todayFormatted = computed(() => {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});

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

// Get workspace categories
const getWorkspaceCategories = (workspaceId: string) => {
  return nodesStore.getAll.filter(n => n.parent_id === workspaceId && n.role === 2).toArray();
};

// Get document count for a workspace
const getWorkspaceDocCount = (workspaceId: string) => {
  const allChildren = nodesStore.getAllChildrensIds(workspaceId);
  return nodesStore.documents.filter(d => allChildren.includes(d.id)).size;
};

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

const getNodeIcon = (node: Node) => {
  if (node.icon) return node.icon;
  if (node.role === 1) return 'workspace';
  if (node.role === 2) return 'folder';
  if (node.role === 3) return node.accessibility === 1 ? 'sidebar/file' : 'draft';
  if (node.role === 4) return 'sidebar/image';
  return 'sidebar/file';
};

const getNodeLink = (node: Node) => {
  if (node.role === 1 || node.role === 2) return `/dashboard/categories/${node.id}`;
  if (node.role === 3) return `/dashboard/docs/${node.id}`;
  if (node.role === 4) return `/dashboard/cdn/${node.id}/preview`;
  return '/dashboard';
};

const getNodeType = (node: Node) => {
  if (node.role === 1) return 'Workspace';
  if (node.role === 2) return 'Catégorie';
  if (node.role === 3) return 'Document';
  if (node.role === 4) return 'Ressource';
  return '';
};

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

const relativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  return formatDate(timestamp);
};

const formatDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === yesterday.toDateString()) return 'Hier';
  return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
};

// Actions
const createNewDocument = () => router.push('/dashboard/docs/new');
const openCommandCenter = () => window.dispatchEvent(new CustomEvent('command-center-open'));
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

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--font-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-contrast);
  }

  &.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: white;

    &:hover {
      background: var(--primary-dark);
    }
  }

  kbd {
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    font-size: 0.75rem;
  }
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

.result-icon {
  padding: 0.4rem;
  border-radius: 6px;
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
    font-weight: 600;
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

.continue-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--font-color);
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.continue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.continue-icon {
  padding: 0.4rem;
  border-radius: 6px;
}

.continue-time {
  font-size: 0.75rem;
  color: var(--font-color-light);
}

.continue-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.continue-desc {
  font-size: 0.85rem;
  color: var(--font-color-light);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.continue-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.continue-category {
  font-size: 0.75rem;
  color: var(--font-color-light);
}

.continue-tags {
  display: flex;
  gap: 0.25rem;
}

// Pinned
.pinned-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pinned-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-decoration: none;
  color: var(--font-color);
  transition: all 0.2s;

  &:hover {
    background: var(--bg-contrast);
    border-color: var(--primary);
  }
}

.pinned-icon {
  padding: 0.3rem;
  border-radius: 4px;
}

.pinned-name {
  font-size: 0.9rem;
  font-weight: 500;
}

// Workspaces
.workspaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.workspace-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--font-color);
  transition: all 0.2s;
  background: var(--bg-color);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  // Color variants
  &.blue {
    border-left: 4px solid var(--blue);
  }
  &.red {
    border-left: 4px solid var(--red);
  }
  &.green {
    border-left: 4px solid var(--green);
  }
  &.yellow {
    border-left: 4px solid var(--yellow);
  }
  &.purple {
    border-left: 4px solid var(--purple);
  }
  &.pink {
    border-left: 4px solid var(--pink);
  }
  &.teal {
    border-left: 4px solid var(--teal);
  }
  &.primary {
    border-left: 4px solid var(--primary);
  }
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.workspace-icon {
  font-size: 1.5rem;
  color: var(--primary);
}

.workspace-count {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  background: var(--bg-contrast);
  border-radius: 12px;
  color: var(--font-color-light);
}

.workspace-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.workspace-desc {
  font-size: 0.85rem;
  color: var(--font-color-light);
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.workspace-children {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.child-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: var(--bg-contrast);
  border-radius: 4px;
  color: var(--font-color-light);
}

.child-more {
  font-size: 0.75rem;
  color: var(--font-color-light);
}

.add-workspace {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  background: transparent;
  cursor: pointer;
  min-height: 150px;

  &:hover {
    border-color: var(--primary);
    background: var(--primary-bg);
  }

  .add-icon {
    font-size: 2rem;
    color: var(--font-color-light);
    margin-bottom: 0.5rem;
  }

  span {
    font-size: 0.9rem;
    color: var(--font-color-light);
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
  font-size: 1.5rem;
  color: var(--primary);
  padding: 0.75rem;
  background: var(--primary-bg);
  border-radius: 10px;
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

// FAB
.fab {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  transition: all 0.2s;
  z-index: 50;

  &:hover {
    transform: scale(1.1);
    background: var(--primary-dark);
  }
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

    .action-btn {
      flex: 1;
      justify-content: center;
    }

    kbd {
      display: none;
    }
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
