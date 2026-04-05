<template>
  <div class="admin-dashboard page-card">
    <header class="admin-header">
      <div>
        <h1>{{ t('admin.dashboard.title') }}</h1>
        <p>{{ t('admin.dashboard.description') }}</p>
      </div>
      <AppButton type="primary" @click="router.push('/dashboard/admin/users')">{{ t('admin.dashboard.manageUsers') }}</AppButton>
    </header>

    <div v-if="store.loadingStats" class="stats-loading">
      <Loader />
      <span>{{ t('admin.dashboard.loading') }}</span>
    </div>

    <div v-else-if="store.statsError" class="stats-error">{{ t('admin.dashboard.error') }}: {{ store.statsError }}</div>

    <template v-else>
      <section class="kpi-grid">
        <article class="kpi-card">
          <p class="kpi-label">{{ t('admin.dashboard.cards.totalUsers') }}</p>
          <p class="kpi-value">{{ formatNumber(store.stats.overview.total_users) }}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-label">{{ t('admin.dashboard.cards.totalNodes') }}</p>
          <p class="kpi-value">{{ formatNumber(store.stats.overview.total_nodes) }}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-label">{{ t('admin.dashboard.cards.totalStorage') }}</p>
          <p class="kpi-value">{{ readableFileSize(store.stats.overview.total_size) }}</p>
        </article>
      </section>

      <section class="chart-grid">
        <article class="chart-card">
          <h2>{{ t('admin.dashboard.charts.usersGrowth') }}</h2>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="sparkline" role="img" aria-label="Users monthly growth chart">
            <polyline :points="usersPoints" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" vector-effect="non-scaling-stroke" />
          </svg>
          <ul class="month-row">
            <li v-for="item in store.stats.users.growth_last_12_months" :key="`users-${item.month}`">{{ formatMonth(item.month) }}</li>
          </ul>
        </article>

        <article class="chart-card">
          <h2>{{ t('admin.dashboard.charts.nodesGrowth') }}</h2>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="sparkline" role="img" aria-label="Nodes monthly growth chart">
            <polyline :points="nodesPoints" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" vector-effect="non-scaling-stroke" />
          </svg>
          <ul class="month-row">
            <li v-for="item in store.stats.nodes.growth_last_12_months" :key="`nodes-${item.month}`">{{ formatMonth(item.month) }}</li>
          </ul>
        </article>
      </section>

      <section class="top-grid">
        <article class="top-card">
          <h2>{{ t('admin.dashboard.top.byNodes') }}</h2>
          <table>
            <thead>
              <tr>
                <th>{{ t('admin.dashboard.top.user') }}</th>
                <th>{{ t('admin.dashboard.top.nodes') }}</th>
                <th>{{ t('admin.dashboard.top.storage') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in store.stats.nodes.top_users_by_nodes" :key="`n-${row.user_id}`">
                <td>
                  <NuxtLink :to="`/dashboard/admin/users/${row.user_id}`">{{ row.username }}</NuxtLink>
                </td>
                <td>{{ formatNumber(row.node_count) }}</td>
                <td>{{ readableFileSize(row.total_size) }}</td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="top-card">
          <h2>{{ t('admin.dashboard.top.byStorage') }}</h2>
          <table>
            <thead>
              <tr>
                <th>{{ t('admin.dashboard.top.user') }}</th>
                <th>{{ t('admin.dashboard.top.nodes') }}</th>
                <th>{{ t('admin.dashboard.top.storage') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in store.stats.nodes.top_users_by_size" :key="`s-${row.user_id}`">
                <td>
                  <NuxtLink :to="`/dashboard/admin/users/${row.user_id}`">{{ row.username }}</NuxtLink>
                </td>
                <td>{{ formatNumber(row.node_count) }}</td>
                <td>{{ readableFileSize(row.total_size) }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { readableFileSize } from '~/helpers/resources';
import type { MonthlyCount } from '~/stores';

const router = useRouter();
const { t } = useI18nT();

const store = useAdminStore();

void store.fetchAll();
void store.fetchStats().catch(() => undefined);

const usersPoints = computed(() => toPolyline(store.stats.users.growth_last_12_months));
const nodesPoints = computed(() => toPolyline(store.stats.nodes.growth_last_12_months));

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value || 0);
}

function formatMonth(month: string): string {
  const [year, rawMonth] = month.split('-');
  const monthIndex = Number(rawMonth) - 1;
  const parsed = new Date(Date.UTC(Number(year), monthIndex, 1));
  return parsed.toLocaleDateString(undefined, { month: 'short' });
}

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

<style scoped lang="scss">
a:hover {
  color: var(--primary);
}
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.stats-loading,
.stats-error {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.stats-error {
  color: var(--red);
}

.kpi-grid,
.chart-grid,
.top-grid {
  display: grid;
  gap: 0.9rem;
}

.kpi-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.chart-grid,
.top-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.kpi-card,
.chart-card,
.top-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem;
  background: radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 11%, transparent), transparent 54%), var(--background-100);
}

.kpi-label {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.kpi-value {
  margin: 0.35rem 0 0;
  font-weight: 700;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
}

.sparkline {
  width: 100%;
  height: 120px;
  color: var(--primary);
}

.month-row {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  padding: 0;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.72rem;
  gap: 0.2rem;
  text-align: center;
}

table {
  width: 100%;
}

@media screen and (width <= 900px) {
  .admin-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .chart-grid,
  .top-grid {
    grid-template-columns: 1fr;
  }

  .month-row {
    font-size: 0.65rem;
  }
}
</style>
