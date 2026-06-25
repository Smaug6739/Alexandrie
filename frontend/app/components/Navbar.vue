<template>
  <header class="site-header">
    <div class="navbar">
      <!-- Left side: burger + title -->
      <div class="navbar__left">
        <AppBtnIcon v-if="!isOpened" icon="burger" class="open-sidebar" @click="toggleSidebar" />
        <div id="navbar-title" class="navbar__title" />
      </div>

      <!-- Right side: actions + infos -->
      <div class="navbar__right">
        <div ref="desktopActionsZone" class="navbar__actions-wrapper" />

        <button
          v-if="navbarItems.search"
          class="search-btn"
          :class="{ 'search-btn--compact': isMobile }"
          :title="t('components.navbar.commandCenter')"
          aria-label="Command center"
          @click="openCommandCenter"
        >
          <Icon name="search" display="lg" />
          <span v-if="!isMobile" class="search-btn__text">
            <i18n-t scope="global" keypath="components.navbar.searchHint">
              <template #key><kbd>/</kbd></template>
            </i18n-t>
          </span>
        </button>

        <div id="navbar-infos" class="navbar__infos" />
        <ThemeToggle v-if="navbarItems.theme" />

        <div v-if="hasSubnav" class="subnav-toggle" :class="{ 'is-open': subnavOpen }">
          <AppBtnIcon icon="nav_arrow" fill @click="subnavOpen = !subnavOpen" />
        </div>
      </div>
    </div>

    <!-- Bottom side -->
    <div v-if="navbarItems.breadcrumbNav" class="breadcrumbs">
      <BreadCrumbs />
    </div>

    <div class="subnav-wrapper" :class="{ 'subnav-wrapper--open': subnavOpen }" @vue:mounted="onSubnavMounted" @vue:updated="onSubnavMounted">
      <div ref="mobileActionsZone" class="navbar__actions-wrapper" />
      <hr v-if="hasBottomContent && isMobile && hasActionsContent" />
      <div id="navbar-bottom" />
    </div>

    <div style="display: none">
      <div id="navbar-actions" ref="navbarActionsEl" class="navbar__actions" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import BreadCrumbs from '~/components/Navigation/BreadCrumbs.vue';

const route = useRoute();
const { t } = useI18nT();
const { isMobile } = useDevice();
const { isOpened, toggleSidebar } = useSidebar();
const preferences = usePreferencesStore();
const commandCenter = useCommandCenter();

const navbarItems = preferences.get('navbarItems');
const openCommandCenter = () => commandCenter.open();

const subnavOpen = ref(false);
const hasSubnav = ref(false);
const hasActionsContent = ref(false);
const hasBottomContent = ref(false);

const desktopActionsZone = ref<HTMLElement | null>(null);
const mobileActionsZone = ref<HTMLElement | null>(null);
const navbarActionsEl = ref<HTMLElement | null>(null);

let observer: MutationObserver | null = null;

function checkSubnavContent() {
  const bottomEl = document.getElementById('navbar-bottom');
  hasBottomContent.value = !!(bottomEl && bottomEl.children.length > 0);

  hasActionsContent.value = !!(navbarActionsEl.value && navbarActionsEl.value.children.length > 0);

  hasSubnav.value = hasBottomContent.value || (isMobile.value && hasActionsContent.value);
}

function routeActionsElement() {
  if (!navbarActionsEl.value) return;

  if (isMobile.value) {
    mobileActionsZone.value?.appendChild(navbarActionsEl.value);
  } else {
    desktopActionsZone.value?.appendChild(navbarActionsEl.value);
  }
}

onMounted(() => {
  routeActionsElement();
  observer = new MutationObserver(checkSubnavContent);
  nextTick(() => {
    const bottomEl = document.getElementById('navbar-bottom');
    if (bottomEl) {
      observer?.observe(bottomEl, { childList: true, subtree: true });
    }
    if (navbarActionsEl.value) {
      observer?.observe(navbarActionsEl.value, { childList: true, subtree: true });
    }
    checkSubnavContent();
  });
});

watch(isMobile, () => routeActionsElement(), { flush: 'post' });

function onSubnavMounted() {
  const el = document.getElementById('navbar-bottom');
  const hasBottomContent = !!(el && el.children.length > 0);
  const hasActionsContent = !!(navbarActionsEl.value && navbarActionsEl.value.children.length > 0);
  hasSubnav.value = hasBottomContent || (isMobile.value && hasActionsContent);
}

watch(
  () => route.fullPath,
  () => (subnavOpen.value = false),
);
</script>

<style lang="scss" scoped>
$navbar-height: 56px;
$subnav-height: 44px;
$bp-md: 768px;

.site-header {
  width: 98%;
  margin: 0 auto;
  border-bottom: 1px solid var(--border);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $navbar-height;
  gap: 8px;
  padding: 0 4px;
}

.navbar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.navbar__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.navbar__right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.navbar__infos {
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  margin: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--border);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color $transition-base ease,
    transform $transition-base ease;

  &:hover {
    background: var(--selection-color);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &--compact {
    width: 36px;
    padding: 0;
    justify-content: center;

    .search-btn__text {
      display: none;
    }
  }
}

kbd {
  padding: 1px 5px;
  border: 1px solid var(--text-secondary);
  border-radius: var(--radius-xs);
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
  background: var(--border);
  line-height: 1.4;
}

.subnav-toggle {
  display: none;

  @media (max-width: #{$bp-md - 1px}) {
    display: inline-flex;
  }

  transition: transform $transition-base ease;

  &.is-open {
    transform: rotate(180deg);
  }
}

.breadcrumbs {
  padding: 4px 4px 6px;
  font-size: 13px;
}

.navbar__actions-wrapper {
  display: flex;
  align-items: center;
}

.subnav-wrapper {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media (max-width: 768px) {
    display: block;
    max-height: 0;
    overflow: hidden;
    transition: max-height $transition-base ease;

    .navbar__actions {
      flex-direction: column;
      width: 100%;
      padding: 10px 16px;
      gap: 8px;

      :deep(> *) {
        width: 100%;
      }
    }

    &--open {
      max-height: 600px;
    }
  }
}
</style>
