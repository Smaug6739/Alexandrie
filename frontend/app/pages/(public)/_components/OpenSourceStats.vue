<template>
  <section class="oss-stats">
    <h2>Open-source by design</h2>
    <p class="subtitle">Transparent, self-hostable, and built with the community</p>
    <div class="stats-grid">
      <div class="stat">
        <div class="value">{{ starsDisplay }}</div>
        <div class="label">GitHub stars</div>
      </div>
      <div class="stat">
        <div class="value">{{ contributorsDisplay }}</div>
        <div class="label">Contributors</div>
      </div>
      <div class="stat">
        <div class="value">{{ latestRelease || '-' }}</div>
        <div class="label">Latest release</div>
      </div>
    </div>
    <div class="actions">
      <a :href="`https://github.com/${owner}/${repo}`" target="_blank" class="btn github">Star on GitHub</a>
      <NuxtLink :prefetch="false" to="/dashboard" class="btn try">Try the app</NuxtLink>
      <a :href="`https://github.com/${owner}/${repo}/contribute`" target="_blank" class="btn contribute">Contribute</a>
    </div>
  </section>
</template>

<script setup lang="ts">
const owner = 'Smaug6739';
const repo = 'Alexandrie';

const stars = ref<number | null>(null);
const contributors = ref<number | null>(null);
const latestRelease = ref<string>('');

const starsDisplay = computed(() => (stars.value === null ? '-' : Intl.NumberFormat().format(stars.value)));
const contributorsDisplay = computed(() => (contributors.value === null ? '-' : String(contributors.value)));

async function fetchRepo() {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (res.ok) {
      const data = await res.json();
      stars.value = data.stargazers_count ?? null;
    }
  } catch {
    stars.value = null;
  }
}

async function fetchContributors() {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100&anon=0`);
    if (res.ok) {
      const list = await res.json();
      contributors.value = Array.isArray(list) ? list.length : null;
    }
  } catch {
    contributors.value = null;
  }
}

async function fetchLatestRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    if (res.ok) {
      const rel = await res.json();
      latestRelease.value = rel.tag_name || rel.name || '';
    }
  } catch {
    latestRelease.value = '';
  }
}

onMounted(() => {
  fetchRepo();
  fetchContributors();
  fetchLatestRelease();
});
</script>

<style scoped lang="scss">
.oss-stats {
  max-width: 1100px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
}

.subtitle {
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  max-width: 760px;
  margin: 1.5rem auto 0.75rem;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.stat {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-contrast);
}

.value {
  font-size: 28px;
  font-weight: 700;
}

.label {
  font-size: 13px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.btn {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
}

.btn.github {
  background: var(--bg-color);
}

.btn.try {
  border-color: var(--primary);
  color: white;
  background: var(--primary);
}

.btn.contribute {
  background: var(--bg-contrast);
}
</style>
