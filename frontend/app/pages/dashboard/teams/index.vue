<template>
  <div class="page-card teams-index">
    <Teleport to="#navbar-title">{{ t('teams.title') }}</Teleport>
    <header class="hero">
      <div>
        <p class="eyebrow">{{ t('teams.eyebrown') }}</p>
        <p class="subtitle">{{ t('teams.subtitle') }}</p>
      </div>
      <div class="hero-actions">
        <AppButton type="primary" @click="openCreateTeam">{{ t('teams.actions.create') }}</AppButton>
        <NuxtLink to="/dashboard/join-workspace">
          <AppButton type="secondary">{{ t('nodes.modals.join.title') }}</AppButton>
        </NuxtLink>
      </div>
    </header>

    <section class="toolbar">
      <div class="search-box">
        <Icon name="search" />
        <input v-model="query" type="text" placeholder="Search teams" />
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="count-pill">{{ filteredTeams.length }} {{ t('teams.teamsCount') }}</div>
        <ViewSelection v-model="view" :show-graph="true" />
      </div>
    </section>

    <div v-if="view === 'graph'">
      <GraphView :nodes="graphTeams" @node-click="(node) => router.push(`/dashboard/teams/${node.id}`)" />
    </div>
    
    <section v-else-if="filteredTeams.length" class="team-grid">
      <NodeCardTeam v-for="team in filteredTeams" :key="team.id" :team="team" />
    </section>

    <NoContent v-else :title="t('teams.actions.noTeams')" :description="t('teams.actions.createDescription')">
      <AppButton type="primary" @click="openCreateTeam">{{ t('teams.actions.create') }}</AppButton>
    </NoContent>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import ViewSelection, { type ViewMode } from '~/components/ViewSelection.vue';
import GraphView from '~/components/Node/GraphView.vue';
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

const nodesStore = useNodesStore();

const modals = useModal();
const router = useRouter();
const { t } = useI18nT();

const query = ref('');
const view = ref<ViewMode>('list');

const teams = computed(() => nodesStore.teams.toSorted((a, b) => a.name.localeCompare(b.name)));
const filteredTeams = computed(() => {
  const search = query.value.trim().toLowerCase();
  if (!search) return teams.value;
  return teams.value.filter(team => `${team.name} ${team.description || ''}`.toLowerCase().includes(search));
});

const openCreateTeam = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 0, parentId: undefined }, size: 'small' }));

// For graph view, we need TreeItem format
const graphTeams = computed<TreeItem<Node>[]>(() => {
  return filteredTeams.value.map(team => {
    return {
      id: team.id,
      label: team.name,
      data: team,
      route: `/dashboard/teams/${team.id}`,
      children: [], // Teams could potentially have children, but keeping it flat for now as requested
    };
  });
});
</script>

<style scoped lang="scss">
.teams-index {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 18%, transparent), transparent 28%),
    linear-gradient(135deg, var(--surface-base), var(--surface-raised));
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
}

.subtitle {
  max-width: 60ch;
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
}

.hero-actions,
.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: min(520px, 100%);
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);

  input {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
  }
}

.count-pill {
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-raised);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  :last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}

@media (width <= 768px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
