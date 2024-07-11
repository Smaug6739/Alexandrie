<template>
	<div class="editor-container">
		<Toolbar style="height: fit-content;" :document="document" @execute-action="(a: string) => exec(a)" />
		<input placeholder="Titre" class="title" v-model="document.name" />
		<input placeholder="Description" class="description" v-model="document.description" />
		<div class="markdown">
			<InlineToolbar ref="toolbar" @execute-action="(a: string) => exec(a)" />
			<div contenteditable="true" ref="textarea" class="textarea content markdown-input" @scroll="syncScroll"
				@input="update" @blur="update" @keydown="editor.handleKeydown" v-html="document.content_markdown"></div>
			<div v-if="editor.showPreview.value" class="markdown-preview document-theme" ref="markdownPreview"
				v-html="document.content_html"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Editor } from './Editor';
import Toolbar from './LazyToolbar.vue';
import compile from '~/helpers/markdown';
import InlineToolbar from '~/components/MarkdownEditor/InlineToolbar.vue';
import type { Document } from '~/store';

const props = defineProps<{ doc?: Document }>();
const document = ref<Document | Partial<Document>>({ ...props.doc });
const toolbar = ref<{ element: HTMLDivElement }>();
const textarea = ref<HTMLDivElement>();

const editor = new Editor(textarea, toolbar);

const emit = defineEmits(['save']);
const update = () => {
	// Replace fix use of & in katex expressions
	document.value.content_html = compile(textarea.value?.innerHTML.replaceAll('&amp;', '&') || '');
};
const handleClick = () => editor.updateContextMenu();


const markdownPreview = ref<HTMLDivElement>();
editor.addEventListener('save', saveDocument);

onMounted(() => window.addEventListener('mouseup', handleClick));
onBeforeUnmount(() => window.removeEventListener('mouseup', handleClick));

function exec(action: string) {
	editor.format(action);
	switch (action) {
		case 'exit':
			useRouter().push(document.value.id ? `/dashboard/doc/${document.value.id}` : '/dashboard');
			break;
		case 'preview':
			editor.showPreview.value = !editor.showPreview.value;
			break;
		case 'save':
			saveDocument();
	}
	update();
}

function syncScroll() {
	if (!textarea.value || !markdownPreview.value) return;
	const scrollPercentage = textarea.value.scrollTop / (textarea.value.scrollHeight - textarea.value.clientHeight);
	markdownPreview.value.scrollTop = scrollPercentage * (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight);
}
function saveDocument() {
	document.value.content_markdown = textarea.value?.innerHTML;
	document.value.content_html = compile(document.value.content_markdown, true);
	emit('save', document.value);
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
	padding: 5px;
	flex: 1;
	overflow: auto;
}

.markdown-preview {
	border-left: 1px solid var(--border-color);
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
