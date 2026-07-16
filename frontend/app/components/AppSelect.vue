<template>
  <div ref="trigger" class="select" :style="{ width: size || '100%', borderColor: open ? 'var(--primary)' : 'var(--border)' }">
    <!-- Desktop: inline search input -->
    <input
      v-if="open && searchable && !isMobile"
      ref="searchInput"
      v-model="search"
      type="text"
      :placeholder="t('common.placeholder.search')"
      class="search"
      @keydown="handleKeyDown"
      @click.stop
    />
    <div v-else class="trigger" @click.stop="toggleDropdown">
      <button class="value">{{ selected?.label || placeholder }}</button>
      <svg :class="{ rotated: !open }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="var(--text-body)">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </div>

    <!-- Desktop dropdown -->
    <Teleport to="body">
      <ul v-if="open && !isMobile" ref="portalList" class="dropdown" :style="dropdownStyle">
        <li v-if="nullable && selected" class="clear" @click="clearSelection">
          <Icon name="close" display="sm" fill="var(--text-secondary)" />
          <span>Clear selection</span>
        </li>
        <AppSelectNode v-for="item in filteredItems" :key="item.id" :node="item" :level="0" :disabled="disabled" @select="handleSelect" />
        <slot name="list-footer"></slot>
      </ul>
    </Teleport>

    <!-- Mobile: Bottom Sheet Modal -->
    <Teleport to="body">
      <div v-if="open && isMobile" class="overlay" @click.self="toggleDropdown">
        <div class="sheet">
          <header>
            <span class="sheet-title">{{ placeholder }}</span>
            <button class="close-btn" @click="toggleDropdown">
              <Icon name="close" display="md" fill="var(--text-body)" />
            </button>
          </header>

          <div v-if="searchable" class="sheet-search">
            <Icon name="search" display="md" fill="var(--text-secondary)" />
            <input ref="mobileSearchInput" v-model="search" type="text" :placeholder="t('common.placeholder.search')" @keydown="handleKeyDown" />
          </div>

          <ul class="sheet-list">
            <li v-if="nullable && selected" class="clear" @click="clearSelection">
              <Icon name="close" display="sm" fill="var(--text-secondary)" />
              <span>{{ t('common.actions.clear') }}</span>
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
            <li v-if="filteredItems.length === 0" class="empty">{{ t('common.search.noResults', { filter: search }) }}</li>
            <slot name="list-footer"></slot>
          </ul>
        </div>
      </div>
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
const { t } = useI18nT();

const localValue = ref(props.modelValue ?? '');

watch(
  () => props.modelValue,
  newVal => {
    localValue.value = newVal ?? '';
  },
);

const selectedId = computed({
  get: () => localValue.value,
  set: val => {
    localValue.value = val;
    emit('update:modelValue', val);
  },
});
const open = ref(false);
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const mobileSearchInput = ref<HTMLInputElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const portalList = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

const selected = computed(() => {
  const findSelected = (items: ANode[]): ANode | null => {
    for (const item of items) {
      if (item.id === selectedId.value) return item;
      if (item.children) {
        const found = findSelected(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findSelected(props.items);
});

const clearSelection = () => {
  selectedId.value = '';
  toggleDropdown();
};

const filteredItems = computed(() => {
  if (!search.value.trim()) return props.items;
  return filterRecursive(props.items, search);
});

function updatePosition() {
  if (!open.value) return;
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

function openDropdown() {
  open.value = true;
  search.value = '';
  nextTick(() => {
    if (isMobile.value) {
      document.body.style.overflow = 'hidden';
      mobileSearchInput.value?.focus();
    } else {
      updatePosition();
      searchInput.value?.focus();
    }
  });
}

function closeDropdown() {
  open.value = false;
  document.body.style.overflow = '';
}

function toggleDropdown() {
  if (open.value) closeDropdown();
  else openDropdown();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDropdown();
  } else if (event.key === 'Enter') {
    const firstItem = filteredItems.value[0];
    if (firstItem) handleSelect(firstItem);
  }
}

function handleSelect(node: ANode) {
  selectedId.value = node.id;
  closeDropdown();
}

function handleClickOutside(e: MouseEvent) {
  // use composedPath for shadow-dom-safe detection
  const path = (e.composedPath && e.composedPath()) || (e as unknown as { path: EventTarget[] }).path || [];
  const targetIsInsideTrigger = trigger.value && (path.length ? path.includes(trigger.value) : trigger.value.contains(e.target as Node));
  const targetIsInsidePortal = portalList.value && (path.length ? path.includes(portalList.value) : portalList.value.contains(e.target as Node));

  if (!targetIsInsideTrigger && !targetIsInsidePortal) {
    closeDropdown();
  }
}

let listenersBound = false;

function addGlobalListeners() {
  if (listenersBound || !import.meta.client) return;
  listenersBound = true;
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
}

function removeGlobalListeners() {
  if (!listenersBound || !import.meta.client) return;
  listenersBound = false;
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
}

watch(open, isOpen => {
  if (isOpen) addGlobalListeners();
  else removeGlobalListeners();
});

onBeforeUnmount(() => {
  removeGlobalListeners();
  // Ensure body scroll is restored
  document.body.style.overflow = '';
});

const filterRecursive = <T extends ANode>(items: T[], filter: Ref<string>): T[] => {
  return items
    .map(item => {
      const matches = item.label.toLowerCase().includes(filter.value.toLowerCase());
      const filteredChildren = item.children ? filterRecursive(item.children, filter) : [];
      if (matches || filteredChildren.length > 0) {
        return { ...item, children: filteredChildren };
      }
      return null;
    })
    .filter(Boolean) as T[];
};
</script>

<style scoped lang="scss">
.select {
  position: relative;
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: $font-ui;
  background: var(--surface-base);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;

  &:hover {
    border-color: var(--text-secondary);
  }

  // Quand le dropdown est ouvert
  &[style*='var(--primary)'] {
    box-shadow: 0 0 0 2px rgb(var(--primary-rgb, 59, 130, 246), 0.15);
  }
}

.trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
}

.value {
  height: 32px;
  padding: 0 12px;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    opacity: 0.7;
    transition: transform $transition-fast;
    transform: rotate(180deg);

    &.rotated {
      transform: rotate(360deg);
    }
  }
}

button.value {
  width: 100%;
  padding: 0;
  border: none;
  font-size: 0.95rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}

.search {
  width: 100%;
  height: 32px;
  padding: 0 6px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  color: var(--text-body);
  background: transparent;

  &:focus {
    outline: none;
  }
}

// ===========================
// Desktop Dropdown (Portal)
// ===========================
.dropdown {
  max-height: 280px;
  margin: 4px 0 0;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-base);
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 10%),
    0 4px 6px -4px rgb(0 0 0 / 5%);
  animation: dropdown-fade-in $transition-fast;
  list-style: none;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: var(--border);
  }
}

@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ===========================
// Mobile Bottom Sheet
// ===========================
.overlay {
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: rgb(0 0 0 / 40%);
  backdrop-filter: blur(4px);
  inset: 0;
}

.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 80vh;
  border-radius: 16px 16px 0 0;
  background: var(--surface-base);
  box-shadow:
    0 -10px 25px -5px rgb(0 0 0 / 10%),
    0 -8px 10px -6px rgb(0 0 0 / 10%);
  animation: slide-up $transition-medium cubic-bezier(0.16, 1, 0.3, 1);

  header {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.sheet-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-body);
}

.close-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--surface-raised);
  cursor: pointer;
  transition:
    background $transition-fast,
    transform 0.1s;

  &:hover {
    background: var(--border);
  }

  &:active {
    transform: scale(0.95);
  }
}

.sheet-search {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  height: 44px;
  margin: 16px 20px 8px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-base);
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgb(var(--primary-rgb, 59, 130, 246), 0.15);
  }

  input {
    flex: 1;
    height: 100%;
    padding: 8px 12px;
    border: none;
    font-size: 0.95rem;
    color: var(--text-body);
    background: transparent;

    &:focus {
      outline: none;
    }
  }
}

.sheet-list {
  flex: 1;
  margin: 0;
  padding: 12px 16px;
  list-style: none;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;

  :deep(.tree-node) {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    color: var(--text-body);
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: var(--surface-raised);
    }
  }

  :deep(.tree-node.selected) {
    font-weight: 500;
    color: var(--primary);
    background: var(--selection-color);
  }
}

.clear {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0 6px;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-bottom: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background $transition-fast,
    color $transition-fast;

  &:hover {
    color: var(--red);
    background: var(--surface-raised);

    :deep(svg) {
      fill: var(--red);
    }
  }
}

.empty {
  padding: 32px 16px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
}
</style>
