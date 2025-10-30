<template>
  <div class="accordion-item" :class="{ open: isOpen, disabled }">
    <button
      :id="triggerId"
      class="accordion-trigger"
      type="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="contentId"
      :disabled="disabled"
      @click="onToggle"
      @keydown.enter.prevent="onToggle"
      @keydown.space.prevent="onToggle"
    >
      <span class="accordion-title">{{ summary }}</span>
      <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5" />
      </svg>
    </button>

    <transition name="accordion-expand" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-show="isOpen" :id="contentId" ref="contentEl" class="accordion-content-wrapper" role="region" :aria-labelledby="triggerId">
        <div class="accordion-content">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ summary: string; modelValue?: boolean; open?: boolean; disabled?: boolean }>(), {
  modelValue: undefined,
  open: undefined,
  disabled: false,
});

const emit = defineEmits<{ (e: 'update:modelValue' | 'toggle', value: boolean): void }>();

const uuid = Math.random().toString(36).slice(2);
const triggerId = `acc-trigger-${uuid}`;
const contentId = `acc-content-${uuid}`;

const internalOpen = ref<boolean>(false);
const isControlled = computed(() => props.modelValue !== undefined || props.open !== undefined);
const isOpen = computed<boolean>(() => (props.modelValue ?? props.open ?? internalOpen.value) as boolean);

const contentEl = ref<HTMLDivElement | null>(null);

function onToggle() {
  const next = !isOpen.value;
  if (isControlled.value) {
    emit('update:modelValue', next);
    emit('toggle', next);
  } else {
    internalOpen.value = next;
    emit('toggle', next);
    emit('update:modelValue', next);
  }
}

function onEnter(el: Element) {
  const elDiv = el as HTMLDivElement;
  elDiv.style.maxHeight = '0px';
  elDiv.style.opacity = '0';
  requestAnimationFrame(() => {
    const scrollH = elDiv.scrollHeight;
    elDiv.style.maxHeight = `${scrollH}px`;
    elDiv.style.opacity = '1';
  });
}

function onAfterEnter(el: Element) {
  const elDiv = el as HTMLDivElement;
  elDiv.style.maxHeight = 'none';
}

function onLeave(el: Element) {
  const elDiv = el as HTMLDivElement;
  const height = elDiv.scrollHeight;
  elDiv.style.maxHeight = `${height}px`;
  // Force reflow to ensure the transition starts from current height
  void elDiv.offsetHeight;
  elDiv.style.maxHeight = '0px';
  elDiv.style.opacity = '0';
}
</script>

<style scoped lang="scss">
.accordion-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  overflow: hidden;

  &.open {
    border-color: var(--primary);
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.1rem 1.4rem;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
    border-radius: 10px;
  }
}

.accordion-title {
  font-size: 1.05rem;
  color: var(--font-color, #111);
}

.chevron {
  width: 20px;
  height: 20px;
  stroke: #444;
  stroke-width: 2;
  fill: none;
  transition: transform 0.3s ease, stroke 0.3s ease;
}

.open .chevron {
  transform: rotate(180deg);
  stroke: var(--primary);
}

.accordion-content-wrapper {
  overflow: hidden;
}

.accordion-content {
  padding: 0 1.4rem 1.1rem 1.4rem;
  color: #555;
  line-height: 1.6;
  background: #fafafa;
  border-top: 1px solid #eee;
}

.accordion-expand-enter-active,
.accordion-expand-leave-active {
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}

.accordion-expand-enter-from,
.accordion-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

@media (min-width: 768px) {
  .accordion-title {
    font-size: 1.1rem;
  }

  .accordion-trigger {
    padding: 1.2rem 1.6rem;
  }

  .accordion-content {
    padding: 0 1.6rem 1.2rem 1.6rem;
  }
}
</style>
