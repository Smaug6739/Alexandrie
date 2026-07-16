<template>
  <section class="showcase-section">
    <div class="section-header">
      <h2 class="section-title">{{ t('landing.showcase.title') }}</h2>
      <p class="section-subtitle">{{ t('landing.showcase.subtitle') }}</p>
    </div>

    <div class="showcase-container">
      <div class="showcase-nav">
        <button v-for="(item, index) in features" :key="index" class="nav-item" :class="{ active: activeIndex === index }" @click="setActive(index)">
          <span class="nav-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="nav-content">
            <span class="nav-title">{{ item.title }}</span>
            <span class="nav-desc">{{ item.shortDesc }}</span>
          </div>
          <div v-if="activeIndex === index" class="nav-progress">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
        </button>
      </div>

      <div class="showcase-display">
        <div class="display-wrapper">
          <TransitionGroup name="fade">
            <div v-for="(item, index) in features" v-show="activeIndex === index" :key="index" class="display-item">
              <div class="display-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <ul class="feature-list">
                  <li v-for="(point, i) in item.points" :key="i">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {{ point }}
                  </li>
                </ul>
              </div>
              <div class="display-visual">
                <div class="visual-frame">
                  <img :src="item.image" :alt="item.title" loading="lazy" />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, tm, locale } = useI18n();

const features = computed(() => {
  void locale.value;
  return [
    { ...tm('landing.showcase.features.0'), image: '/screenshots/mock/1.png' },
    { ...tm('landing.showcase.features.1'), image: '/screenshots/mock/2.png' },
    { ...tm('landing.showcase.features.2'), image: '/screenshots/mock/3.png' },
    { ...tm('landing.showcase.features.3'), image: '/screenshots/mock/4.png' },
  ] as Array<{ title: string; shortDesc: string; description: string; points: string[]; image: string }>;
});

const activeIndex = ref(0);
const progress = ref(0);
const intervalId = ref<number | null>(null);

function setActive(index: number) {
  activeIndex.value = index;
  progress.value = 0;
  resetInterval();
}

function resetInterval() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
}

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped lang="scss">
.showcase-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-header {
  margin-bottom: 4rem;
  text-align: center;
}

.section-title {
  margin-bottom: 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.section-subtitle {
  max-width: 500px;
  margin: 0 auto;
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.showcase-container {
  display: grid;
  align-items: start;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
}

.showcase-nav {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  text-align: left;
  background: var(--surface-base);
  cursor: pointer;
  transition:
    border-color $transition-medium ease,
    transform $transition-medium ease,
    background-color $transition-medium ease,
    box-shadow $transition-medium ease;
  overflow: hidden;

  &:hover {
    border-color: var(--primary);
    transform: translateX(4px);
  }

  &.active {
    border-color: var(--primary);
    background: var(--surface-raised);
    box-shadow: 0 10px 40px rgb(99 102 241 / 15%);

    .nav-number {
      color: white;
      background: var(--primary);
    }
  }
}

.nav-number {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--surface-raised);
  transition:
    color $transition-medium ease,
    background-color $transition-medium ease;
}

.nav-content {
  flex: 1;
}

.nav-title {
  display: block;
  margin-bottom: 2px;
  font-size: 0.95rem;
  font-weight: 600;
}

.nav-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.nav-progress {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--border);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #8b5cf6);
  transition: width 0.05s linear;
}

.showcase-display {
  position: relative;
  height: 500px;
}

.display-wrapper {
  position: absolute;
  inset: 0;
}

.display-item {
  position: absolute;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  inset: 0;
}

.display-content {
  h3 {
    margin-bottom: 1rem;
    font-size: 1.75rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }
}

.feature-list {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.5rem 0;
    font-size: 0.95rem;

    svg {
      flex-shrink: 0;
      color: var(--green);
    }
  }
}

.display-visual {
  position: relative;
}

.visual-frame {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-raised);
  box-shadow: var(--shadow-xl);
  overflow: hidden;

  img {
    display: block;
    width: 100%;
  }
}

@media screen and (width <= 1024px) {
  .showcase-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .showcase-nav {
    position: static;
    flex-direction: row;
    gap: 0.75rem;
    padding-bottom: 0.5rem;
    overflow-x: auto;
  }

  .nav-item {
    flex-shrink: 0;
    min-width: 200px;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .showcase-display {
    position: relative;
    height: auto;
    min-height: 600px;
  }

  .display-wrapper {
    position: relative;
    inset: auto;
  }

  .display-item {
    position: relative;
    grid-template-columns: 1fr;
    gap: 2rem;
    inset: auto;
  }
}

@media screen and (width <= 640px) {
  .showcase-section {
    padding: 4rem 1rem;
  }

  .nav-item {
    min-width: 160px;
    padding: 1rem;
  }
}
</style>
