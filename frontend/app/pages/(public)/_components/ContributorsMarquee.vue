<template>
  <section class="contributors">
    <div class="section-header">
      <h3>Built by the community</h3>
      <p>Meet the amazing people who make Alexandrie possible</p>
    </div>

    <div v-if="displayAvatars.length" class="contributors-wrapper">
      <div class="contributors-track">
        <a v-for="c in displayAvatars" :key="c.__key" class="contributor" :href="c.html_url" target="_blank" :title="c.login">
          <img :src="c.avatar_url + '&s=80'" :alt="c.login" loading="lazy" />
          <div class="contributor-info">
            <span class="name">{{ c.login }}</span>
            <span class="contributions">{{ c.contributions }} commits</span>
          </div>
        </a>
      </div>
    </div>

    <div class="contributors-cta">
      <a href="https://github.com/Smaug6739/Alexandrie/contribute" target="_blank" class="cta-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Become a contributor
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const avatars = ref<Contributor[]>([]);
const displayAvatars = computed(() => avatars.value.map((c, idx) => ({ ...c, __key: `${c.id}-${idx}` })));

async function fetchContributors() {
  try {
    const res = await fetch(`https://api.github.com/repos/Smaug6739/Alexandrie/contributors?per_page=50`);
    if (!res.ok) return;
    const data = await res.json();
    avatars.value = Array.isArray(data) ? (data as Contributor[]) : [];
  } catch {
    avatars.value = [];
  }
}

onMounted(fetchContributors);
</script>

<style scoped lang="scss">
.contributors {
  max-width: 1400px;
  margin: 4rem auto;
  padding: 3rem 2rem;
  text-align: center;
  overflow: hidden;
}

.section-header {
  margin-bottom: 2rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: var(--text-secondary);
  }
}

.contributors-wrapper {
  position: relative;
  padding: 1rem 0;
}

.contributors-track {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.contributor {
  display: flex;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  transition: all 0.3s ease;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
  text-decoration: none;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 10px 30px rgb(0 0 0 / 10%);
    transform: translateY(-4px);

    img {
      transform: scale(1.1);
    }
  }

  img {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    transition: transform 0.3s ease;
  }
}

.contributor-info {
  display: flex;
  text-align: left;
  flex-direction: column;

  .name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-body);
  }

  .contributions {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
}

.contributors-cta {
  margin-top: 2rem;
}

.cta-btn {
  display: inline-flex;
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-body);
  background: var(--surface-raised);
  transition: all 0.3s ease;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
  }
}

@media screen and (width <= 640px) {
  .contributors {
    padding: 2rem 1rem;
  }

  .contributor {
    padding: 10px 12px;

    img {
      width: 36px;
      height: 36px;
    }
  }

  .contributor-info .name {
    font-size: 0.85rem;
  }
}
</style>
