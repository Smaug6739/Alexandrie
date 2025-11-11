<template>
  <section class="about-view">
    <header class="about-view__header">
      <h2>Alexandrie</h2>
      <p class="about-view__description">
        Open-source knowledge management platform designed for fast note-taking, flexible organisation, and collaborative workspaces.
      </p>
    </header>

    <dl class="about-view__details">
      <div>
        <dt>Version</dt>
        <dd>{{ version }}</dd>
      </div>
      <div>
        <dt>License</dt>
        <dd>{{ license }}</dd>
      </div>
      <div>
        <dt>Source</dt>
        <dd>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" rel="noopener">github.com/Smaug6739/Alexandrie</NuxtLink>
        </dd>
      </div>
    </dl>

    <p class="about-view__cta">
      Looking for a full overview? Visit the public <NuxtLink to="/about">About Alexandrie</NuxtLink> page.
    </p>
  </section>
</template>

<script setup lang="ts">
import pkg from '~/../package.json';

const version = pkg.version ?? 'unknown';
const license = pkg.license ?? 'MIT';
</script>

<style scoped lang="scss">
.about-view {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-view__header h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.about-view__description {
  margin: 0;
  color: var(--font-color-light);
  line-height: 1.6;
}

.about-view__details {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin: 0;
}

.about-view__details dt {
  font-weight: 600;
  color: var(--font-color);
}

.about-view__details dd {
  margin: 0.25rem 0 0;
  color: var(--font-color-light);
  word-break: break-word;
}

.about-view__cta {
  margin: 0;
  color: var(--font-color-light);
}

.about-view__cta a {
  color: var(--primary);
  font-weight: 600;
}
</style>
