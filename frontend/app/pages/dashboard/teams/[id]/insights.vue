<template>
  <div class="page-card">
    <Teleport to="#navbar-title"><Icon name="insights" display="lg" /> {{ t('teams.insights.title') }}</Teleport>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>
    <h2>{{ t('teams.insights.trending') }}</h2>
    <Trending :stats="stats" />
    <h2>{{ t('teams.insights.stats') }}</h2>
    <NodeStats :parent-id="teamId" />
  </div>
</template>

<script setup lang="ts">
import type { MonthlyCount } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'teams.insights.title' } });

const route = useRoute();
const tree = useNodesTree();
const { t } = useI18nT();

const teamId = route.params.id as string;

const stats = ref<MonthlyCount[]>([]);

watchEffect(() => {
  const nodes = tree.getSubtreeAsArray(teamId);
  for (const node of nodes) {
    const month = new Date(node.data.created_timestamp).toISOString().slice(5, 7);
    console.log('Month:', month, 'Node ID:', node.data.id);
    const existing = stats.value.find(item => item.month === month);
    if (existing) {
      existing.count++;
    } else {
      stats.value.push({ month, count: 1 });
    }
  }
  stats.value.sort((a, b) => a.month.localeCompare(b.month));
});
</script>
