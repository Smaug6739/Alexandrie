<template>
	<div class="editor-container">
		<Toolbar style="height: fit-content;" :document="document" @execute-action="(a: string) => exec(a)" />
		<div class="editor-input">
			<input placeholder="Titre" class="title input" v-model="document.name" />
			<input placeholder="Description" class="description input" v-model="document.description" />
			<div class="markdown">
				<textarea ref="textarea" class="content markdown-input input" placeholder="Écrivez votre contenu ici..."
					v-model="document.content_markdown" @scroll="syncScroll"></textarea>
				<div v-if="showPreview" class="markdown-preview document-theme" ref="markdownPreview">
					<div v-html="html_content"></div>
				</div>
			</div>
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

const html_content = computed(() => {
	document.value.content_html = compile(document.value.content_markdown, true);
	return document.value.content_html;
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

const markdownPreview = ref<HTMLDivElement>();

function syncScroll() {
	if (!textarea.value || !markdownPreview.value) return;
	const scrollPercentage = textarea.value.scrollTop / (textarea.value.scrollHeight - textarea.value.clientHeight);
	markdownPreview.value.scrollTop = scrollPercentage * (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight);
}
</script>

<style scoped lang="scss">
.editor-container {
	height: 100%;
	width: 100%;
}

.editor-input {
	height: 100%;
	width: 100%;
}

.markdown {
	display: flex;
	height: 100%;
	width: 100%;
}

.markdown-input,
.markdown-preview {
	flex: 1;
	overflow: auto;
	min-height: 60vh;
}

.markdown-input {
	resize: none;
	font-family: 'Monaspace Neon';
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

}
</style>