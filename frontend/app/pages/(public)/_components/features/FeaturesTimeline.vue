<template>
  <section>
    <h2 class="section-title">A Seamless Experience from Start to Finish</h2>
    <p class="section-subtitle">Discover how Alexandrie empowers you at every stage — from note-taking to publishing.</p>

    <div class="timeline">
      <div v-for="(step, index) in steps" :key="index" ref="items" class="timeline-item" :class="{ 'is-right': index % 2 === 1 }">
        <div class="timeline-content">
          <div class="text">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
          <div class="illustration">
            <div class="card">
              <img :src="step.image" :alt="step.title" @click="openLightbox(step.image, step.title)" />
              <div v-if="step.image_sub" class="overlay">
                <p>{{ step.image_sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="timeline-line"></div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <img :src="selectedImage" :alt="selectedTitle" />
        <p class="caption">{{ selectedTitle }}</p>
        <button class="close-btn" @click="closeLightbox">×</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: '1. Organize your thoughts instantly',
    text: 'Create and structure notes with powerful organizational tools: Complete sidebar, nested categories / notes, tags, and workspaces.',
    image: '/screenshots/mock/1.png',
    image_sub: 'Structure your content with documents, categories, workspaces, and tags.',
  },
  {
    title: '2. Capture your ideas effortlessly',
    text: 'Write in Markdown with live preview, syntax highlighting, and rich media support to bring your notes to life.',
    image: '/screenshots/mock/2.png',
    image_sub: 'Keep full control over your workspace layout and navigation.',
  },
  {
    title: '3. Collaborate, publish, and share',
    text: 'Share notes or notebooks with teammates and collaborate seamlessly, publish your work with a single click.',
    image: '/screenshots/mock/3.png',
    image_sub: 'Invite team members, manage permissions.',
  },
  {
    title: '4. Use the CDN to work with images and files',
    text: 'Easily upload and manage images and files using our integrated CDN for fast and reliable access.',
    image: '/screenshots/mock/4.png',
    image_sub: 'Upload and manage images and files with ease.',
  },
];

const items = ref<HTMLDivElement[]>([]);
const lightboxVisible = ref(false);
const selectedImage = ref('');
const selectedTitle = ref('');

function openLightbox(image: string, title: string) {
  selectedImage.value = image;
  selectedTitle.value = title;
  lightboxVisible.value = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxVisible.value = false;
  document.body.style.overflow = '';
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.3 },
  );

  items.value.forEach(item => observer.observe(item));
});
</script>

<style scoped lang="scss">
section {
  padding: 2rem;
  position: relative;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--font-color-dark);
  margin-bottom: 1rem;
}

.section-subtitle {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  color: var(--font-color-light);
  line-height: 1.6;
}

.timeline {
  position: relative;
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem 0;

  .timeline-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: 100%;
    background: var(--primary);
    transform: translateX(-50%);
    border-radius: 3px;
    opacity: 0.3;
  }

  .timeline-item {
    display: flex;
    align-items: center;
    margin-bottom: 6rem;
    position: relative;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;

    &.visible {
      opacity: 1;
      transform: translateY(0);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .timeline-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      width: 100%;

      .text {
        flex: 1;
        padding: 1rem;

        h3 {
          font-size: 1.5rem;
          color: #111;
          margin-bottom: 0.8rem;
        }

        p {
          color: #444;
          line-height: 1.7;
        }
      }

      .illustration {
        flex: 1;
        display: flex;
        justify-content: center;

        img {
          width: 100%;
          max-width: 800px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
          background: white;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          cursor: zoom-in;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

    &.is-right {
      flex-direction: row-reverse;

      .timeline-content {
        flex-direction: row-reverse;
      }
    }
  }
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.25s ease;

  .lightbox-content {
    position: relative;
    max-width: 60%;
    max-height: 85%;
    border-radius: 12px;
    overflow: hidden;
    animation: zoomIn 0.25s ease;

    img {
      width: 100%;
      max-width: 100%;
      max-height: none;
      height: auto;
      margin: auto;
      border-radius: 12px;
      display: block;
    }

    .caption {
      color: #f0f0f0;
      font-size: 1rem;
      text-align: center;
      margin-top: 1rem;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      background: transparent;
      color: white;
      font-size: 2rem;
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease;
      line-height: 1;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.95);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .timeline {
    .timeline-line {
      left: 12px;
    }

    .timeline-item {
      flex-direction: column !important;
      align-items: flex-start;
      padding-left: 2rem;

      .timeline-content {
        flex-direction: column;
        gap: 1.5rem;

        .text {
          order: 2;
        }

        .illustration {
          order: 1;
        }
      }
    }
  }
}
</style>
