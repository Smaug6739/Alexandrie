<template>
  <main class="landing">
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
          <span class="badge">Export PDF</span>
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

    <!-- Features -->
    <section class="features reveal">
      <h2>Why Alexandrie?</h2>
      <div class="features-grid">
        <FeatureCard icon="performances" title="Lightning Fast" text="Optimized for performance and minimal load times." />
        <FeatureCard icon="layers" title="Organized Workspaces" text="Keep projects neat with nested categories." />
        <FeatureCard icon="markdown" title="Rich Markdown" text="Advanced syntax, LaTeX, custom blocks, and more." />
        <FeatureCard icon="import" title="Export & Share" text="PDF export with perfect formatting." />
        <FeatureCard icon="shortcuts" title="Keyboard Shortcuts" text="Do everything without touching the mouse." />
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials reveal">
      <h2>Loved by Students & Professionals</h2>
      <div class="testimonials-grid">
        <TestimonialCard name="Alice" role="Student" text="Alexandrie made my study notes so much easier to manage!" avatar="https://i.pravatar.cc/150?img=32" />
        <TestimonialCard name="John" role="Creator" text="Very useful tool for organizing my thoughts." avatar="https://i.pravatar.cc/150?img=12" />
        <TestimonialCard name="Sara" role="Student" text="Clean, minimal, and packed with features I actually use." avatar="https://i.pravatar.cc/150?img=47" />
      </div>
    </section>

    <OpenSourceStats class="reveal" />
    <ContributorsMarquee class="reveal" />
    <SelfHostSteps class="reveal" />
    <OSSPrinciples class="reveal" />
    <GoodFirstIssues class="reveal" />
    <SponsorWall class="reveal" />

    <!-- Final CTA -->
    <section class="final-cta reveal">
      <h2>Ready to Take Better Notes?</h2>
      <p>Join us on this journey to better note-taking.</p>
      <NuxtLink :prefetch="false" to="/dashboard" class="btn primary large" style="display: block; margin: 10px auto 0; width: fit-content">Start Now</NuxtLink>
      <p style="margin-top: 30px">Want to contribute or discuss? Check out our <NuxtLink :prefetch="false" to="https://discord.gg/UPsEg6egPj" target="_blank" style="color: white; text-decoration: underline">Discord server</NuxtLink>!</p>
    </section>

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
import AppFooter from './_components/AppFooter.vue';
import FeatureCard from './_components/FeatureCard.vue';
import TestimonialCard from './_components/TestimonialCard.vue';
import OpenSourceStats from './_components/OpenSourceStats.vue';
import SelfHostSteps from './_components/SelfHostSteps.vue';
import GoodFirstIssues from './_components/GoodFirstIssues.vue';
import ContributorsMarquee from './_components/ContributorsMarquee.vue';
import SponsorWall from './_components/SponsorWall.vue';
import OSSPrinciples from './_components/OSSPrinciples.vue';

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
  window.addEventListener('mousemove', handleParallax);
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
    window.removeEventListener('mousemove', handleParallax);
    observer.disconnect();
  });
});
</script>

<style scoped lang="scss">
.landing {
  margin-top: 1em;
  font-family: var(--font-main);
  padding: 0 2rem;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 4rem 2rem;
  position: relative;
  background: radial-gradient(1200px 400px at 20% -10%, rgba(255, 255, 255, 0.08), transparent), linear-gradient(120deg, var(--primary), #6c63ff);
  color: white;
  border-radius: 1rem;
  margin-bottom: 4rem;
  overflow: hidden;
}

.hero-content {
  flex: 1;
}

.hero-image {
  width: 600px;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  margin-top: 10px;
}

.gradient-text {
  background: linear-gradient(90deg, #fff, #e3e8ff, #fff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 12px;
}

.cta-buttons {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}
.btn.primary {
  background: white;
  color: var(--primary);
}
.btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
.btn.primary:hover,
.btn.secondary:hover {
  transform: translateY(-3px);
}
.btn.glow {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 rgba(255, 255, 255, 0.6);
}
.btn.glow:hover {
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.24), 0 0 30px rgba(255, 255, 255, 0.35);
}

.features {
  text-align: center;
  margin-bottom: 4rem;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.features-grid > * {
  transform: translateZ(0);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.features-grid > *:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.testimonials {
  background: var(--bg-contrast);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 4rem;
  border-radius: 1rem;
}
.testimonials-grid {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.final-cta {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--primary);
  color: white;
  border-radius: 1rem;
  margin-bottom: 3rem;
}
.final-cta .btn {
  background: white;
  color: var(--primary);
}

.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  width: 24px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
}
.scroll-indicator span {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: scroll 1.6s ease-in-out infinite;
}
@keyframes scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  60% {
    transform: translateY(12px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.orb {
  position: absolute;
  filter: blur(40px);
  opacity: 0.55;
  border-radius: 50%;
  transform: translate3d(calc(var(--px, 0) * 20px), calc(var(--py, 0) * 20px), 0);
}
.orb-1 {
  width: 320px;
  height: 320px;
  background: #ffffff;
  top: -80px;
  left: -60px;
  opacity: 0.15;
}
.orb-2 {
  width: 240px;
  height: 240px;
  background: #9aa5ff;
  bottom: -40px;
  right: 10%;
  opacity: 0.25;
}
.orb-3 {
  width: 180px;
  height: 180px;
  background: #ffd6a5;
  top: 20%;
  right: -60px;
  opacity: 0.2;
}
.grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(600px 280px at 30% 10%, #000, transparent 70%);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.in {
  opacity: 1;
  transform: translateY(0);
}

@media screen and (max-width: 768px) {
  .landing {
    padding: 0 1rem;
  }
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }
  .hero-image {
    width: 100%;
    max-width: 500px;
    margin-top: 2rem;
  }
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
