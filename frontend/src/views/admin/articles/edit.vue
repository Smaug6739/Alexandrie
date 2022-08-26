<template>
	<div>
		<form>
			<fieldset>
				<legend>Article</legend>
				<label for="title">Title:</label>
				<input type="text" placeholder="Title" name="title" v-model="article.name" />
				<label for="description">Description:</label>
				<input type="text" placeholder="Description" name="description" v-model="article.description" />
				<label for="main_category">Main category:</label>
				<input type="text" placeholder="Main category" name="main_category" v-model="article.main_category" />
				<label for="sub_category">Sub category:</label>
				<input type="text" placeholder="Sub category" name="sub_category" v-model="article.sub_category" />
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="article.path" />
				<label for="content">Content:</label>
				<textarea name="content" id="" cols="10" rows="20" v-model="article.content_markdown"></textarea>
				<button type="button" class="btn btn-pink" @click="send">Edit</button>
			</fieldset>
		</form>
		<div>
			<fieldset class="view preview">
				<legend>Preview</legend>
				<div id="preview" v-html="html_content">

				</div>
			</fieldset>
		</div>
	</div>

</template>
<script lang="ts">
import adminSidebar from '../../../components/layout/admin-sidebar/Sidebar.vue';
import { defineComponent } from 'vue';
import type { Article } from '../../../store';
import { useArticlesStore } from '../../../store';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({
	html: true,
});

const store = useArticlesStore();
import katex from "katex";
export default defineComponent({
	name: 'admin-articles-edit',
	components: {
		adminSidebar,
	},
	data() {
		return {
			article: {
				name: '',
				description: '',
				main_category: '',
				sub_category: '',
				path: '',
				content_markdown: '',
				content_html: '',
			} as Article,
		};
	},
	computed: {
		html_content() {
			let html = md.render(this.article.content_markdown);
			const results = matchText(html)
			html = replaceText(html, results)
			return html
		}
	},
	methods: {
		send() {
			this.article.content_html = this.html_content
			store.updateArticle(this.article).then(r => {
				this.$router.push("/admin/articles");
			})
		}
	},
	async beforeMount() {
		const article = await store.getById(this.$route.params.id as string);
		if (article) this.article = article;
	},
});

// A function for matching $<sequence>$ without regex.
interface Result {
	start: number;
	end: number;
}
function matchText(text: string) {
	let i = 0;
	let possible_start = -1;
	const results: Result[] = [];
	while (i < text.length) {
		const character = text[i];
		if (character === '$') {
			if (possible_start == -1) {
				possible_start = i;
			} else {
				results.push({
					start: possible_start,
					end: i,
				});
				possible_start = -1;
			}
		}
		i++;
	}
	return results;
}
function replaceText(text: string, results: Result[]): string {
	const copy = text;
	for (const result of results) {
		const expression = copy.substring(result.start, result.end + 1);
		const expressionWithoutDollar = expression.slice(1, - 1);
		const render = katex.renderToString(expressionWithoutDollar, {
			throwOnError: false,
			displayMode: true,
		});
		text = text.replace(expression, `<span class="container"><i class="katex-i">${render}</i></span>`);
	}
	return text;
}

</script>
<style lang="scss">
fieldset {
	padding: 10px;
	width: 80%;
	margin: auto;
	margin-top: 3% !important;
}

legend {
	float: left;
	text-align: left;
	width: 100%;
	padding: 0;
	margin-bottom: 0.5rem;
	font-size: calc(1.275rem + 0.3vw);
	line-height: inherit;
}

input,
textarea {
	display: block;
	margin: auto;
	margin-top: 10px;
	padding: 3px;
	width: 100%;
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