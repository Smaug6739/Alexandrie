<template>
  <div ref="trigger" class="app-select" :style="{ width: size || '100%' }">
    <!-- Desktop: inline search input -->
    <input
      v-if="open && searchable && !isMobile"
      ref="searchInput"
      v-model="search"
      type="text"
      placeholder="Search..."
      class="search-input"
      @keydown="handleKeyDown"
      @click.stop
    />
    <div v-else class="trigger" @click.stop="toggleDropdown">
      <button class="trigger-button">{{ selected?.label || placeholder }}</button>
      <svg :class="{ rotated: !open }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="var(--font-color)">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </div>

    <!-- Desktop dropdown -->
    <Teleport to="body">
      <ul v-if="open && !isMobile" ref="portalList" class="dropdown" :style="dropdownStyle">
        <li v-if="nullable && selected" class="clear-option" @click="clearSelection">
          <Icon name="close" display="sm" fill="var(--font-color-light)" />
          <span>Clear selection</span>
        </li>
        <AppSelectNode v-for="item in filteredItems" :key="item.id" :node="item" :level="0" :disabled="disabled" @select="handleSelect" />
        <slot name="list-footer"></slot>
      </ul>
    </Teleport>

    <!-- Mobile: Bottom Sheet Modal -->
    <Teleport to="body">
      <Transition name="mobile-sheet">
        <div v-if="open && isMobile" class="mobile-overlay" @click.self="toggleDropdown">
          <div class="mobile-sheet">
            <div class="mobile-sheet-header">
              <span class="mobile-sheet-title">{{ placeholder }}</span>
              <button class="mobile-sheet-close" @click="toggleDropdown">
                <Icon name="close" display="md" fill="var(--font-color)" />
              </button>
            </div>

            <div v-if="searchable" class="mobile-search-wrapper">
              <Icon name="search" display="md" fill="var(--font-color-light)" />
              <input ref="mobileSearchInput" v-model="search" type="text" placeholder="Search..." class="mobile-search-input" @keydown="handleKeyDown" />
            </div>

            <ul class="mobile-list">
              <li v-if="nullable && selected" class="clear-option" @click="clearSelection">
                <Icon name="close" display="sm" fill="var(--font-color-light)" />
                <span>Clear selection</span>
              </li>
              <AppSelectNode
                v-for="item in filteredItems"
                :key="item.id"
                :node="item"
                :level="0"
                :disabled="disabled"
                :selected-id="selectedId"
                @select="handleSelect"
              />
              <li v-if="filteredItems.length === 0" class="mobile-no-results">No results found</li>
              <slot name="list-footer"></slot>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: ANode[];
    placeholder?: string;
    modelValue?: string | number;
    size?: string;
    disabled?: (i: ANode) => boolean;
    nullable?: boolean;
    searchable?: boolean;
  }>(),
  {
    placeholder: 'Select an option',
    searchable: true,
    nullable: false,
    disabled: () => false,
    modelValue: '',
    size: undefined,
  },
);

const emit = defineEmits(['update:modelValue']);

const { isMobile } = useDevice();

const selectedId = computed({
  get: () => props.modelValue ?? '',
  set: val => emit('update:modelValue', val),
});
const open = ref(false);
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const mobileSearchInput = ref<HTMLInputElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const portalList = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

// Mobile detection
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

const selected = computed(() => {
  const findSelected = (items: ANode[]): ANode | null => {
    for (const item of items) {
      if (item.id === selectedId.value) return item;
      if (item.childrens) {
        const found = findSelected(item.childrens);
        if (found) return found;
      }
    }
    return null;
  };
  return findSelected(props.items);
});

const clearSelection = () => {
  selectedId.value = '';
  emit('update:modelValue', null);
  toggleDropdown();
};

const filteredItems = computed(() => {
  if (!search.value.trim()) return props.items;
  return filterRecursive(props.items, search);
});

function updatePosition() {
  const el = searchInput.value ?? trigger.value;
  if (!el || !portalList.value) return;

  const rect = el.getBoundingClientRect();
  const dropdownEl = portalList.value;

  const dropdownHeight = Math.min(dropdownEl.scrollHeight, 300); // choose between real height if < 300 or 300 (max height)

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const openUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

  dropdownStyle.value = {
    position: 'absolute',
    top: openUp ? `${rect.top + window.scrollY - dropdownHeight}px` : `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    zIndex: '1000',
  };
}

function toggleDropdown() {
  open.value = !open.value;
  if (open.value) {
    search.value = '';
    nextTick(() => {
      if (isMobile.value) {
        // Lock body scroll on mobile
        document.body.style.overflow = 'hidden';
        mobileSearchInput.value?.focus();
      } else {
        updatePosition();
        searchInput.value?.focus();
      }
    });
  } else {
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false;
  } else if (event.key === 'Enter') {
    const firstItem = filteredItems.value[0];
    if (firstItem) handleSelect(firstItem);
  }
}

function handleSelect(node: ANode) {
  selectedId.value = node.id;
  emit('update:modelValue', node.id);
  open.value = false;
  document.body.style.overflow = '';
}

function handleClickOutside(e: MouseEvent) {
  // use composedPath for shadow-dom-safe detection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
  const targetIsInsideTrigger = trigger.value && (path.length ? path.includes(trigger.value) : trigger.value.contains(e.target as Node));
  const targetIsInsidePortal = portalList.value && (path.length ? path.includes(portalList.value) : portalList.value.contains(e.target as Node));

  if (!targetIsInsideTrigger && !targetIsInsidePortal) {
    open.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('resize', updateWindowWidth);
  // capture scroll on ancestors too
  window.addEventListener('scroll', updatePosition, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('resize', updateWindowWidth);
  window.removeEventListener('scroll', updatePosition, true);
  // Ensure body scroll is restored
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.app-select {
  position: relative;
  width: 100%;
  margin: 0;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);

  &:focus {
    outline: 1px solid var(--primary);
  }
}

.trigger {
  display: flex;
  padding: 2px;
  align-items: center;
  justify-content: space-between;
}
.trigger-button {
  height: 30px;
}

button,
.search-input {
  width: 100%;
  height: 34px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
}

.search-input {
  padding: 7px 10px;
  border: none;
  cursor: text;
}

/* Teleported element : attention au scoped styles + teleport.
   :deep permet d'appliquer les règles même si l'élément est rendu hors-DOM parent */
.dropdown {
  max-height: 300px;
  margin: 0;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  list-style: none;
  overflow-y: auto;
}

/* ========================
   Mobile Bottom Sheet Styles
   ======================== */
.mobile-overlay {
  position: fixed;
  z-index: 1000;
  display: flex;
  background: rgb(0 0 0 / 50%);
  align-items: flex-end;
  inset: 0;
  justify-content: center;
}

.mobile-sheet {
  display: flex;
  width: 100%;
  max-height: 85vh;
  border-radius: 16px 16px 0 0;
  background: var(--bg-color);
  animation: slide-up 0.3s ease-out;
  flex-direction: column;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.mobile-sheet-header {
  display: flex;
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  justify-content: space-between;
}

.mobile-sheet-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.mobile-sheet-close {
  display: flex;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--bg-contrast);
  transition: background 0.2s;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    background: var(--selection-color);
  }
}

.mobile-search-wrapper {
  display: flex;
  padding: 12px 16px;
  background: var(--bg-contrast);
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  gap: 8px;
}

.mobile-search-input {
  height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-color);
  flex: 1;

  &:focus {
    border-color: var(--primary);
    outline: none;
  }
}

.mobile-list {
  margin: 0;
  padding: 8px;
  flex: 1;
  list-style: none;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;

  :deep(.app-select-node) {
    padding: 14px 16px;
    border-radius: 8px;
    font-size: 1rem;
    transition: background 0.15s;

    &:active {
      background: var(--selection-color);
    }
  }

  :deep(.app-select-node.selected) {
    font-weight: 500;
    color: var(--primary);
    background: var(--selection-color);
  }
}

.mobile-no-results {
  padding: 24px 16px;
  color: var(--font-color-light);
  text-align: center;
}

/* Clear selection option */
.clear-option {
  display: flex;
  margin: 2px 0 6px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--font-color-light);
  transition: all 0.15s ease;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  gap: 8px;

  &:hover {
    color: var(--red);
    background: var(--selection-color);

    :deep(svg) {
      fill: var(--red);
    }
  }

  span {
    font-weight: 400;
  }
}

/* Transitions */
.mobile-sheet-enter-active,
.mobile-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-sheet-enter-active .mobile-sheet,
.mobile-sheet-leave-active .mobile-sheet {
  transition: transform 0.3s ease;
}

.mobile-sheet-enter-from,
.mobile-sheet-leave-to {
  opacity: 0;
}

.mobile-sheet-enter-from .mobile-sheet,
.mobile-sheet-leave-to .mobile-sheet {
  transform: translateY(100%);
}
</style>
