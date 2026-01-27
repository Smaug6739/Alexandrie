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
        <IconApp class="logo" style="width: 110px" fill="white" />
        <h1><span class="gradient-text">About Alexandrie</span></h1>
        <p class="tagline">
          Behind every great idea lies a place to think, write, and connect ideas.
          <br />Alexandrie is that place — a modern Markdown workspace built for clarity, performance, and creative freedom.
        </p>
        <div class="cta-buttons">
          <NuxtLink :prefetch="false" to="/dashboard" class="btn primary glow">Get Started</NuxtLink>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="btn secondary"> GitHub </NuxtLink>
        </div>
      </div>
      <img src="/screenshots/mock/1.png" class="hero-image" alt="Alexandrie interface preview" />
    </section>

    <!-- Story -->
    <section class="reveal about-section">
      <h2 class="section-title">The Story Behind Alexandrie</h2>
      <p class="section-text">
        Alexandrie was born from a simple observation: note-taking tools are either too basic or too heavy. Most students, developers, and researchers want
        something lightweight, structured, and expressive — a space where Markdown and LaTeX blend seamlessly.
        <br /><br />
        The project started as an experiment to rethink how we take notes digitally: fast to open, pleasant to use, and built with a focus on information
        structure rather than visual clutter. Today, Alexandrie has grown into a powerful open-source workspace, designed to make knowledge organization feel
        effortless.
      </p>
    </section>

    <!-- Vision -->
    <section class="reveal about-section alt">
      <h2 class="section-title">Our Vision</h2>
      <p class="section-text">
        Alexandrie is more than a note-taking app — it’s a philosophy of simplicity and longevity. Every design choice follows a single question:
        <em>does this help the user think better?</em> <br /><br />
        From the minimal UI to the transparent database model, Alexandrie encourages users to build their own personal knowledge libraries — free of
        distractions, locked formats, or subscription walls. Open-source at its core, the project invites contributors to improve, extend, and evolve it
        together.
      </p>
    </section>

    <!-- Architecture -->
    <section class="reveal about-section">
      <h2 class="section-title">Under the Hood</h2>
      <p class="section-text">
        Behind its minimalist interface lies a robust and modular architecture built for performance and maintainability.
        <br /><br />
        The frontend is powered by <strong>Vue 3 / Nuxt</strong>, ensuring smooth transitions, reactivity, and a clean component design. On the backend,
        Alexandrie leverages <strong>Go</strong> for its speed and concurrency, backed by <strong>MySQL</strong> for reliable data management. <br /><br />
        Markdown and LaTeX rendering are optimized to handle long, complex documents while maintaining real-time responsiveness. Every keystroke is preserved
        instantly, making the editing experience feel natural — even with thousands of lines.
      </p>
    </section>

    <!-- Highlights -->
    <section class="reveal about-section alt">
      <h2 class="section-title">What Makes Alexandrie Unique</h2>
      <p class="section-text">Alexandrie is not just about writing — it’s about <strong>building a digital library</strong> that evolves with you.</p>

      <ul class="feature-list">
        <li><strong>Hierarchical Workspaces</strong> — Organize notes in nested structures of categories, files, and resources.</li>
        <li><strong>Instant Search</strong> — Find anything within seconds using an index optimized for long documents.</li>
        <li><strong>Markdown+ Syntax</strong> — Write Markdown with enhanced syntax for annotations, tags, and inline math.</li>
        <li><strong>Offline-ready</strong> — Keep working even without a connection; everything syncs when you’re back online.</li>
        <li><strong>Privacy First</strong> — All data belongs to you. Export, archive, or self-host your entire workspace anytime.</li>
        <li><strong>Performance Focus</strong> — Designed to stay fast, even with thousands of notes and deep nesting.</li>
      </ul>
    </section>

    <AppCTA class="reveal" />

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
import AppCTA from './_components/AppCTA.vue';

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

.btn.glow {
  box-shadow:
    0 10px 30px rgb(0 0 0 / 20%),
    0 0 0 rgb(255 255 255 / 60%);
}

.btn.glow:hover {
  box-shadow:
    0 14px 36px rgb(0 0 0 / 24%),
    0 0 30px rgb(255 255 255 / 35%);
}

.about-section {
  max-width: 900px;
  margin: 0 auto 5rem;
  text-align: center;
}

.about-section.alt {
  padding: 3rem 2rem;
  border-radius: 1rem;
  background: rgb(255 255 255 / 2%);
}

.section-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--font-color-light);
}

.feature-list {
  padding: 0;
  text-align: left;
  list-style: none;
  margin-top: 2rem;
}

.feature-list li {
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.demo-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.demo-gallery img {
  width: 280px;
  border-radius: 0.8rem;
  box-shadow: 0 6px 20px rgb(0 0 0 / 25%);
  transition: transform 0.3s ease;
}

.demo-gallery img:hover {
  transform: translateY(-6px);
}

.reveal {
  opacity: 0;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
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

  .demo-gallery img {
    width: 100%;
    max-width: 340px;
  }
}
</style>
