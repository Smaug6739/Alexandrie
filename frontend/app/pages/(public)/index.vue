<template>
  <main class="landing">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <IconApp class="logo" style="width: 120px" fill="white" />
        <h1>Your Notes, Beautifully Organized</h1>
        <p class="tagline">A powerful Markdown workspace designed for speed, clarity, and creativity.</p>
        <div class="cta-buttons">
          <NuxtLink to="/dashboard" class="btn primary">Get Started</NuxtLink>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="btn secondary"> GitHub </NuxtLink>
        </div>
      </div>
      <img src="/screenshots/mock/0.png" class="hero-image" alt="App preview" />
    </section>

    <!-- Features -->
    <section class="features">
      <h2>Why Alexandrie?</h2>
      <div class="features-grid">
        <FeatureCard icon="performances" title="Lightning Fast" text="Optimized for performance and minimal load times." />
        <FeatureCard icon="layers" title="Organized Workspaces" text="Keep projects neat with nested categories." />
        <FeatureCard icon="markdown" title="Rich Markdown" text="Advanced syntax, LaTeX, custom blocks, and more." />
        <FeatureCard icon="import" title="Export & Share" text="PDF export with perfect formatting." />
        <FeatureCard icon="shortcuts" title="Keyboard Shortcuts" text="Do everything without touching the mouse." />
      </div>
    </section>

    <!-- Showcase -->
    <section class="showcase">
      <h2>See Alexandrie in Action</h2>
      <div class="screenshots">
        <img src="/screenshots/mock/documents.png" alt="Notes" />
        <img src="/screenshots/mock/2.png" alt="Organizing notes" />
        <img src="/screenshots/mock/3.png" alt="Editing notes" />
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <h2>Loved by Students & Professionals</h2>
      <div class="testimonials-grid">
        <TestimonialCard name="Alice" role="Student" text="Alexandrie made my study notes so much easier to manage!" avatar="https://i.pravatar.cc/150?img=32" />
        <TestimonialCard name="John" role="Creator" text="Very useful tool for organizing my thoughts." avatar="https://i.pravatar.cc/150?img=12" />
        <TestimonialCard name="Sara" role="Student" text="Clean, minimal, and packed with features I actually use." avatar="https://i.pravatar.cc/150?img=47" />
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <h2>Ready to Take Better Notes?</h2>
      <p>Join us on this journey to better note-taking.</p>
      <NuxtLink to="/dashboard" class="btn primary large" style="display: block; margin-top: 10px; width: fit-content; margin: 0 auto">Start Now</NuxtLink>
    </section>

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
import AppFooter from './_components/AppFooter.vue';
import FeatureCard from './_components/FeatureCard.vue';
import TestimonialCard from './_components/TestimonialCard.vue';
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
  background: linear-gradient(120deg, var(--primary), #6c63ff);
  color: white;
  border-radius: 1rem;
  margin-bottom: 4rem;
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

.showcase {
  text-align: center;
  margin-bottom: 4rem;
}
.screenshots {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.screenshots img {
  border-radius: 0.8rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 100%;
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
  padding: 4rem 2rem;
  background: var(--primary);
  color: white;
  border-radius: 1rem;
  margin-bottom: 4rem;
}
.final-cta .btn {
  background: white;
  color: var(--primary);
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
