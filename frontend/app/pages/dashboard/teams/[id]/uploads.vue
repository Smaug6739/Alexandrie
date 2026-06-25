<template>
  <div>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>
    <NodeResourceCDN :parent-id="teamId" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'cdn.meta.title' } });

const route = useRoute();
const teamId = route.params.id as string;
</script>
