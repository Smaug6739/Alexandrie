<template>
  <section>
    <div>
      <h2>Create Team</h2>
      <label for="name">{{ t('common.labels.name') }}</label>
      <input id="name" v-model="category.name" class="entry" type="text" required :placeholder="t('common.labels.name')" />
      <div style="min-width: 200px; flex: 1; margin-left: 10px">
        <label for="color">{{ t('common.labels.color') }}</label>
        <AppColorPicker id="color" v-model="category.color" class="entry" nullable />
      </div>
      <div class="footer">
        <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
        <AppButton type="primary" @click="createTeam">{{ t('common.actions.create') }}</AppButton>
      </div>
    </div>
    <div class="teams-list">
      <h2>Teams</h2>
      <ul>
        <li v-for="team in store.teams" :key="team.id">
          <span>{{ team.name }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const emit = defineEmits(['close']);

const store = useNodesStore();

const { t } = useI18nT();

const category = ref<Partial<Node>>({
  accessibility: 1,
  name: '',
  role: 0,
});

const createTeam = () => {
  store
    .post(category.value)
    .then(() => {
      useNotifications().add({ title: t('nodes.category.notifications.created'), type: 'success' });
      emit('close');
    })
    .catch(e => useNotifications().add({ message: e, title: t('nodes.category.notifications.creationError'), type: 'error' }));
};
</script>

<style scoped lang="scss">
label {
  margin: 5px 0;
}

.entry {
  background: var(--surface-base);
}
</style>
