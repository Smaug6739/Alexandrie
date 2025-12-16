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
    <div v-else class="app-select-trigger" @click.stop="toggleDropdown">
      <button style="height: 30px">{{ selected?.label || placeholder }}</button>
      <svg :class="{ rotated: !open }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="var(--font-color)">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </div>

    <!-- Desktop dropdown -->
    <Teleport to="body">
      <ul v-if="open && !isMobile" ref="portalList" class="dropdown" :style="dropdownStyle">
        <AppSelectNode v-if="nullable" :node="{ id: '', label: '— Remove selection —' }" :level="0" @select="clearSelection" />
        <AppSelectNode v-for="item in filteredItems" :key="item.id" :node="item" :level="0" :disabled="disabled" @select="handleSelect" />
        <slot name="list-footer"></slot>
      </ul>
    </Teleport>

    <!-- Mobile: Bottom Sheet Modal -->
    <Teleport to="body">
      <Transition name="mobile-sheet">
        <div v-if="open && isMobile()" class="mobile-overlay" @click.self="toggleDropdown">
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
              <AppSelectNode v-if="nullable" :node="{ id: '', label: '— Remove selection —' }" :level="0" @select="clearSelection" />
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
      if (isMobile()) {
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

.app-select-trigger {
  display: flex;
  padding: 2px;
  align-items: center;
  justify-content: space-between;
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
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(0 0 0 / 50%);
}

.mobile-sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 85vh;
  border-radius: 16px 16px 0 0;
  background: var(--bg-color);
  animation: slide-up 0.3s ease-out;
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
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.mobile-sheet-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.mobile-sheet-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--bg-secondary, #f5f5f5);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-hover, #e0e0e0);
  }
}

.mobile-search-wrapper {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary, #f9f9f9);
}

.mobile-search-input {
  flex: 1;
  height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  font-size: 1rem;

  &:focus {
    border-color: var(--primary);
    outline: none;
  }
}

.mobile-list {
  flex: 1;
  margin: 0;
  padding: 8px;
  list-style: none;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  :deep(.app-select-node) {
    padding: 14px 16px;
    border-radius: 8px;
    font-size: 1rem;
    transition: background 0.15s;

    &:active {
      background: var(--bg-hover, #f0f0f0);
    }
  }

  :deep(.app-select-node.selected) {
    background: var(--primary-light, #e3f2fd);
    color: var(--primary);
    font-weight: 500;
  }
}

.mobile-no-results {
  padding: 24px 16px;
  color: var(--font-color-light, #888);
  text-align: center;
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
