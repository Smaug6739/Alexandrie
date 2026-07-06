<script setup lang="ts">
const markStore = useMark();

const RELEASE_MARK_ID: MarkId = 'v8.10.0';

const isVisible = ref(false);

onMounted(() => {
  if (markStore.hasMark(RELEASE_MARK_ID)) {
    isVisible.value = true;
  }
});

function handleClose() {
  isVisible.value = false;
  setTimeout(() => {
    markStore.dismissMark(RELEASE_MARK_ID);
  }, 400);
}
</script>

<template>
  <Transition name="welcome-collapse">
    <div v-if="isVisible" class="welcome-banner">
      <div class="banner-glow"></div>

      <div class="banner-main">
        <div class="banner-header">
          <div class="header-title">
            <div class="primary icon-badge">
              <Icon name="sparkle" display="md" />
            </div>
            <div>
              <h2>What's new in Alexandrie?</h2>
              <p class="version-tag">Version 8.10.0</p>
            </div>
          </div>

          <AppBtnIcon icon="close" size="sm" @click="handleClose" />
        </div>

        <div class="grid">
          <div class="item">
            <div class="indicator"></div>
            <div class="text">
              <h3>Teams</h3>
              <p>Organize your activities with others. Manage permissions, access rights and collaborate</p>
            </div>
          </div>
          <div class="item">
            <div class="indicator"></div>
            <div class="text">
              <h3>Offline mode</h3>
              <p>Install PWA and create, read and edit documents offline.</p>
            </div>
          </div>
          <div class="item">
            <div class="indicator"></div>
            <div class="text">
              <h3>Account 2FA</h3>
              <p>Ensure the security of your account with two-factor authentication.</p>
            </div>
          </div>

          <div class="item">
            <div class="indicator"></div>
            <div class="text">
              <h3>Import full folders from your device</h3>
              <p>Import entire folders including subfolders & images from your device with the advanced import feature.</p>
            </div>
          </div>
        </div>

        <p class="description">
          And many more improvements, fixes and features!
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie/discussions" target="_blank">Give feedback</NuxtLink>
        </p>
        <div class="banner-actions">
          <AppButton type="primary" size="sm" @click="handleClose">I understand, thank you!</AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.welcome-banner {
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--surface-base), var(--surface-raised));
  margin-top: 1rem;
  transition:
    opacity $transition-fast ease,
    transform $transition-fast ease,
    max-height 0.4s ease,
    margin 0.4s ease,
    padding 0.4s ease;
}

.banner-glow {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%);
  pointer-events: none;
}

.banner-main {
  padding: 1.5rem;
}

.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-title {
  display: flex;
  gap: 0.75rem;
  align-items: center;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-body);
  }
}

.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
}

.version-tag {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

// Organisation en grille responsive
.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 1.5rem;
}

.item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.indicator {
  margin-top: 6px;
  width: 8px;
  height: 8px;
  background-color: var(--primary);
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px var(--primary-bg);
}

.text {
  h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: var(--text-body);
  }

  p {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.4;
    margin: 0;
  }
}

.description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0 0 1.5rem 0;
  a {
    color: var(--primary);
    text-decoration: underline;
  }
}

.banner-actions {
  display: flex;
  justify-content: flex-start;
}

// Transition d'écrasement fluide à la fermeture
.welcome-collapse-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.welcome-collapse-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.welcome-collapse-enter-from,
.welcome-collapse-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.99);
  max-height: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.welcome-collapse-enter-to,
.welcome-collapse-leave-from {
  max-height: 400px; /* Doit être supérieur à la taille max de ta box */
}
</style>
