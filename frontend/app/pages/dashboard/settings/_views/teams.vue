<template>
  <section>
    <h2>Teams</h2>
    <NodeCardTeam v-for="team in store.teams" :key="team.id" :team="team" @click="emit('close')" />
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'close'): void }>();

const store = useNodesStore();
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
