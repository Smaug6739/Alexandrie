<template>
	<div class="editor-container">
		<Toolbar :document="document" @execute-action="(a: string) => exec(a)" />
		<div class="flex-container body">
			<div class="editor-input">
				<input placeholder="Titre" class="title input" v-model="document.name" />
				<input placeholder="Description" class="description input" v-model="document.description" />
				<textarea ref="textarea" class="content input" placeholder="Écrivez votre contenu ici..."
					v-model="document.content_markdown"></textarea>
			</div>
			<div v-if="showPreview" class="markdown-preview document-theme" v-html="document.content_html"></div>
		</div>
	</div>
</template>


<script setup lang="ts">
import { type Document } from "~/store";
import Toolbar from "./Toolbar.vue";
import { wrapWithTags } from "./utils";
import compile from "~/helpers/markdown";

const props = defineProps<{ doc?: Document }>();
const document = ref<Document | Partial<Document>>({ ...props.doc });
const textarea = ref<HTMLTextAreaElement>();
const showPreview = ref(false);

const emit = defineEmits(['save']);

watchEffect(() => {
	if (!document.value.content_markdown) return;
	document.value.content_html = compile(document.value.content_markdown, true);
});

function exec(action: string) {
	if (!textarea.value) return;
	const selectedText = window.getSelection()?.toString() || '';
	switch (action) {
		case 'bold':
			wrapWithTags(selectedText, '**', '**', textarea.value);
			break;
		case 'italic':
			wrapWithTags(selectedText, '*', '*', textarea.value);
			break;
		case 'underline':
			wrapWithTags(selectedText, '__', '__', textarea.value);
			break;
		case 'strike':
			wrapWithTags(selectedText, '~~', '~~', textarea.value);
			break;
		case 'link':
			wrapWithTags(selectedText, '[](', ')', textarea.value);
			break;
		case 'image':
			wrapWithTags(selectedText, '![](', ')', textarea.value);
			break;
		case 'code':
			wrapWithTags(selectedText, '`', '`', textarea.value);
			break;
		case 'quote':
			wrapWithTags(selectedText, '> ', '', textarea.value);
			break;
		case 'list':
			wrapWithTags(selectedText, '* ', '', textarea.value);
			break;
		case 'orderedList':
			wrapWithTags(selectedText, '1. ', '', textarea.value);
			break;
		case 'preview':
			showPreview.value = !showPreview.value;
			break;
		case 'save':
			if (!document) return;
			emit('save', document.value);
			break;
	}
}
</script>

<style scoped lang="scss">
.editor-container {
	display: flex;
	flex-direction: column;
}

.flex-container {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}

.body {
	height: 100%;
}

.editor-input,
.markdown-preview {
	padding: 8px;
	min-height: 80vh;
}

.editor-input {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.markdown-preview {
	border-left: 1px solid var(--border-color);
	flex: 1;
}

.input {
	border: none;
	outline: none;
	background-color: var(--bg-color);
	padding-left: 0;


	&.title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	&.description {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	&.content {
		width: 100%;
		flex: 1;
		padding: 0;
		resize: none;
	}
}
</style>