<template>
  <header :class="{ 'header--has-tabs': tabEnabled }">
    <div class="navbar">
      <div v-if="!isOpened && (!tabEnabled || isMobile)" class="navbar-left-trigger">
        <AppBtnIcon icon="burger" class="open-sidebar" @click="toggleSidebar" />
      </div>

      <div class="navbar-center">
        <div v-if="tabEnabled" class="navbar-tabs-wrapper">
          <AppBtnIcon v-if="!isOpened && !isMobile" icon="burger" class="open-sidebar inline-burger" @click="toggleSidebar" />
          <Tab class="navbar-tabs" />
        </div>

        <div id="navbar-title" class="navbar-title" />
      </div>

      <div class="navbar-right">
        <div ref="desktopActionsZone" class="navbar-actions-wrapper" />

        <button
          v-if="navbarItems.search"
          class="search-btn"
          :class="{ 'search-btn--compact': isMobile }"
          :title="t('components.navbar.commandCenter')"
          aria-label="Command center"
          @click="openCommandCenter"
        >
          <Icon name="search" display="lg" />
          <span v-if="!isMobile" class="search-btn-text">
            <i18n-t scope="global" keypath="components.navbar.searchHint">
              <template #key><kbd>/</kbd></template>
            </i18n-t>
          </span>
        </button>

        <div id="navbar-infos" class="navbar-infos" />
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
      <div ref="mobileActionsZone" class="navbar-actions-wrapper" />
      <hr v-if="hasBottomContent && isMobile && hasActionsContent" />
      <div id="navbar-bottom" />
    </div>

    <div style="display: none">
      <div id="navbar-actions" ref="navbarActionsEl" class="navbar-actions" />
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

header {
  width: 100%;
  margin: 0 auto;
  border-bottom: 1px solid var(--border);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  height: $navbar-height;
  padding: 0 4px;
}

.navbar-left-trigger {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.navbar-center {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

/* Secondary Row (only if tabs are enabled) */
.header--has-tabs {
  .navbar {
    display: grid;
    grid-template-rows: $navbar-height auto;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0 12px;
    height: auto;
    padding-bottom: 8px;
  }

  .navbar-left-trigger {
    grid-column: 1;
    grid-row: 1;
  }

  .navbar-center {
    display: contents;
    grid-column: 2;
    grid-row: 1;
  }

  #navbar-title {
    grid-column: 1 / span 2;
    grid-row: 2;
    height: $secondary-height;
    padding-top: 4px;
  }

  .navbar-right {
    align-self: center;
    grid-column: 3;
    grid-row: 1;
  }
}

.navbar-tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;

  .inline-burger {
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.navbar-tabs {
  flex: 1;
  min-width: 0;
}

.navbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  height: 100%;
  font-size: 17px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* Secondary Row */
.navbar-secondary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $secondary-height;
  padding: 0 2px 6px;
}

.navbar-secondary-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* Right Actions Side (Toujours fixe, ne saute jamais) */
.navbar-right {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
}

.navbar-actions-wrapper {
  display: flex;
  align-items: center;
}

.navbar-actions,
.navbar-infos {
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  margin: 0;
  padding: 0 12px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  background: var(--border);
  cursor: pointer;
  transition:
    background-color $transition-base ease,
    transform $transition-base ease;

  &:hover {
    color: var(--text-primary);
    background: var(--selection-color);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &--compact {
    justify-content: center;
    width: 36px;
    padding: 0;

    .search-btn-text {
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

  @media (width <= 768px) {
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

    .navbar-actions {
      flex-direction: column;
      gap: 8px;
      width: 100%;
      padding: 10px 16px;

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
