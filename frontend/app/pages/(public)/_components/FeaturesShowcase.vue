<template>
  <section class="showcase-section">
    <div class="section-header">
      <h2 class="section-title">From idea to published docs</h2>
      <p class="section-subtitle">See how Alexandrie streamlines your entire workflow</p>
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
          <TransitionGroup name="showcase">
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
const features = [
  {
    title: 'Capture Ideas Instantly',
    shortDesc: 'Quick notes & drafts',
    description: 'Start writing immediately with our distraction-free editor. Everything syncs automatically.',
    points: ['Real-time autosave', 'Quick keyboard shortcuts', 'Distraction-free mode', 'Templates for common formats'],
    image: '/screenshots/mock/1.png',
  },
  {
    title: 'Organize Your Knowledge',
    shortDesc: 'Structure & categorize',
    description: 'Create a powerful knowledge base with nested folders, workspaces, and smart tagging.',
    points: ['Unlimited nested folders', 'Multiple workspaces', 'Tag-based organization', 'Smart filters & views'],
    image: '/screenshots/mock/2.png',
  },
  {
    title: 'Collaborate Seamlessly',
    shortDesc: 'Team workflows',
    description: 'Share notes with your team, manage permissions, and work together in real-time.',
    points: ['Granular permissions', 'Real-time collaboration', 'Comment & feedback', 'Activity history'],
    image: '/screenshots/mock/3.png',
  },
  {
    title: 'Publish & Share',
    shortDesc: 'Go live instantly',
    description: 'Transform your notes into beautiful public documentation with one click.',
    points: ['Custom domains', 'SEO optimized', 'Analytics built-in', 'Password protection'],
    image: '/screenshots/mock/4.png',
  },
];

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
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--font-color-light);
  max-width: 500px;
  margin: 0 auto;
}

.showcase-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

.showcase-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  top: 100px;
}

.nav-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--primary);
    transform: translateX(4px);
  }

  &.active {
    background: var(--bg-contrast);
    border-color: var(--primary);
    box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15);

    .nav-number {
      background: var(--primary);
      color: white;
    }
  }
}

.nav-number {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-contrast);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--font-color-light);
  transition: all 0.3s ease;
}

.nav-content {
  flex: 1;
}

.nav-title {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.nav-desc {
  font-size: 0.8rem;
  color: var(--font-color-light);
}

.nav-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--border-color);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #8b5cf6);
  transition: width 0.05s linear;
}

.showcase-display {
  height: 500px;
  position: relative;
}

.display-wrapper {
  position: absolute;
  inset: 0;
}

.display-item {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  align-items: center;
}

.display-content {
  h3 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: var(--font-color-light);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.5rem 0;
    font-size: 0.95rem;

    svg {
      color: var(--green);
      flex-shrink: 0;
    }
  }
}

.display-visual {
  position: relative;
}

.visual-frame {
  background: var(--bg-contrast);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    display: block;
  }
}

// Transitions - simple opacity fade to avoid layout shifts
.showcase-enter-active,
.showcase-leave-active {
  transition: opacity 0.4s ease;
}

.showcase-enter-from,
.showcase-leave-to {
  opacity: 0;
}

@media screen and (max-width: 1024px) {
  .showcase-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .showcase-nav {
    flex-direction: row;
    overflow-x: auto;
    position: static;
    gap: 0.75rem;
    padding-bottom: 0.5rem;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 4px;
    }
  }

  .nav-item {
    min-width: 200px;
    flex-shrink: 0;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .showcase-display {
    height: auto;
    min-height: 600px;
    position: relative;
  }

  .display-wrapper {
    position: relative;
    inset: auto;
  }

  .display-item {
    position: relative;
    inset: auto;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media screen and (max-width: 640px) {
  .showcase-section {
    padding: 4rem 1rem;
  }

  .nav-item {
    min-width: 160px;
    padding: 1rem;
  }
}
</style>
