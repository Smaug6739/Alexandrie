<template>
  <NuxtLink :to="resolveNodeLink(team)" @click="emit('click')">
    <div class="top">
      <div class="avatar" :class="getAppAccent(team.color as number, true)">
        <img v-if="team.thumbnail" :src="team.thumbnail" :alt="team.name" class="thumbnail" />
        <Icon v-else :name="resolveIcon(team)" display="xl" />
      </div>
      <div class="title">
        <h2>{{ team.name }}</h2>
        <p>{{ team.description || t('teams.noDescription') }}</p>
      </div>
    </div>

    <NodeStats :parent-id="team.id" />

    <div class="team-footer">
      <span class="team-meta">Updated {{ shortDate(team.updated_timestamp) }}</span>
      <span class="team-open">Open team</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { resolveIcon, resolveNodeLink } from '~/helpers/node';
import type { Node } from '~/stores';

defineProps<{ team: Node }>();
const emit = defineEmits<{ (e: 'click'): void }>();

const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();
const { t } = useI18nT();
</script>
<style scoped lang="scss">
a {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 220px;
  padding: 1.1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  color: var(--text-body);
  text-decoration: none;
  background: linear-gradient(180deg, var(--surface-base), var(--surface-raised));
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
}

.top {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  display: grid;
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 22px;
  overflow: hidden;
  place-items: center;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
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

.team-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.team-meta {
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.team-open {
  font-weight: 700;
  color: var(--primary);
}
</style>
