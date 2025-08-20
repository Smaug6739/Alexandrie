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
  text-align: center;
  margin: 4rem auto;
  max-width: 1100px;
}
.strip {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
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
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.avatar:hover {
  transform: translateY(-2px);
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
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
