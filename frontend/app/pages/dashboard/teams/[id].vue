<template>
  <div v-if="team" class="team-page">
    <section class="team-hero">
      <div class="team-ident">
        <div class="team-avatar" :class="getAppAccent(team.color as number, true)">
          <img v-if="team.thumbnail" :src="team.thumbnail" :alt="team.name" class="team-thumbnail" />
          <Icon v-else :name="resolveIcon(team)" display="xxl" />
        </div>
        <div class="team-copy">
          <p class="eyebrow">Team</p>
          <h1>{{ team.name }}</h1>
          <p class="description">{{ team.description || 'No description provided yet.' }}</p>
          <div class="meta-row">
            <span class="meta-chip">{{ directChildren.length }} direct items</span>
            <span class="meta-chip">{{ allItems.length }} total nodes</span>
            <span class="meta-chip">Updated {{ shortDate(team.updated_timestamp) }}</span>
          </div>
        </div>
      </div>

      <div class="team-actions">
        <AppButton type="primary" @click="openCreateWorkspace">New workspace</AppButton>
        <AppButton type="secondary" @click="openCreateCategory">New category</AppButton>
        <NuxtLink :to="`/dashboard/docs/new?parent_id=${team.id}`"><AppButton type="secondary">New document</AppButton></NuxtLink>
        <AppButton type="secondary" @click="openPermissions">Manage access</AppButton>
        <AppButton type="danger" @click="openDelete">Delete team</AppButton>
      </div>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <span class="stat-value">{{ countByRole(1) }}</span
        ><span class="stat-label">Workspaces</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{{ countByRole(2) }}</span
        ><span class="stat-label">Categories</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{{ countByRole(3) }}</span
        ><span class="stat-label">Documents</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{{ countByRole(4) }}</span
        ><span class="stat-label">Resources</span>
      </article>
    </section>

    <section class="content-panel">
      <div class="section-header">
        <h2>Structure</h2>
        <span>Live view of this team hierarchy</span>
      </div>

      <div class="section-grid">
        <div v-for="section in structureSections" :key="section.title" class="section-block">
          <div class="section-block-header">
            <h3>{{ section.title }}</h3>
            <span>{{ section.items.length }}</span>
          </div>

          <div v-if="section.items.length" class="card-grid">
            <NuxtLink v-for="item in section.items" :key="item.id" :to="resolveNodeLink(item)" class="entity-card">
              <div class="entity-card-head">
                <div class="entity-icon" :class="getAppAccent(item.color as number, true)">
                  <Icon :name="resolveIcon(item)" />
                </div>
                <div class="entity-copy">
                  <strong>{{ item.name }}</strong>
                  <small>{{ resolveNodeType(item) }}</small>
                </div>
              </div>
              <p>{{ item.description || 'No description' }}</p>
              <div class="entity-meta">
                <span>{{ shortDate(item.updated_timestamp) }}</span>
                <span>Open</span>
              </div>
            </NuxtLink>
          </div>

          <p v-else class="empty-hint">Nothing here yet.</p>
        </div>
      </div>
    </section>

    <section class="content-panel">
      <div class="section-header">
        <h2>Recent activity</h2>
        <span>Latest changes inside the team</span>
      </div>

      <div v-if="recentItems.length" class="activity-list">
        <NuxtLink v-for="item in recentItems" :key="item.id" :to="resolveNodeLink(item)" class="activity-item">
          <div class="activity-icon" :class="getAppAccent(item.color as number, true)">
            <Icon :name="resolveIcon(item)" />
          </div>
          <div class="activity-copy">
            <strong>{{ item.name }}</strong>
            <span>{{ resolveNodeType(item) }} · {{ shortDate(item.updated_timestamp) }}</span>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="empty-hint">No activity yet.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import NodePermissions from '~/components/Node/Modals/Permissions.vue';
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import { resolveIcon, resolveNodeLink, resolveNodeType } from '~/helpers/node';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Node } from '~/stores';

definePageMeta({
  breadcrumb: (route: RouteLocationNormalizedLoaded) => useBreadcrumbs().generateBreadcrumbsById(route.params.id as string),
});

const nodesStore = useNodesStore();
const route = useRoute();
const modals = useModal();
const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();

const teamId = route.params.id as string;
const team = ref<Node | undefined>();

watchEffect(() => {
  team.value = nodesStore.getById(teamId);
  if (team.value && team.value.partial) {
    void nodesStore.fetch({ id: teamId }).then(fetched => (team.value = fetched));
  }
});

const allItems = computed(() => (team.value ? nodesStore.getAllChildrens(team.value.id).filter(item => item.id !== team.value?.id) : []));
const directChildren = computed(() => (team.value ? nodesStore.getChilds(team.value.id) : []));
const countByRole = (role: number) => allItems.value.filter(item => item.role === role).length;

const structureSections = computed(() => [
  { title: 'Workspaces', items: directChildren.value.filter(item => item.role === 1) },
  { title: 'Categories', items: directChildren.value.filter(item => item.role === 2) },
  { title: 'Documents', items: directChildren.value.filter(item => item.role === 3) },
  { title: 'Resources', items: directChildren.value.filter(item => item.role === 4) },
]);

const recentItems = computed(() => allItems.value.toSorted((a, b) => b.updated_timestamp - a.updated_timestamp).slice(0, 8));

const openCreateWorkspace = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1, parentId: teamId }, size: 'small' }));
const openCreateCategory = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 2, parentId: teamId }, size: 'small' }));
const openPermissions = () => team.value && modals.add(new Modal(shallowRef(NodePermissions), { props: { node: team.value }, size: 'small' }));
const openDelete = () =>
  team.value && modals.add(new Modal(shallowRef(NodeDeleteModal), { size: 'small', props: { node: team.value, redirect: '/dashboard/teams' } }));
</script>

<style scoped lang="scss">
.team-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.team-hero,
.content-panel,
.stat-card,
.section-block,
.entity-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface-base);
  box-shadow: var(--shadow-sm);
}

.team-hero {
  display: flex;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 20%, transparent), transparent 28%),
    linear-gradient(135deg, var(--surface-base), var(--surface-raised));
  justify-content: space-between;
  gap: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.team-ident {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1;
}

.team-avatar {
  display: grid;
  width: 96px;
  height: 96px;
  border-radius: 28px;
  background: var(--surface-overlay);
  place-items: center;
  overflow: hidden;
  flex: none;
}

.team-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.description {
  max-width: 70ch;
  margin: 0.5rem 0 0.9rem;
  color: var(--text-secondary);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-chip {
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  color: var(--text-secondary);
  background: var(--surface-overlay);
  font-size: 0.84rem;
  font-weight: 600;
}

.team-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat-card {
  padding: 1rem;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
}

.stat-label {
  color: var(--text-secondary);
}

.content-panel {
  padding: 1.25rem;
}

.section-header {
  display: flex;
  margin-bottom: 1rem;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: baseline;

  h2 {
    margin: 0;
  }

  span {
    color: var(--text-secondary);
  }
}

.section-grid {
  display: grid;
  gap: 1rem;
}

.section-block {
  padding: 1rem;
}

.section-block-header {
  display: flex;
  margin-bottom: 0.75rem;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;

  h3 {
    margin: 0;
  }

  span {
    color: var(--text-secondary);
    font-weight: 600;
  }
}

.card-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.entity-card {
  display: flex;
  padding: 0.9rem;
  color: var(--text-body);
  gap: 0.75rem;
  flex-direction: column;
  text-decoration: none;

  strong {
    display: block;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
  }
}

.entity-card-head {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.entity-icon {
  display: grid;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  place-items: center;
  flex: none;
}

.entity-copy {
  min-width: 0;

  small {
    color: var(--text-secondary);
  }
}

.entity-meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.84rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.activity-item {
  display: flex;
  padding: 0.8rem;
  border-radius: var(--radius-lg);
  color: var(--text-body);
  background: var(--surface-overlay);
  gap: 0.75rem;
  align-items: center;
  text-decoration: none;
}

.activity-icon {
  display: grid;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  place-items: center;
  flex: none;
}

.activity-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;

  span {
    color: var(--text-secondary);
  }
}

.empty-hint {
  margin: 0;
  color: var(--text-secondary);
}

@media screen and (width <= 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (width <= 700px) {
  .team-ident {
    flex-direction: column;
  }

  .team-actions {
    justify-content: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
