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
      <a v-for="c in displayAvatars" :key="'clone-' + c.__key" class="avatar" :href="c.html_url" target="_blank" :title="c.login">
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
const displayAvatars = computed(() => {
  const src = avatars.value;
  if (!src || src.length === 0) return [] as any[];
  const min = 14;
  const expanded: any[] = [];
  let safety = 0;
  while (expanded.length < min && safety < 10) {
    expanded.push(...src);
    safety++;
  }
  return expanded.slice(0, Math.max(min, src.length)).map((c, idx) => ({ ...c, __key: `${c.id}-${idx}` }));
});

async function fetchContributors() {
  try {
    const res = await fetch(`https://api.github.com/repos/Smaug6739/Alexandrie/contributors?per_page=100`);
    if (!res.ok) return;
    const data = await res.json();
    avatars.value = Array.isArray(data) ? (data as Contributor[]) : [];
  } catch {}
}

onMounted(fetchContributors);
</script>

<style scoped lang="scss">
.contributors {
  text-align: center;
  margin: 4rem auto;
  max-width: 1100px;
}
.strip {
  display: flex;
  gap: 12px;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  padding: 8px 0;
  animation: marquee 22s linear infinite;
  will-change: transform;
}
.strip:hover {
  animation-play-state: paused;
}
.avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background: var(--bg-color);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.avatar::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 1px var(--border-color) inset;
}
.avatar:hover {
  transform: translateY(-2px);
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
.profile {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(0);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 6px 10px;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
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
  color: var(--text-muted);
}
.hint {
  color: var(--text-muted);
  font-size: 13px;
  margin-top: 6px;
}
</style>
