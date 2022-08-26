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
		<fieldset class="view preview">
			<legend>Preview</legend>
			<div id="preview" v-html="html_content"></div>
		</fieldset>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useArticlesStore } from '../../../store';
import type { Article } from '../../../store';
import compile from "../../../helpers/markdown-compile";

const store = useArticlesStore();
export default defineComponent({
	name: 'admin-articles-edit',
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
			return compile(this.article.content_markdown, true);
		}
	},
	methods: {
		send() {
			this.article.content_html = this.html_content
			store.updateArticle(this.article).then(_ => this.$router.push("/admin/articles"))
		}
	},
	async beforeMount() {
		const article = await store.getById(this.$route.params.id as string);
		if (article) this.article = article;
	},
});

</script>