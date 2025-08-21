<template>
  <section class="contributors">
    <h2>Contributors</h2>
    <div class="strip" :style="{ ['--items' as any]: displayAvatars.length }">
      <a v-for="c in displayAvatars" :key="c.__key" class="avatar" :href="c.html_url" target="_blank" :title="c.login">
        <img :src="c.avatar_url + '&s=80'" :alt="c.login" />
        <div class="profile">
          <div class="name">{{ c.login }}</div>
          <div class="sub">GitHub</div>
        </div>
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
}
const avatars = ref<Contributor[]>([]);
const displayAvatars = computed(() => avatars.value.map((c, idx) => ({ ...c, __key: `${c.id}-${idx}` })));

async function fetchContributors() {
  try {
    const res = await fetch(`https://api.github.com/repos/Smaug6739/Alexandrie/contributors?per_page=100`);
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
  max-width: 1100px;
  margin: 4rem auto;
  text-align: center;
}

.strip {
  display: flex;
  padding: 8px 0;
  gap: 12px;
  justify-content: center;
}

.avatar {
  position: relative;
  display: block;
  background: var(--bg-color);
  transition: transform 0.15s ease;
}

.avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.avatar::before {
  position: absolute;
  border-radius: inherit;
  content: '';
  inset: 0;
}

.avatar:hover {
  transform: translateY(-2px);
}

.profile {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-color);
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  pointer-events: none;
  transform: translateX(-50%) translateY(0);
  white-space: nowrap;
}

.avatar:hover .profile {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

.name {
  font-weight: 700;
}

.sub {
  font-size: 12px;
}

.hint {
  font-size: 13px;

  margin-top: 6px;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>
