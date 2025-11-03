<template>
  <section class="about">
    <header class="about__header">
      <div>
        <h2>About Alexandrie</h2>
        <p class="about__subtitle">Version {{ version }} · {{ clientType }}</p>
      </div>
      <IconApp class="about__logo" width="140" height="140" />
    </header>

    <section class="about__card">
      <h3>What is Alexandrie?</h3>
      <p>
        Alexandrie is an all-in-one knowledge management platform that helps individuals and teams capture ideas, structure
        their notes, and rediscover information instantly. It combines fast document editing with powerful organization tools
        so you can map your knowledge base, keep projects on track, and find the right context at the right time.
      </p>
    </section>

    <section class="about__grid">
      <article class="about__card">
        <h3>Organize everything</h3>
        <ul>
          <li>Multi-level tree of folders and documents for any knowledge architecture.</li>
          <li>Flexible categories with custom icons, colors, and access rules.</li>
          <li>Rich metadata (tags, owners, timestamps) and lightning-fast search to surface content instantly.</li>
        </ul>
      </article>
      <article class="about__card">
        <h3>Work the way you prefer</h3>
        <ul>
          <li>Switch between list, tree, grid, Kanban, and document views depending on the context.</li>
          <li>Pin favorite workspaces and quickly jump using the command center or sidebar dock.</li>
          <li>Preview markdown, media assets, and attachments directly in the interface.</li>
        </ul>
      </article>
      <article class="about__card">
        <h3>Collaborate with confidence</h3>
        <ul>
          <li>Share documents or entire categories with teammates through workspace permissions.</li>
          <li>Track recent updates, manage backups, and restore versions when you need them.</li>
          <li>Deliver knowledge at scale with CDN hosting for assets and public embeds.</li>
        </ul>
      </article>
    </section>

    <section class="about__card">
      <h3>Getting started</h3>
      <ol>
        <li>Create or join a workspace, then add categories to mirror your projects or departments.</li>
        <li>Use “New Page” to capture notes in Markdown and enrich them with tags, attachments, and relationships.</li>
        <li>Switch to Kanban or grid views to track progress, and rely on search or filters to rediscover information fast.</li>
        <li>Invite collaborators, configure permissions, and enable backups to keep knowledge safe.</li>
      </ol>
    </section>

    <section class="about__card">
      <h3>Visual tour</h3>
      <p class="about__subtitle">Explore popular workflows right from the product.</p>
      <div class="about__media-grid">
        <figure v-for="demo in demos" :key="demo.src" class="about__media">
          <img :src="demo.src" :alt="demo.alt" loading="lazy" />
          <figcaption>{{ demo.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <footer class="about__footer">
      <p>
        Have feedback or ideas? Contribute on
        <a href="https://github.com/Smaug6739/Alexandrie" target="_blank" rel="noopener" class="about__link">GitHub</a>
        or share your thoughts with the community.
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import pkg from '~/../package.json';

const version = pkg.version ?? 'unknown';
const clientType = ref('Website');

const demos = [
  {
    src: '/screenshots/1.png',
    alt: 'Documents organised in a clean tree structure',
    caption: 'Structure knowledge with nested folders and categories.',
  },
  {
    src: '/screenshots/sidebar.png',
    alt: 'Sidebar navigation with quick actions and categories',
    caption: 'Navigate instantly using the customizable sidebar and dock.',
  },
  {
    src: '/screenshots/3.png',
    alt: 'Document editing experience with markdown preview',
    caption: 'Capture rich notes with live Markdown editing and preview.',
  },
  {
    src: '/screenshots/phone-1.png',
    alt: 'Mobile layout for capturing notes on the go',
    caption: 'Stay productive on mobile with responsive layouts.',
  },
];

if (import.meta.client) {
  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  const updateClientType = () => {
    clientType.value = mediaQuery.matches ? 'PWA' : 'Website';
  };

  onMounted(() => {
    updateClientType();
    mediaQuery.addEventListener('change', updateClientType);
  });

  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', updateClientType);
  });
}
</script>

<style scoped lang="scss">
.about {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0 3rem;
}

.about__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.about__subtitle {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  color: var(--font-color-light);
}

.about__logo {
  flex-shrink: 0;
}

.about__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.about__card {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-contrast);
  box-shadow: 0 10px 25px -18px var(--shadow-color, rgba(0, 0, 0, 0.2));

  h3 {
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }

  p,
  li {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  ul,
  ol {
    padding-left: 1.2rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
}

.about__media-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.about__media {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  img {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: 0 12px 30px -20px var(--shadow-color, rgba(0, 0, 0, 0.35));
    object-fit: cover;
  }

  figcaption {
    font-size: 0.9rem;
    color: var(--font-color-light);
  }
}

.about__footer {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--font-color-light);
}

.about__link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media screen and (max-width: 720px) {
  .about__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .about__logo {
    align-self: center;
  }
}
</style>
