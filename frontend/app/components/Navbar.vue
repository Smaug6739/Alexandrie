<template>
  <header :class="{ 'header--has-tabs': tabEnabled }">
    <div class="navbar">
      <div v-if="!isOpened && (!tabEnabled || isMobile)" class="navbar__left-trigger">
        <AppBtnIcon icon="burger" class="open-sidebar" @click="toggleSidebar" />
      </div>

      <div class="navbar__center">
        <div v-if="tabEnabled" class="navbar__tabs-wrapper">
          <AppBtnIcon v-if="!isOpened && !isMobile" icon="burger" class="open-sidebar inline-burger" @click="toggleSidebar" />
          <Tab class="navbar__tabs" />
        </div>

        <div id="navbar-title" class="navbar__title" />
      </div>

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

    <div v-if="navbarItems.breadcrumbNav" class="breadcrumbs">
      <NavigationBreadCrumbs />
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
const route = useRoute();
const { t } = useI18nT();
const { isMobile } = useDevice();
const { isOpened, toggleSidebar } = useSidebar();
const preferences = usePreferencesStore();
const commandCenter = useCommandCenter();

const navbarItems = preferences.get('navbarItems');
const tabEnabled = preferences.get('displayTabs');
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
$secondary-height: 40px;
$bp-md: 768px;

header {
  width: 100%;
  margin: 0 auto;
  border-bottom: 1px solid var(--border);
}

.navbar {
  display: flex;
  height: $navbar-height;
  padding: 0 4px;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.navbar__left-trigger {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar__center {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.navbar__title {
  display: flex;
  min-width: 0;
  font-size: 17px;
  font-weight: 600;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 100%;
}

/* Secondary Row (only if tabs are enabled) */
.header--has-tabs {
  .navbar {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-rows: $navbar-height auto;
    height: auto;
    padding-bottom: 8px;
    gap: 0 12px;
  }

  .navbar__left-trigger {
    grid-column: 1;
    grid-row: 1;
  }

  .navbar__center {
    grid-column: 2;
    grid-row: 1;
    display: contents;
  }

  .navbar__tabs-wrapper {
    grid-column: 1 / span 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  #navbar-title {
    grid-column: 1 / span 2;
    grid-row: 2;
    height: $secondary-height;
    padding-top: 4px;
  }

  .navbar__right {
    grid-column: 3;
    grid-row: 1;
    align-self: center;
  }
}

.navbar__tabs {
  flex: 1;
  min-width: 0;
}

.navbar__tabs-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 8px;

  .inline-burger {
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.navbar__tabs {
  flex: 1;
  min-width: 0;
}

.navbar__title {
  display: flex;
  min-width: 0;
  font-size: 17px;
  font-weight: 600;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Secondary Row */
.navbar__secondary {
  display: flex;
  height: $secondary-height;
  padding: 0 2px 6px 2px;
  align-items: center;
  justify-content: space-between;
}

.navbar__secondary-left {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

/* Right Actions Side (Toujours fixe, ne saute jamais) */
.navbar__right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
}

.navbar__actions-wrapper {
  display: flex;
  align-items: center;
}

.navbar__actions,
.navbar__infos {
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-btn {
  display: inline-flex;
  height: 36px;
  margin: 0;
  padding: 0 12px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--border);
  transition:
    background-color $transition-base ease,
    transform $transition-base ease;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    color: var(--text-primary);
    background: var(--selection-color);
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
  line-height: 1.4;
  background: var(--border);
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

.subnav-wrapper {
  display: flex;
  -ms-overflow-style: none;
  overflow-x: auto;
  scrollbar-width: none;

  @media (width <= 768px) {
    display: block;
    max-height: 0;
    transition: max-height $transition-base ease;
    overflow: hidden;

    .navbar__actions {
      width: 100%;
      padding: 10px 16px;
      flex-direction: column;
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
