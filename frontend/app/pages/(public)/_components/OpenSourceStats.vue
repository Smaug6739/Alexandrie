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
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{ starsDisplay }}</div>
          <div class="stat-label">GitHub stars</div>
        </div>
        <div class="stat">
          <div class="stat-icon"><Icon name="users" display="xl" /></div>
          <div class="stat-value">{{ contributorsDisplay }}</div>
          <div class="stat-label">Contributors</div>
        </div>
        <div class="stat">
          <div class="stat-icon">🏷️</div>
          <div class="stat-value">{{ latestRelease || 'v1.0' }}</div>
          <div class="stat-label">Latest release</div>
        </div>
      </div>

      <div class="actions">
        <a :href="`https://github.com/${owner}/${repo}`" target="_blank" class="btn primary">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <polygon style="fill: white" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Star on GitHub
        </a>
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
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 6rem auto;
  padding: 2rem;
}

.stats-visual {
  position: relative;
}

.visual-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--bg-contrast), var(--bg-color));
  border-radius: 24px;
  overflow: hidden;
}

.code-lines {
  position: absolute;
  inset: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.code-line {
  height: 12px;
  width: var(--width);
  background: var(--border-color);
  border-radius: 6px;
  opacity: 0.4;
}

.github-card {
  position: relative;
  padding: 2rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.1);
  margin: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--font-color-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.card-stats {
  display: flex;
  gap: 1.5rem;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--font-color-light);

  svg {
    color: var(--primary);
  }
}

// Content Side
.stats-content {
  .section-tag {
    display: inline-block;
    padding: 6px 14px;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    color: white;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 100px;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--font-color-light);
    line-height: 1.7;
    margin-bottom: 2rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  padding: 1.25rem;
  background: var(--bg-contrast);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--primary);
  }
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 13px;
  color: var(--font-color-light);
  margin-top: 4px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;

  &.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }
  }

  &.secondary {
    background: var(--bg-color);
    color: var(--font-color);

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }

  &.tertiary {
    background: var(--bg-contrast);
    color: var(--font-color);

    &:hover {
      border-color: var(--primary);
    }
  }
}

@media screen and (max-width: 968px) {
  .oss-stats {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .stats-visual {
    order: 1;
  }

  .stats-content {
    text-align: center;
  }

  .actions {
    justify-content: center;
  }
}

@media screen and (max-width: 640px) {
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
