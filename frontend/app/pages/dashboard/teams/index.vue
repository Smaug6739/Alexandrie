<template>
  <div class="page-card teams-index">
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Organization view</p>
        <h1>Teams</h1>
        <p class="subtitle">Teams group workspaces, categories, documents, and resources in one shared organization shell.</p>
      </div>
      <div class="hero-actions">
        <AppButton type="primary" @click="openCreateTeam">Create team</AppButton>
        <NuxtLink to="/dashboard/join-workspace"><AppButton type="secondary">Join workspace</AppButton></NuxtLink>
      </div>
    </header>

    <section class="toolbar">
      <div class="search-box">
        <Icon name="search" />
        <input v-model="query" type="text" placeholder="Search teams" />
      </div>
      <div class="count-pill">{{ filteredTeams.length }} teams</div>
    </section>

    <section v-if="filteredTeams.length" class="team-grid">
      <NuxtLink v-for="team in filteredTeams" :key="team.id" :to="resolveNodeLink(team)" class="team-card">
        <div class="team-card-top">
          <div class="team-avatar" :class="getAppAccent(team.color as number, true)">
            <img v-if="team.thumbnail" :src="team.thumbnail" :alt="team.name" class="team-thumbnail" />
            <Icon v-else :name="resolveIcon(team)" display="xl" />
          </div>
          <div class="team-title">
            <h2>{{ team.name }}</h2>
            <p>{{ team.description || 'No description yet' }}</p>
          </div>
        </div>

        <div class="team-stats">
          <div class="stat">
            <span>{{ countByRole(team.id, 1) }}</span
            ><small>Workspaces</small>
          </div>
          <div class="stat">
            <span>{{ countByRole(team.id, 2) }}</span
            ><small>Categories</small>
          </div>
          <div class="stat">
            <span>{{ countByRole(team.id, 3) }}</span
            ><small>Documents</small>
          </div>
          <div class="stat">
            <span>{{ countByRole(team.id, 4) }}</span
            ><small>Resources</small>
          </div>
        </div>

        <div class="team-footer">
          <span class="team-meta">Updated {{ shortDate(team.updated_timestamp) }}</span>
          <span class="team-open">Open team</span>
        </div>
      </NuxtLink>
    </section>

    <NoContent v-else title="No teams yet" description="Create the first team to start grouping workspaces and documents.">
      <AppButton type="primary" @click="openCreateTeam">Create team</AppButton>
    </NoContent>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import { resolveIcon, resolveNodeLink } from '~/helpers/node';

definePageMeta({ breadcrumb: { i18n: 'components.sidebar.nav.teams' } });

const nodesStore = useNodesStore();
const nodesTree = useNodesTree();
const modals = useModal();
const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();

const query = ref('');

const teams = computed(() => nodesStore.teams.toSorted((a, b) => a.name.localeCompare(b.name)));
const filteredTeams = computed(() => {
  const search = query.value.trim().toLowerCase();
  if (!search) return teams.value;
  return teams.value.filter(team => `${team.name} ${team.description || ''}`.toLowerCase().includes(search));
});

const countByRole = (teamId: string, role: number) =>
  nodesTree.getSubtreeAsArray(teamId).filter(node => node.data.id !== teamId && node.data.role === role).length;

const openCreateTeam = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 0, parentId: undefined }, size: 'small' }));
</script>

<style scoped lang="scss">
.teams-index {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero {
  display: flex;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 18%, transparent), transparent 28%),
    linear-gradient(135deg, var(--surface-base), var(--surface-raised));
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
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
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  display: flex;
  min-width: min(520px, 100%);
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  align-items: center;
  gap: 0.75rem;

  input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
  }
}

.count-pill {
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  color: var(--text-secondary);
  background: var(--surface-raised);
  font-size: 0.9rem;
  font-weight: 600;
}

.team-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.team-card {
  display: flex;
  min-height: 220px;
  padding: 1.1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  color: var(--text-body);
  background: linear-gradient(180deg, var(--surface-base), var(--surface-raised));
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  flex-direction: column;
  gap: 1rem;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-lg);
  }
}

.team-card-top {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.team-avatar {
  display: grid;
  width: 72px;
  height: 72px;
  border-radius: 22px;
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

.team-title {
  min-width: 0;

  h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.3rem 0 0;
    color: var(--text-secondary);
  }
}

.team-stats {
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat {
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  background: var(--surface-overlay);

  span {
    display: block;
    font-size: 1.1rem;
    font-weight: 700;
  }

  small {
    color: var(--text-secondary);
  }
}

.team-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  margin-top: auto;
}

.team-meta {
  color: var(--text-secondary);
  font-size: 0.86rem;
}

.team-open {
  font-weight: 700;
  color: var(--primary);
}

@media screen and (width <= 800px) {
  .team-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
