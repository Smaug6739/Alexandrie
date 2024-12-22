<template>
  <div class="editor-container" @keydown="editor.handleKeydown">
    <Toolbar :document="document" :minimal="options?.toolbar == 'minimal'" @execute-action="(a:string) => editor.actions(a)" />
    <div style="padding: 10px; height: 100%; width: 100%">
      <input placeholder="Title" class="title" v-model="document.name" />
      <input placeholder="Description" class="description" v-model="document.description" />
      <div class="markdown" ref="container">
        <InlineToolbar ref="toolbar" @execute-action="(a:string) => editor.actions(a)" />
        <textarea ref="textarea" class="content markdown-input" @scroll="syncScroll" @input="update" v-html="document.content_markdown || ''" placeholder="Write something or use the toolbar to create your document..."></textarea>
        <div v-if="editor.showPreview.value" class="markdown-preview document-theme" ref="markdownPreview" v-html="document.content_html || ''"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor, type EditorOptions } from './EditorHelper';
import Toolbar from './Toolbar.vue';
import compile from '~/helpers/markdown';
import InlineToolbar from '~/components/MarkdownEditor/InlineToolbar.vue';
import type { Document } from '~/stores';

const props = defineProps<{
  doc?: Partial<Document>;
  options?: EditorOptions;
}>();
const document = ref<Document | Partial<Document>>({ ...props.doc, content_html: compile(props.doc?.content_markdown) });
const toolbar = ref<{ element: HTMLDivElement }>();
const container = ref<HTMLDivElement>();
const textarea = ref<HTMLTextAreaElement>();

const editor = new Editor(textarea, toolbar, container, props.options);

const emit = defineEmits(['save', 'exit']);
const update = debounce(() => {
  document.value.content_html = compile(textarea.value?.value || '');
}, 50);
const handleClick = () => editor.handleInlineToolbar();
const markdownPreview = ref<HTMLDivElement>();

editor.addEventListener('save', save);
editor.addEventListener('exit', () => emit('exit'));

onMounted(() => window.addEventListener('mouseup', handleClick));
onBeforeUnmount(() => window.removeEventListener('mouseup', handleClick));

function syncScroll() {
  editor.handleInlineToolbar();
  if (!textarea.value || !markdownPreview.value) return;
  const scrollPercentage = textarea.value.scrollTop / (textarea.value.scrollHeight - textarea.value.clientHeight);
  markdownPreview.value.scrollTop = scrollPercentage * (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight);
}
function save() {
  document.value.content_markdown = textarea.value?.value || '';
  document.value.content_html = compile(document.value.content_markdown);
  emit('save', document.value);
}

function debounce(fn: Function, wait: number) {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer); // clear any pre-existing timer
    }
    // @ts-ignore
    const context = this; // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args); // call the function if time expires
    }, wait);
  };
}
</script>

<style scoped lang="scss">
.editor-container {
  height: 90%;
  width: 100%;
  box-shadow: 0 0 10px 0 var(--border-color);
  border-radius: 15px;
}

.markdown {
  position: relative;
  height: 80%;
  display: flex;
}

.markdown-input,
.markdown-preview {
  padding: 5px;
  flex: 1;
  overflow: auto;
}

.markdown-preview {
  border-left: 1px solid var(--border-color);
  position: relative;
}

input,
textarea {
  border: none;
  outline: none;
  background-color: var(--bg-color);
  padding-left: 0;
}

input {
  display: block;
  width: 100%;
}

[placeholder]:empty::before {
  content: attr(placeholder);
  color: #757575;
  font-weight: 500;
  font-size: 18px;
  opacity: 1;
}

[placeholder]:empty {
  content: '';
}

textarea {
  font-family: monospace;
  line-height: 1.2;
  font-size: 16px;
  letter-spacing: -0.6px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
