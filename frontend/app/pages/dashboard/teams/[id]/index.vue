<template>
  <div v-if="team" class="team-page">
    <Teleport to="#navbar-title">{{ t('teams.overview.title') }}</Teleport>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>
    <section class="team-hero">
      <div class="team-ident">
        <div class="team-avatar" :class="getAppAccent(team.color as number, true)">
          <img v-if="team.thumbnail" :src="team.thumbnail" :alt="team.name" class="team-thumbnail" />
          <Icon v-else :name="resolveIcon(team)" display="xxl" />
        </div>
        <div class="team-copy">
          <p class="eyebrow">{{ t('teams.overview.team') }}</p>
          <h1>{{ team.name }}</h1>
          <p class="description">{{ team.description || t('teams.noDescription') }}</p>
          <div class="meta-row">
            <span class="meta-chip">{{ directChildren.length }} {{ t('teams.overview.directItems') }}</span>
            <span class="meta-chip">{{ allItems.length }} {{ t('teams.overview.totalNodes') }}</span>
            <span class="meta-chip">Updated {{ shortDate(team.updated_timestamp) }}</span>
          </div>
        </div>
      </div>

      <div class="team-actions">
        <AppButton type="primary" @click="openCreateWorkspace">{{ t('nodes.container.newWorkspace') }}</AppButton>
        <AppButton type="secondary" @click="openCreateCategory"> {{ t('nodes.container.newCategory') }}</AppButton>
        <NuxtLink :to="`/dashboard/docs/new?parent_id=${team.id}`">
          <AppButton type="secondary">{{ t('dashboard.actions.newDocument') }}</AppButton>
        </NuxtLink>
        <AppButton type="danger" @click="openDelete">{{ t('teams.actions.delete') }}</AppButton>
      </div>
    </section>

    <section class="content">
      <AppBtnIcon icon="edit" style="position: absolute; top: 1rem; right: 1rem" @click="router.push(editLink)" />
      <NodeDocumentContentCompiled v-if="team.content_compiled" :node="team" />
      <NoContent v-else :title="t('teams.overview.homepageNoContentTitle')" :description="t('teams.overview.homepageNoContent')">
        <NuxtLink :to="editLink">
          <AppButton type="link">{{ t('teams.actions.addContent') }}</AppButton>
        </NuxtLink>
      </NoContent>
    </section>
  </div>
</template>

<script setup lang="ts">
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import { resolveIcon } from '~/helpers/node';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'teams.overview.title' } });

const nodesStore = useNodesStore();

const nodesTree = useNodesTree();
const route = useRoute();
const modals = useModal();
const router = useRouter();
const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();
const { t } = useI18nT();

const teamId = route.params.id as string;
const team = ref<Node | undefined>();

watchEffect(() => {
  team.value = nodesStore.getById(teamId);
  if (team.value && team.value.partial) {
    nodesStore.fetch({ id: teamId }).then(fetched => (team.value = fetched));
  }
});

const allItems = computed(() => (team.value ? nodesTree.getChildren(team.value.id).filter(item => item.id !== team.value?.id) : []));
const editLink = computed(() => (team.value ? `/dashboard/docs/edit/${team.value.id}?redirect=/dashboard/teams/${team.value.id}` : ''));
const directChildren = computed(() => (team.value ? nodesTree.getChildren(team.value.id) : []));

const openCreateWorkspace = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1, parentId: teamId } }));
const openCreateCategory = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 2, parentId: teamId } }));
const openDelete = () => team.value && modals.add(new Modal(shallowRef(NodeDeleteModal), { props: { node: team.value, redirect: '/dashboard/teams' } }));
</script>

<style scoped lang="scss">
.team-page {
  display: flex;
  margin: 1rem;
  flex-direction: column;
  gap: 1.25rem;
}

.team-hero {
  display: flex;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 20%, transparent), transparent 28%),
    linear-gradient(135deg, var(--surface-base), var(--surface-raised));
  box-shadow: var(--shadow-sm);
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
}

.team-ident {
  display: flex;
  align-items: flex-start;
  flex: 1;
  gap: 1rem;
}

.team-avatar {
  display: grid;
  width: 96px;
  height: 96px;
  border-radius: 28px;
  flex: none;
  overflow: hidden;
  place-items: center;
}

.team-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  letter-spacing: 0.18em;
  text-transform: uppercase;
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
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-overlay);
}

.team-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.content {
  position: relative;
  display: flex;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  flex-direction: column;
  gap: 1.5rem;
}

@media screen and (width <= 700px) {
  .team-ident {
    flex-direction: column;
  }

  .team-actions {
    justify-content: flex-start;
  }
}
</style>
