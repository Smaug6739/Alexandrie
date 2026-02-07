<template>
  <section class="oss-stats">
    <div class="stats-visual">
      <div class="visual-bg">
        <div class="code-lines">
          <span v-for="i in 8" :key="i" class="code-line" :style="{ '--delay': `${i * 0.1}s`, '--width': `${40 + Math.random() * 50}%` }"></span>
        </div>
      </div>
      <div class="github-card">
        <div class="card-header">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          <span>{{ owner }}/{{ repo }}</span>
        </div>
        <p class="card-desc">The open-source workspace for developers who think in Markdown</p>
        <div class="card-stats">
          <div class="mini-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>{{ starsDisplay }}</span>
          </div>
          <div class="mini-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              ></path>
            </svg>
            <span>{{ contributorsDisplay }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-content">
      <span class="section-tag">Open Source</span>
      <h2>Built in the open</h2>
      <p class="subtitle">Transparent development, community-driven decisions, and full access to the source code</p>

      <div class="stats-grid">
        <div class="stat">
          <div class="stat-icon"><Icon name="star" display="xl" /></div>
          <div class="stat-value">{{ starsDisplay }}</div>
          <div class="stat-label">GitHub stars</div>
        </div>
        <div class="stat">
          <div class="stat-icon"><Icon name="users" display="xl" /></div>
          <div class="stat-value">{{ contributorsDisplay }}</div>
          <div class="stat-label">Contributors</div>
        </div>
        <div class="stat">
          <div class="stat-icon"><Icon name="release" display="xl" /></div>
          <div class="stat-value">{{ latestRelease || 'v1.0' }}</div>
          <div class="stat-label">Latest release</div>
        </div>
      </div>

      <div class="actions-row">
        <NuxtLink :to="`https://github.com/${owner}/${repo}`" target="_blank" class="btn primary">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <polygon
              style="fill: white !important"
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
          Star on GitHub
        </NuxtLink>
        <NuxtLink :prefetch="false" to="/dashboard" class="btn secondary">Try the app</NuxtLink>
        <a :href="`https://github.com/${owner}/${repo}/contribute`" target="_blank" class="btn tertiary">Contribute</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const owner = 'Smaug6739';
const repo = 'Alexandrie';

const stars = ref<number | null>(null);
const contributors = ref<number | null>(null);
const latestRelease = ref<string>('');

const starsDisplay = computed(() => (stars.value === null ? '—' : Intl.NumberFormat().format(stars.value)));
const contributorsDisplay = computed(() => (contributors.value === null ? '—' : String(contributors.value)));

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
  display: grid;
  max-width: 1200px;
  margin: 6rem auto;
  padding: 2rem;
  align-items: center;
  gap: 4rem;
  grid-template-columns: 1fr 1fr;
}

.stats-visual {
  position: relative;
}

.visual-bg {
  position: absolute;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--surface-raised), var(--surface-base));
  inset: 0;
  overflow: hidden;
}

.code-lines {
  position: absolute;
  display: flex;
  padding: 2rem;
  flex-direction: column;
  gap: 12px;
  inset: 0;
}

.code-line {
  width: var(--width);
  height: 12px;
  border-radius: 6px;
  background: var(--border);
  opacity: 0.4;
}

.github-card {
  position: relative;
  margin: 2rem;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface-base);
  box-shadow: 0 25px 80px rgb(0 0 0 / 10%);
}

.card-header {
  display: flex;
  font-weight: 600;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.card-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.card-stats {
  display: flex;
  gap: 1.5rem;
}

.mini-stat {
  display: flex;
  font-size: 14px;
  color: var(--text-secondary);
  align-items: center;
  gap: 6px;

  svg {
    color: var(--primary);
  }
}

// Content Side
.stats-content {
  .section-tag {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    letter-spacing: 1px;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
}

.stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 2rem;
}

.stat {
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  text-align: center;
  background: var(--surface-raised);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-4px);
  }
}

.stat-icon {
  display: flex;
  margin: 0.5rem;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.btn {
  display: inline-flex;
  padding: 12px 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &.primary {
    border-color: var(--primary);
    color: white;
    background: var(--primary);

    &:hover {
      box-shadow: 0 8px 20px rgb(99 102 241 / 30%);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    color: var(--text-body);
    background: var(--surface-base);

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }

  &.tertiary {
    color: var(--text-body);
    background: var(--surface-raised);

    &:hover {
      border-color: var(--primary);
    }
  }
}

@media screen and (width <= 968px) {
  .oss-stats {
    gap: 2rem;
    grid-template-columns: 1fr;
  }

  .stats-visual {
    order: 1;
  }

  .stats-content {
    text-align: center;
  }

  .actions-row {
    justify-content: center;
  }
}

@media screen and (width <= 640px) {
  .oss-stats {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .github-card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
