<template>
  <section>
    <h2>Teams</h2>
    <NodeCardTeam v-for="team in store.teams" :key="team.id" :team="team" @click="emit('close')" />

    <NoContent v-if="!store.teams.length" :title="t('teams.actions.noTeams')" :description="t('teams.actions.createDescription')">
      <AppButton type="primary" @click="openCreateTeam">{{ t('teams.actions.create') }}</AppButton>
    </NoContent>
  </section>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';

const emit = defineEmits<{ (e: 'close'): void }>();

const store = useNodesStore();

const { t } = useI18nT();
const modals = useModal();

const openCreateTeam = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 0, parentId: undefined }, size: 'small' }));
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
