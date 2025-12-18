<template>
  <div class="toolbar">
    <!-- Formatting Group -->
    <div class="toolbar-group">
      <div class="group-buttons">
        <button v-for="item in formattingTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div class="toolbar-divider" />

    <!-- Insert Group -->
    <div class="toolbar-group">
      <div class="group-buttons">
        <button v-for="item in insertTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div class="toolbar-divider" />

    <!-- Structure Group -->
    <div class="toolbar-group">
      <div class="group-buttons">
        <button v-for="item in structureTools" :key="item.name" class="toolbar-btn" :aria-label="item.name" @click="emitAction(item.action)">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>
    </div>

    <div class="toolbar-divider" />

    <!-- Voice & Category -->
    <div class="toolbar-group" style="flex-direction: row; flex: 1">
      <VoiceRecognition @transcription="handleTranscription" />
      <AppSelect v-if="!minimal" v-model="localValue.parent_id" :items="categories" placeholder="Category" class="category-select" />
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

      <!-- Actions Group -->
      <div class="action-buttons">
        <button
          v-for="item in actionTools"
          :key="item.name"
          class="toolbar-btn"
          :class="{ 'btn-primary': item.action === 'save', 'btn-accent': item.action === 'preview' }"
          :aria-label="item.name"
          @click="emitAction(item.action)"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <Icon :name="item.icon" />
          <span class="tooltip"
            >{{ item.name }}<kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span
          >
        </button>
      </div>

      <!-- Settings -->
      <div class="settings-buttons">
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
  minimal?: boolean;
}>();

const preferences = usePreferences();

const stats = computed(() => {
  const content = props.modelValue.content || '';
  const words = content
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  return {
    characters: content.length,
    words: words.length,
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

const categories = computed(() => new TreeStructure(useSidebarTree().nodes.value.filter(n => n.data.role <= 2)).generateTree());

// Icons as SVG strings for inline rendering
const icons = {
  bold: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>',
  italic:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>',
  underline:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>',
  strike:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M486-160q-76 0-135-45t-85-123l88-38q14 48 48.5 79t85.5 31q42 0 76-20t34-64q0-18-7-33t-19-27h112q5 14 7.5 28.5T694-340q0 86-61.5 133T486-160ZM80-480v-80h800v80H80Zm402-326q66 0 115.5 32.5T674-674l-88 39q-9-29-33.5-52T484-710q-41 0-68 18.5T386-640h-96q2-69 54.5-117.5T482-806Z"/></svg>',
  link: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>',
  image:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>',
  quote:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m228-240 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T458-480L320-240h-92Zm360 0 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T818-480L680-240h-92ZM320-500q25 0 42.5-17.5T380-560q0-25-17.5-42.5T320-620q-25 0-42.5 17.5T260-560q0 25 17.5 42.5T320-500Zm360 0q25 0 42.5-17.5T740-560q0-25-17.5-42.5T680-620q-25 0-42.5 17.5T620-560q0 25 17.5 42.5T680-500Zm0-60Zm-360 0Z"/></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/></svg>',
  orderedList:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M680-80v-60h100v-30h-60v-60h60v-30H680v-60h120q17 0 28.5 11.5T840-280v40q0 17-11.5 28.5T800-200q17 0 28.5 11.5T840-160v40q0 17-11.5 28.5T800-80H680Zm0-280v-110q0-17 11.5-28.5T720-510h60v-30H680v-60h120q17 0 28.5 11.5T840-560v70q0 17-11.5 28.5T800-450h-60v30h100v60H680Zm60-280v-180h-60v-60h120v240h-60ZM120-200v-80h480v80H120Zm0-240v-80h480v80H120Zm0-240v-80h480v80H120Z"/></svg>',
  table:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M120-120v-720h720v720H120Zm80-400h560v-240H200v240Zm213 160h134v-80H413v80Zm0 160h134v-80H413v80ZM200-360h133v-80H200v80Zm0 160h133v-80H200v80Zm427-160h133v-80H627v80Zm0 160h133v-80H627v80Z"/></svg>',
  color:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-544q0 115-70 175.5T640-308h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-544q0-121-92.5-198.5T488-820q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>',
  preview:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z"/></svg>',
  save: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>',
  goto: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M400-280h160v-80H400v80Zm0-160h280v-80H400v80ZM280-600h400v-80H280v80Zm200 120ZM265-80q-79 0-134.5-55.5T75-270q0-57 29.5-102t77.5-68H80v-80h240v240h-80v-97q-37 8-61 38t-24 69q0 46 32.5 78t77.5 32v80Zm135-40v-80h360v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H400Z"/></svg>',
};

// Tool definitions organized by groups
// Tool type with optional shortcut
interface ToolItem {
  name: string;
  icon: string;
  action: string;
  shortcut?: string;
}

const formattingTools: ToolItem[] = [
  { name: 'Bold', icon: icons.bold, action: 'bold', shortcut: 'Ctrl+B' },
  { name: 'Italic', icon: icons.italic, action: 'italic', shortcut: 'Ctrl+I' },
  { name: 'Underline', icon: icons.underline, action: 'underline', shortcut: 'Ctrl+U' },
  { name: 'Strikethrough', icon: icons.strike, action: 'strike' },
  { name: 'Color', icon: icons.color, action: 'openColorPicker' },
];

const insertTools: ToolItem[] = [
  { name: 'Link', icon: icons.link, action: 'link', shortcut: 'Ctrl+K' },
  { name: 'Image', icon: icons.image, action: 'image' },
  { name: 'Code', icon: icons.code, action: 'code' },
  { name: 'Quote', icon: icons.quote, action: 'quote' },
];

const structureTools: ToolItem[] = [
  { name: 'Bullet List', icon: icons.list, action: 'list' },
  { name: 'Numbered List', icon: icons.orderedList, action: 'orderedList' },
  { name: 'Table', icon: icons.table, action: 'gridOrganization' },
];

const actionTools: ToolItem[] = [
  { name: 'Preview', icon: icons.preview, action: 'preview', shortcut: 'Ctrl+P' },
  { name: 'Save', icon: icons.save, action: 'save', shortcut: 'Ctrl+S' },
  { name: 'Go to Document', icon: icons.goto, action: 'goto' },
];
</script>
<style scoped lang="scss">
.toolbar {
  display: flex;
  overflow-x: clip;

  width: 100%;
  padding: 8px 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  user-select: none;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group-buttons {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--bg-ui);
  border-radius: 8px;
}

.toolbar-btn {
  position: relative;
  display: flex;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;

    :deep(svg) {
      width: 18px;
      height: 18px;
      fill: var(--font-color-light);
      transition: fill 0.15s ease, transform 0.15s ease;
    }
  }

  &:hover {
    background: var(--bg-contrast);

    .btn-icon :deep(svg) {
      transform: scale(1.1);
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

.btn-primary {
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
  &:hover {
    border-color: var(--primary);
    background: var(--primary-bg);
  }
}

.btn-accent {
  background: var(--bg-contrast);
  border: 1px solid var(--border-color);

  &:hover {
    background: var(--primary-bg);
    border-color: var(--primary);
  }
}

.btn-ghost {
  opacity: 0.9;

  &:hover {
    opacity: 1;
    background: var(--bg-ui);
  }
}

.tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  padding: 6px 10px;
  background: var(--opposite-color);
  color: var(--bg-color);
  font-size: 11px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid var(--opposite-color);
  }

  kbd {
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 10px;
    font-family: inherit;
  }
}

.toolbar-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
  margin: 0 6px;
  opacity: 0.5;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.stats-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--bg-contrast) 0%, var(--bg-contrast-2) 100%);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 1.1;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--font-color-dark);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 9px;
  color: var(--font-color-light);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: var(--border-color);
}

.action-buttons {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-ui);
  border-radius: 8px;
}

.settings-buttons {
  display: flex;
  gap: 2px;
}

.category-select {
  background: var(--bg-color);
  border-radius: 8px;
}

// Responsive adjustments
@media (max-width: 900px) {
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

@media (max-width: 700px) {
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
  @media (max-width: 1024px) {
    display: none;
  }
}
</style>
