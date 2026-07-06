<template>
  <section class="support-section">
    <div class="support-container">
      <span v-if="closeable" class="close-btn"><AppBtnIcon icon="close" size="sm" @click="handleClose" /></span>

      <div class="support-letter">
        <div class="letter-top-header">
          <div class="dev-badge">
            <span class="dot"></span>
            <span>A word from the creator</span>
          </div>
        </div>

        <h2>Alexandrie is free, and it will stay that way.</h2>

        <div class="letter-content">
          <p>
            Alexandrie didn't start as a business. It started as a tool I wanted for myself. Years later, I'm still maintaining and improving it in my spare
            time, and I'm happy to share it with anyone who finds it useful.
          </p>
          <p>
            The application doesn't track you, doesn't serve ads, and is fully open-source. However, keeping the live platform running involves hosting and
            infrastructure costs. If Alexandrie adds value to your daily workflow, consider supporting its independence. Even the smallest donation helps cover
            the servers for months.
          </p>
        </div>

        <div class="letter-footer">
          <span class="signature">— Smaug</span>
        </div>

        <div v-if="closeable" class="banner-actions">
          <AppButton type="primary" size="sm" @click="handleClose">I understand, thank you!</AppButton>
        </div>
      </div>

      <div class="support-cards">
        <a href="https://github.com/Smaug6739/Alexandrie" target="_blank" class="action-card star-card">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="card-text">
            <h3>Star on GitHub</h3>
            <p>Show your support and help other developers discover the project. It costs nothing but means everything.</p>
          </div>
          <span class="card-arrow">→</span>
        </a>

        <a href="https://github.com/sponsors/Smaug6739" target="_blank" class="action-card donate-card">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>
          <div class="card-text">
            <h3>Support financially</h3>
            <p>Help cover hosting, backup infrastructure, and development costs to keep Alexandrie online and independent.</p>
          </div>
          <span class="card-arrow">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    closeable?: boolean;
  }>(),
  {
    closeable: false,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function handleClose() {
  emit('close');
}
</script>

<style scoped lang="scss">
.support-section {
  max-width: 1400px;
  margin: 4rem auto;
  transition:
    opacity $transition-fast ease,
    transform $transition-fast ease,
    max-height 0.4s ease,
    margin 0.4s ease,
    padding 0.4s ease;
}

.support-container {
  position: relative;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  padding: 3.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--surface-base), var(--surface-raised));
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;
}

.letter-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

// Section Message (Gauche)
.support-letter {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .dev-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--surface-base);

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--primary);
    }
  }

  h2 {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: var(--text-body);
  }

  .letter-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    p {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }
  }

  .letter-footer {
    margin-top: 0.5rem;

    .signature {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
      font-weight: 600;
      color: var(--primary);
    }
  }

  .banner-actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 0.5rem;
  }
}

// Section Cartes d'actions (Droite)
.support-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.action-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-base);
  text-decoration: none;
  transition:
    border-color $transition-medium ease,
    transform $transition-medium ease,
    box-shadow $transition-medium ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);

    .card-arrow {
      transform: translateX(4px);
      color: var(--primary);
    }
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    background: var(--surface-raised);
    flex-shrink: 0;
  }

  .card-text {
    flex: 1;

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-body);
      margin-bottom: 0.25rem;
    }

    p {
      font-size: 0.85rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }
  }

  .card-arrow {
    font-size: 1.2rem;
    color: var(--text-secondary);
    transition:
      transform $transition-fast ease,
      color $transition-fast ease;
    align-self: center;
  }
}

.star-card .card-icon {
  color: #fbbf24;
}
.donate-card .card-icon {
  color: #ec4899;
}

@media screen and (width <= 1024px) {
  .support-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 2.5rem;
  }
}

@media screen and (width <= 640px) {
  .support-section {
    padding: 0 1rem;
  }
  .support-container {
    padding: 2rem 1.25rem;
  }
  .action-card {
    padding: 1.25rem;
    gap: 1rem;
    .card-arrow {
      display: none;
    }
  }
}
</style>
