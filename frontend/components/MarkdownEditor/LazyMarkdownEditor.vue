<template>
	<div class="editor-container">
		<Toolbar style="height: fit-content;" :document="document" @execute-action="(a: string) => exec(a)" />
		<input placeholder="Titre" class="title" v-model="document.name" />
		<input placeholder="Description" class="description" v-model="document.description" />
		<div class="markdown" ref="container">
      <InlineToolbar />
			<div contenteditable="true"  ref="textarea" class="textarea content markdown-input" placeholder="Écrivez votre contenu ici..."
				 @scroll="syncScroll" @mouseup="updateContextMenu" @input="update" @blur="update" v-html="document.content_markdown">
      </div>
			<div v-if="showPreview" class="markdown-preview document-theme" ref="markdownPreview" v-html="document.content_html">
			</div>
		</div>
	</div>
</template>


<script setup lang="ts">
import type { Document } from "~/store";
import Toolbar from "./LazyToolbar.vue";
import MarkdownUtil from "./Utils";
import compile from "~/helpers/markdown";
import InlineToolbar from "~/components/MarkdownEditor/InlineToolbar.vue";

const props = defineProps<{ doc?: Document }>();
const document = ref<Document | Partial<Document>>({ ...props.doc });
const textarea = ref<HTMLDivElement>();
const container = ref<HTMLDivElement>();
const toolbar = ref<HTMLDivElement>();
const showPreview = ref(false);

const emit = defineEmits(['save']);
const update = () => document.value.content_html = compile(textarea.value?.innerHTML || '', true);
onMounted(() =>  window.addEventListener('mouseup', updateContextMenu));
onBeforeUnmount(() => window.removeEventListener('mouseup', updateContextMenu));

function updateContextMenu(){
  if (!textarea.value || !toolbar.value) return;
  const selection = window.getSelection();
  toolbar.value.style.display = 'none';
  if (!selection || selection.rangeCount === 0 || selection.toString().length == 0) return;
  const range = selection.getRangeAt(0);
  if (!textarea.value.contains(range.startContainer) || !textarea.value.contains(range.endContainer)) return;
  const containerRect = container.value?.getBoundingClientRect(); //const selectionRect = range.getBoundingClientRect();
  const rects = range.getClientRects();
  if (!containerRect) return;
  const last_rect = rects[rects.length -1];
  toolbar.value.style.top = `${last_rect.top - containerRect.top + 25}px`;
  toolbar.value.style.left = `${last_rect.left - containerRect.left /*+ last_rect.width*/}px`;
  toolbar.value.style.display = "flex";
}

function exec(action: string) {
  const util = new MarkdownUtil(textarea.value);
  if (!textarea.value) return;
	switch (action) {
    case 'blue':
      util.inlineFormat('<blue>', '</blue>');
      break;
    case 'green':
      util.inlineFormat('<green>', '</green>');
      break;
    case 'red':
      util.inlineFormat('<red>', '</red>');
      break;
    case 'yellow':
      util.inlineFormat('<yellow>', '</yellow>');
      break;
    case 'pink':
      util.inlineFormat('<pink>', '</pink>');
      break;
    case 'bold':
      util.inlineFormat('<b>', '</b>');
			break;
		case 'italic':
			util.inlineFormat('<em>', '</em>');
			break;
		case 'underline':
			util.inlineFormat('__', '__');
			break;
		case 'strike':
			util.inlineFormat('~~', '~~');
			break;
		case 'link':
			util.inlineFormat('[](', ')');
			break;
		case 'image':
			util.inlineFormat('![](', ')');
			break;
		case 'code':
			util.inlineFormat('`', '`');
			break;
		case 'quote':
			util.inlineFormat('> ', '');
			break;
		case 'list':
			util.inlineFormat('* ', '');
			break;
		case 'orderedList':
			util.inlineFormat('1. ', '');
			break;
    case 'clear':
      util.clear();
      break;
		case 'exit':
			useRouter().push(document.value.id ? `/dashboard/doc/${document.value.id}` : '/dashboard')
			break;
		case 'preview':
			showPreview.value = !showPreview.value;
			break;
		case 'save':
			if (!document) return;
      document.value.content_markdown = textarea.value.innerHTML;
			document.value.content_html = compile(document.value.content_markdown, true);
			emit('save', document.value);
			break;
	}
  update();
}

const markdownPreview = ref<HTMLDivElement>();

function syncScroll() {
  updateContextMenu() // Update the position of the context menu
	if (!textarea.value || !markdownPreview.value) return;
	const scrollPercentage = textarea.value.scrollTop / (textarea.value.scrollHeight - textarea.value.clientHeight);
	markdownPreview.value.scrollTop = scrollPercentage * (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight);
}
</script>

<style scoped lang="scss">
.editor-container {
	height: 90%;
	width: 100%;
}

.markdown {
  position: relative;
	height: 80%;
	display: flex;
}

.markdown-input,
.markdown-preview {
	flex: 1;
	overflow: auto;
}

.markdown-preview {
	position: relative;
}

input,
.textarea {
  border: none;
  outline: none;
  background-color: var(--bg-color);
  padding-left: 0;
}
.textarea {
  white-space: break-spaces;
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