<template>
	<aside>
		<textarea class="child input el" name="Editor" id="" cols="30" rows="20" v-model="markdown">s</textarea>
		<div class="output child el" v-html="html"></div>
	</aside>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import compile from '../helpers/markdown-compile';
export default defineComponent({
	name: "MarkdownEditorVue",
	data() {
		return {
			markdown: this.value,
		};
	},
	props: {
		value: {
			type: String,
			default: "",
		},
	},
	computed: {
		html() {
			return compile(this.markdown, true);
		}
	},
	watch: {
		value: function (newVal) { // watch it
			this.markdown = newVal;
		}
	}
})
</script>
<style lang="scss" scoped>
aside {
	width: 100%;
	display: flex;
	align-items: stretch;
}


.el {
	height: 600px;
	overflow: auto;
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
	background-color: var(--bg-color-1);
	background-clip: padding-box;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
}
</style>