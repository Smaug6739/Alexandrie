<template>
  <article v-if="stats.length >= 2" class="chart-card">
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="sparkline" role="img" aria-label="Nodes monthly growth chart">
      <polyline :points="points" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" vector-effect="non-scaling-stroke" />
    </svg>
    <ul class="month-row">
      <li v-for="item in stats" :key="`nodes-${item.month}`">{{ formatMonth(item.month) }}</li>
    </ul>
  </article>
  <article v-else class="chart-card">
    <p>Not enough data to display insights. Please add more nodes to this team or come back later to see the insights.</p>
  </article>
</template>

<script setup lang="ts">
import type { MonthlyCount } from '~/stores';

const props = defineProps<{
  stats: MonthlyCount[];
}>();

function formatMonth(month: string): string {
  const monthIndex = Number(month) - 1;
  const parsed = new Date(Date.UTC(Number(new Date().getFullYear()), monthIndex, 1));
  return parsed.toLocaleDateString(undefined, { month: 'short' });
}

const points = computed(() => toPolyline(props.stats));

function toPolyline(series: MonthlyCount[]): string {
  if (!series?.length) return '0,40 100,40';
  const values = series.map(item => Math.max(0, item.count ?? 0));
  const max = Math.max(...values, 1);
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 40 - (value / max) * 34 - 3;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}
</script>

<style scoped>
.sparkline {
  width: 100%;
  height: 120px;
  color: var(--primary);
}

.month-row {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  font-size: 0.72rem;
  color: var(--text-muted);
  text-align: center;
  list-style: none;
}
</style>
