<template>
	<aside>
		<textarea class="input" name="Editor" id="" cols="30" rows="20" v-model="markdown"
			@keyup="synchronizeScroll"></textarea>
		<div class="output" v-html="html"></div>
	</aside>
</template>
<script lang="ts" setup >
import { ref, computed, defineExpose } from 'vue'
import compile from '@/helpers/markdown';
const props = defineProps(
	{
		markdown: {
			type: String,
			default: '',
			required: true
		}
	}
)

const markdown = ref(props.markdown)
const html = computed(() => compile(markdown.value, true))
function synchronizeScroll() {
	console.log('scroll');

	const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
	const output = document.querySelector('.output') as HTMLElement;
	if (!textarea || !output) return;
	// If the textarea is scrolled to the bottom, keep the output scrolled to the bottom
	if (textarea.scrollTop === textarea.scrollHeight - textarea.clientHeight) {
		output.scrollTop = output.scrollHeight - output.clientHeight;
	}
}

defineExpose({
	markdown,
	html
})

</script>
<style lang="scss" scoped>
aside {
	width: 100%;
	display: flex;
	align-items: stretch;
}



.input,
.output {
	display: block;
	padding: 3px;
	width: 50%;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	color: var(--font-color);
	background-color: var(--bg-color);
	background-clip: padding-box;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
	height: 800px;
	max-height: 800px;
	overflow-x: auto;
	overflow-y: auto;
}

.input {
	font-size: 12px;
}
</style>