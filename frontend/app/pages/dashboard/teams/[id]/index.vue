<template>
  <div v-if="team" class="team-page">
    <Teleport to="#navbar-title">Team overview</Teleport>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>
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
        <AppButton type="danger" @click="openDelete">Delete team</AppButton>
      </div>
    </section>

    <section class="content">
      <AppBtnIcon icon="edit" style="position: absolute; top: 1rem; right: 1rem" @click="router.push(editLink)" />
      <NodeDocumentContentCompiled v-if="team.content_compiled" :node="team" />
      <NoContent v-else title="No team homepage" description="There is no content in this team homepage yet.">
        <NuxtLink :to="editLink">
          <AppButton type="link">Add content</AppButton>
        </NuxtLink>
      </NoContent>
    </section>
  </div>
</template>

<script setup lang="ts">
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import { resolveIcon } from '~/helpers/node';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Node } from '~/stores';

definePageMeta({
  breadcrumb: (route: RouteLocationNormalizedLoaded) => useBreadcrumbs().generateBreadcrumbsById(route.params.id as string),
});

const nodesStore = useNodesStore();

const nodesTree = useNodesTree();
const route = useRoute();
const modals = useModal();
const router = useRouter();
const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();

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
  flex-direction: column;
  gap: 1.25rem;
  margin: 1rem;
}

.team-hero {
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface-base);
  box-shadow: var(--shadow-sm);
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

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 100%;
  position: relative;
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
