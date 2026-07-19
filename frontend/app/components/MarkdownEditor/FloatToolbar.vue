<template>
  <Transition name="fade-slide">
    <div
      v-if="visible"
      class="float-toolbar"
      :class="{ 'position-below': positionBelow }"
      :style="{ top: `${top}px`, left: `${left}px` }"
      @mousedown.prevent
    >
      <template v-if="!showColors">
        <button
          v-for="item in styleTools"
          :key="item.action"
          class="toolbar-btn"
          :aria-label="item.name"
          @click.prevent="runAction(item.action)"
        >
          <span class="btn-text" :class="item.styleClass">
            <Icon :name="item.icon" />
          </span>
          <span class="tooltip">{{ item.name }}</span>
        </button>

        <div class="toolbar-divider" />

        <!-- Color -->
        <button
          class="toolbar-btn color-trigger"
          :aria-label="t('markdown.toolbar.color')"
          @click.prevent="showColors = true"
        >
          <span class="btn-text btn-color">
            <Icon name="format/color" />
          </span>
          <span class="tooltip">{{ t('markdown.toolbar.color') }}</span>
        </button>

        <div class="toolbar-divider" />

        <!-- Clear Style, need to fix the icon -->
        <button
          class="toolbar-btn clear-btn"
          :aria-label="t('markdown.toolbar.clearFormatting')"
          @click.prevent="runAction('clearFormatting')"
        >
          <span class="btn-text btn-clear">
            <Icon name="format/clear-formatting" />
          </span>
          <span class="tooltip">{{ t('markdown.toolbar.clearFormatting') }}</span>
        </button>
      </template>

      <template v-else>
        <!-- Back Button -->
        <button
          class="toolbar-btn back-btn"
          :aria-label="t('common.actions.back')"
          @click.prevent="showColors = false"
        >
          <span class="btn-text btn-back">‹</span>
        </button>

        <div class="toolbar-divider" />

        <!-- Color Swatches -->
        <div class="colors-row">
          <button
            v-for="color in fiveColors"
            :key="color"
            class="color-dot"
            :style="{ background: `var(--${color})` }"
            :aria-label="color"
            @click.prevent="runAction('color', color)"
          >
            <span class="tooltip">{{ color }}</span>
          </button>
        </div>
      </template>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { EditorView } from '@codemirror/view';

const { t } = useI18nT();

const props = defineProps<{
  editorView: EditorView | null;
}>();

const emit = defineEmits<{
  (e: 'execute-action', action: string, payload?: string): void;
}>();

const visible = ref(false);
const showColors = ref(false);
const positionBelow = ref(false);
const top = ref(0);
const left = ref(0);

const fiveColors = ['blue', 'green', 'red', 'orange', 'pink'];

const styleTools = [
  { name: t('markdown.toolbar.bold'), icon: 'format/bold', action: 'bold', styleClass: 'btn-bold' },
  { name: t('markdown.toolbar.italic'), icon: 'format/italic', action: 'italic', styleClass: 'btn-italic' },
  { name: t('markdown.toolbar.underline'), icon: 'format/underline', action: 'underline', styleClass: 'btn-underline' },
  { name: t('markdown.toolbar.strikethrough'), icon: 'format/strikethrough', action: 'strike', styleClass: 'btn-strike' },
  { name: t('markdown.toolbar.link'), icon: 'format/link', action: 'link', styleClass: 'btn-link' },
  { name: t('markdown.toolbar.inlineCode'), icon: 'format/code', action: 'code', styleClass: 'btn-code' },
];

const runAction = (action: string, payload?: string) => {
  emit('execute-action', action, payload);
  if (action === 'color') {
    showColors.value = false;
  }
  nextTick(() => {
    props.editorView?.focus();
  });
};

const updatePosition = () => {
  const view = props.editorView;
  if (!view) {
    visible.value = false;
    return;
  }

  const state = view.state;
  const sel = state.selection.main;

  if (sel.empty || sel.from === sel.to) {
    visible.value = false;
    showColors.value = false;
    return;
  }

  const startCoords = view.coordsAtPos(sel.from);
  const endCoords = view.coordsAtPos(sel.to);

  if (!startCoords || !endCoords) {
    visible.value = false;
    showColors.value = false;
    return;
  }

  const topVal = Math.min(startCoords.top, endCoords.top);
  const bottomVal = Math.max(startCoords.bottom, endCoords.bottom);

  if (topVal < 60) {
    positionBelow.value = true;
    top.value = bottomVal + 8;
  } else {
    positionBelow.value = false;
    top.value = topVal - 8;
  }

  left.value = (startCoords.left + endCoords.left) / 2;
  visible.value = true;
};

const handleSelectionChange = () => {
  requestAnimationFrame(updatePosition);
};

onMounted(() => {
  document.addEventListener('selectionchange', handleSelectionChange);
  window.addEventListener('resize', handleSelectionChange);
  
  if (props.editorView) {
    props.editorView.scrollDOM.addEventListener('scroll', handleSelectionChange);
  }
  
  handleSelectionChange();
});

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
  window.removeEventListener('resize', handleSelectionChange);
  
  if (props.editorView) {
    props.editorView.scrollDOM.removeEventListener('scroll', handleSelectionChange);
  }
});

watch(() => props.editorView, (newView, oldView) => {
  if (oldView) {
    oldView.scrollDOM.removeEventListener('scroll', handleSelectionChange);
  }
  if (newView) {
    newView.scrollDOM.addEventListener('scroll', handleSelectionChange);
  }
  handleSelectionChange();
});
</script>

<style scoped lang="scss">
.float-toolbar {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background-color: var(--surface-base) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18), 0 1px 4px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transform: translate(-50%, -100%);
  transition: opacity 0.15s ease, transform 0.15s ease;
  pointer-events: auto;

  &.position-below {
    transform: translate(-50%, 0);
  }
}

.toolbar-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  transition: all 0.12s ease;

  &:hover {
    background: var(--surface-overlay) !important;
    transform: translateY(-1px);

    .btn-text {
      color: var(--primary) !important;
    }

    .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.btn-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary) !important;
  transition: color 0.12s ease;
  user-select: none;

  :deep(svg) {
    display: block;
    width: 14px;
    height: 14px;
    fill: currentColor !important;
    color: inherit;
  }
}

.btn-bold {
  font-weight: 800;
}

.btn-italic {
  font-style: italic;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 15px;
}

.btn-underline {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-strike {
  text-decoration: line-through;
}

.btn-link {
  font-size: 12px;
}

.btn-code {
  font-family: monospace;
  font-size: 11px;
  letter-spacing: -0.5px;
}

.btn-color {
  font-weight: 800;
  color: var(--primary) !important;
}

.btn-clear {
  font-weight: 600;
  opacity: 0.8;
}

.btn-back {
  font-size: 18px;
  font-weight: bold;
}

.toolbar-divider {
  width: 1px;
  height: 18px;
  background-color: var(--border);
  margin: 0 2px;
}

.colors-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.color-dot {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-2px) scale(1.15);
    box-shadow: var(--shadow-md);
    border-color: var(--text-primary);

    .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: var(--surface-overlay);
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
  margin-bottom: 6px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -90%) scale(0.95);
  
  &.position-below {
    transform: translate(-50%, 10px) scale(0.95);
  }
}
</style>
