<template>
  <div class="toolbar">
    <!-- Text Formatting Group -->
    <div :class="['toolbar-group', { 'no-mobile': mobileSimplifiedView }]">
      <div class="group-buttons">
        <button v-for="item in formattingTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div :class="['toolbar-divider', { 'no-mobile': mobileSimplifiedView }]" />

    <!-- Extended Formatting Group -->
    <div :class="['toolbar-group', { 'no-mobile': mobileSimplifiedView }]">
      <div class="group-buttons">
        <button v-for="item in extendedFormattingTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div :class="['toolbar-divider', { 'no-mobile': mobileSimplifiedView }]" />

    <!-- Insert Group -->
    <div :class="['toolbar-group', { 'no-mobile': mobileSimplifiedView }]">
      <div class="group-buttons">
        <button v-for="item in insertTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div :class="['toolbar-divider', { 'no-mobile': mobileSimplifiedView }]" />

    <!-- Structure Group -->
    <div :class="['toolbar-group', { 'no-mobile': mobileSimplifiedView }]">
      <div class="group-buttons">
        <button v-for="item in structureTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div :class="['toolbar-divider', { 'no-mobile': mobileSimplifiedView }]" />

    <!-- Voice & Category -->
    <div class="toolbar-group" style="align-items: center; flex: 1; flex-direction: row; gap: 4px">
      <div class="group-buttons">
        <VoiceRecognition :class="{ 'no-mobile': mobileSimplifiedView }" @transcription="handleTranscription" />
      </div>
      <AppSelect v-model="localValue.parent_id" :items="categories" placeholder="Category" class="category-select" />
    </div>

    <!-- Right Section -->
    <div class="toolbar-right">
      <!-- Stats Badge -->
      <div v-if="preferences.get('editorDisplayStats').value" class="stats-badge no-tablet">
        <div class="stat-item">
          <span class="stat-value">{{ stats.words }}</span>
          <span class="stat-label">words</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ stats.characters }}</span>
          <span class="stat-label">chars</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ stats.lines }}</span>
          <span class="stat-label">lines</span>
        </div>
      </div>

      <!-- Actions & Settings Group -->
      <div class="action-buttons">
        <button class="toolbar-btn btn-ghost" aria-label="Clear Formatting" @click="emitAction('clearFormatting')">
          <Icon name="format/clear-formatting" />
          <span class="tooltip">Clear Formatting<kbd>Ctrl+Shift+X</kbd></span>
        </button>
        <button
          v-for="item in actionTools"
          :key="item.name"
          class="toolbar-btn"
          :class="{ 'btn-primary': item.action === 'save', 'btn-accent': item.action === 'preview' }"
          :aria-label="item.name"
          @click="emitAction(item.action)"
        >
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
        <div class="action-divider" />
        <button class="toolbar-btn btn-ghost" aria-label="Settings" @click="openSettings">
          <Icon name="settings" display="lg" />
          <span class="tooltip">Editor Settings</span>
        </button>
        <button class="toolbar-btn btn-ghost" aria-label="Help" @click="openHelp">
          <Icon name="help" display="lg" />
          <span class="tooltip">Markdown Syntax</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
import ModalSyntax from './ModalSyntax.vue';
import VoiceRecognition from './VoiceRecognition.vue';
import EditorPreferences from './EditorPreferences.vue';

const props = defineProps<{
  modelValue: Partial<Node>;
}>();

const preferences = usePreferences();

const mobileSimplifiedView = preferences.get('editorSimplifiedViewOnMobile');

const stats = computed(() => {
  const content = props.modelValue.content || '';
  const words = content
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  const wordCount = words.length;
  return {
    characters: content.length,
    words: wordCount,
    lines: content.split('\n').length,
  };
});

const handleTranscription = (text: string) => {
  emit('execute-action', 'insertText', text);
};
const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<Node>): void;
  (e: 'execute-action', action: string, payload?: string): void;
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const emitAction = (action: string) => emit('execute-action', action);

const openHelp = () => useModal().add(new Modal(shallowRef(ModalSyntax), { size: 'large' }));
const openSettings = () => useModal().add(new Modal(shallowRef(EditorPreferences), { size: 'medium' }));

const nodesTree = useNodesTree();
const categories = nodesTree.categoriesTree;

// Tool type with optional shortcut
interface ToolItem {
  name: string;
  icon: string;
  action: string;
  shortcut?: string;
}

const formattingTools: ToolItem[] = [
  { name: 'Bold', icon: 'format/bold', action: 'bold', shortcut: 'Ctrl+B' },
  { name: 'Italic', icon: 'format/italic', action: 'italic', shortcut: 'Ctrl+I' },
  { name: 'Underline', icon: 'format/underline', action: 'underline', shortcut: 'Ctrl+U' },
  { name: 'Strikethrough', icon: 'format/strikethrough', action: 'strike', shortcut: 'Ctrl+Shift+S' },
  { name: 'Highlight', icon: 'format/highlight', action: 'mark', shortcut: 'Ctrl+Shift+H' },
];

const extendedFormattingTools: ToolItem[] = [
  { name: 'Superscript', icon: 'format/superscript', action: 'superscript' },
  { name: 'Subscript', icon: 'format/subscript', action: 'subscript' },
  { name: 'Color', icon: 'format/color', action: 'openColorPicker' },
];

const insertTools: ToolItem[] = [
  { name: 'Link', icon: 'format/link', action: 'link', shortcut: 'Ctrl+K' },
  { name: 'Image', icon: 'format/image', action: 'image', shortcut: 'Ctrl+Shift+I' },
  { name: 'Inline Code', icon: 'format/code', action: 'code', shortcut: 'Ctrl+E' },
  { name: 'Code Block', icon: 'format/code-block', action: 'codeBlock', shortcut: 'Ctrl+Shift+C' },
  { name: 'Math', icon: 'maths', action: 'mathInline', shortcut: 'Ctrl+M' },
  { name: 'Footnote', icon: 'format/footnote', action: 'footnote' },
];

const structureTools: ToolItem[] = [
  { name: 'Heading', icon: 'format/h1', action: 'h1', shortcut: 'Ctrl+[1-6]' },
  { name: 'Quote', icon: 'format/quote', action: 'quote', shortcut: 'Ctrl+Shift+.' },
  { name: 'Bullet List', icon: 'format/list-bulleted', action: 'list', shortcut: 'Ctrl+Shift+8' },
  { name: 'Numbered List', icon: 'format/list-ordered', action: 'orderedList', shortcut: 'Ctrl+Shift+7' },
  { name: 'Task List', icon: 'format/task-list', action: 'taskList', shortcut: 'Ctrl+Shift+9' },
  { name: 'Table', icon: 'format/table', action: 'gridOrganization' },
  { name: 'Horizontal Rule', icon: 'format/horizontal-rule', action: 'horizontalRule', shortcut: 'Ctrl+Shift+R' },
];

const actionTools: ToolItem[] = [
  { name: 'Preview', icon: 'preview', action: 'preview', shortcut: 'Ctrl+P' },
  { name: 'Save', icon: 'save', action: 'save', shortcut: 'Ctrl+S' },
  { name: 'Go to Document', icon: 'file_shortcut', action: 'goto' },
];
</script>
<style scoped lang="scss">
.toolbar {
  display: flex;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
  transition: box-shadow 0.2s ease;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 6px;
  margin-top: 8px;
  overflow-x: clip;
  user-select: none;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  }
}

.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group-buttons {
  display: flex;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--surface-transparent);
  gap: 1px;
}

.toolbar-btn {
  position: relative;
  display: flex;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  transition: background-color 0.15s ease;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    background: var(--surface-overlay);

    .tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      visibility: visible;
    }
  }
}

.btn-primary {
  border: 1px solid var(--border);
  background: var(--primary-bg);

  &:hover {
    border-color: var(--primary);
    background: var(--primary-bg);
  }
}

.btn-accent {
  border: 1px solid var(--border);
  background: var(--surface-raised);

  &:hover {
    border-color: var(--primary);
    background: var(--primary-bg);
  }
}

.btn-ghost {
  opacity: 0.9;

  &:hover {
    background: var(--surface-transparent);
    opacity: 1;
  }
}

.tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  z-index: 1000;
  display: flex;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  color: var(--surface-base);
  background: var(--text-inverse);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s ease;
  align-items: center;
  gap: 6px;
  pointer-events: none;
  transform: translateX(-50%) translateY(-4px);
  visibility: hidden;
  white-space: nowrap;

  &::before {
    position: absolute;
    top: -4px;
    left: 50%;
    border-bottom: 5px solid var(--text-inverse);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    content: '';
    transform: translateX(-50%);
  }

  kbd {
    padding: 2px 5px;
    border-radius: 3px;
    font-family: inherit;
    font-size: 10px;
  }
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  margin: 0 2px;
  background: var(--border);
  opacity: 0.4;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.stats-badge {
  display: flex;
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--surface-raised) 0%, var(--surface-overlay) 100%);
  align-items: center;
  gap: 6px;
}

.stat-item {
  display: flex;
  line-height: 1.1;
  align-items: center;
  flex-direction: column;
  gap: 0;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 9px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
}

.action-buttons {
  display: flex;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--surface-transparent);
  gap: 3px;
}

.action-divider {
  width: 1px;
  height: 18px;
  margin: 0 2px;
  background: var(--border);
  opacity: 0.5;
  align-self: center;
}

.category-select {
  min-width: 110px;
  border-radius: var(--radius-sm);
  background: var(--surface-base);
}

// Responsive adjustments
@media (width <= 900px) {
  .toolbar {
    padding: 6px 8px;
    gap: 4px;
  }

  .group-label {
    display: none;
  }

  .toolbar-btn {
    width: 28px;
    height: 28px;

    .btn-icon {
      width: 16px;
      height: 16px;

      :deep(svg) {
        width: 16px;
        height: 16px;
      }
    }
  }

  .stats-badge {
    padding: 4px 8px;
  }

  .stat-value {
    font-size: 11px;
  }

  .stat-label {
    font-size: 8px;
  }
}

@media (width <= 700px) {
  .toolbar-divider {
    display: none;
  }

  .toolbar-group {
    flex-direction: row;
  }

  .stats-badge {
    display: none;
  }
}

// Tablet hide
.no-tablet {
  @media (width <= 1024px) {
    display: none;
  }
}
</style>
