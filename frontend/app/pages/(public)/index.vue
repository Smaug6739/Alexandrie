<template>
  <main>
    <!-- Hero -->

    <section ref="heroEl" class="hero">
      <div class="hero-bg">
        <span class="orb orb-1" />
        <span class="orb orb-2" />
        <span class="orb orb-3" />
        <span class="grid" />
      </div>
      <div class="hero-content">
        <div class="badges">
          <span class="badge">Open-source</span>
          <span class="badge">Markdown</span>
          <span class="badge">Organization</span>
        </div>
        <IconApp class="logo" style="width: 120px" fill="white" />
        <h1><span class="gradient-text">Your Notes</span>, Beautifully Organized</h1>
        <p class="tagline">A powerful Markdown workspace designed for speed, clarity, and creativity.</p>
        <div class="cta-buttons">
          <NuxtLink :prefetch="false" to="/dashboard" class="btn primary glow">Get Started</NuxtLink>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="btn secondary"> GitHub </NuxtLink>
        </div>
      </div>
      <img src="/screenshots/mock/0.png" class="hero-image" alt="App preview" />
    </section>

    <BentoFeatures class="reveal" />
    <FeaturesShowcase class="reveal" />
    <SelfHostSteps class="reveal" />
    <OpenSourceStats class="reveal" />
    <ContributorsMarquee class="reveal" />
    <FeaturesFAQ class="reveal" />
    <AppCTA class="reveal" />

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
import AppFooter from './_components/AppFooter.vue';
import BentoFeatures from './_components/BentoFeatures.vue';
import FeaturesShowcase from './_components/FeaturesShowcase.vue';
import OpenSourceStats from './_components/OpenSourceStats.vue';
import SelfHostSteps from './_components/SelfHostSteps.vue';
import ContributorsMarquee from './_components/ContributorsMarquee.vue';
import FeaturesFAQ from './_components/features/FeaturesFAQ.vue';
import AppCTA from './_components/AppCTA.vue';

definePageMeta({
  ssr: true,
  middleware: [
    function redirectLandingDisabled() {
      const config = useRuntimeConfig();
      if (config.public.configDisableLandingPage) {
        return navigateTo('/login');
      }
    },
  ],
});

const heroEl = ref<HTMLElement | null>(null);

function handleParallax(e: MouseEvent) {
  if (!heroEl.value) return;
  const rect = heroEl.value.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / rect.width;
  const dy = (e.clientY - cy) / rect.height;
  heroEl.value.style.setProperty('--px', String(dx));
  heroEl.value.style.setProperty('--py', String(dy));
}

onMounted(() => {
  document.addEventListener('mousemove', handleParallax);
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleParallax);
    observer.disconnect();
  });
});
</script>

<style scoped lang="scss">
main {
  padding: 0 2rem;
  margin-top: 1em;
  overflow-x: hidden;
}

.hero {
  position: relative;
  display: flex;
  padding: 4rem 2rem;
  border-radius: 1rem;
  color: white;
  background: radial-gradient(1200px 400px at 20% -10%, rgb(255 255 255 / 8%), transparent), linear-gradient(120deg, var(--primary), #6c63ff);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
  overflow: hidden;
}

.hero-content {
  flex: 1;
}

.hero-image {
  width: 600px;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgb(0 0 0 / 30%);
  margin-top: 10px;
}

.gradient-text {
  color: transparent;
  background: linear-gradient(90deg, #fff, #e3e8ff, #fff);
  background-clip: text;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.badge {
  padding: 6px 10px;
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 999px;
  font-size: 12px;
  background: rgb(255 255 255 / 15%);
}

.cta-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
}

.btn.primary {
  color: var(--primary);
  background: white;
}

.btn.secondary {
  color: white;
  background: rgb(255 255 255 / 20%);
}

.btn.primary:hover,
.btn.secondary:hover {
  transform: translateY(-3px);
}

.btn.glow {
  box-shadow: 0 10px 30px rgb(0 0 0 / 20%), 0 0 0 rgb(255 255 255 / 60%);
}

.btn.glow:hover {
  box-shadow: 0 14px 36px rgb(0 0 0 / 24%), 0 0 30px rgb(255 255 255 / 35%);
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.55;
  filter: blur(40px);
  transform: translate3d(calc(var(--px, 0) * 20px), calc(var(--py, 0) * 20px), 0);
}

.orb-1 {
  top: -80px;
  left: -60px;
  width: 320px;
  height: 320px;
  background: #fff;
  opacity: 0.15;
}

.orb-2 {
  right: 10%;
  bottom: -40px;
  width: 240px;
  height: 240px;
  background: #9aa5ff;
  opacity: 0.25;
}

.orb-3 {
  top: 20%;
  right: -60px;
  width: 180px;
  height: 180px;
  background: #ffd6a5;
  opacity: 0.2;
}

.grid {
  position: absolute;
  background-image: linear-gradient(rgb(255 255 255 / 6%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 6%) 1px, transparent 1px);
  background-size: 28px 28px;
  inset: 0;
  mask-image: radial-gradient(600px 280px at 30% 10%, #000, transparent 70%);
}

.reveal {
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
  transform: translateY(24px);
}

.reveal.in {
  opacity: 1;
  transform: translateY(0);
}

@media screen and (width <= 768px) {
  main {
    padding: 0 1rem;
  }

  .hero {
    padding: 2rem 1rem;
    text-align: center;
    flex-direction: column;
  }

  .hero-image {
    width: 100%;
    max-width: 500px;
    margin-top: 2rem;
  }
}
</style>
