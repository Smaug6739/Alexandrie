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
				<label for="content">Content</label>
				<div style="width:100%; height:100%;">
					<MarkdownEditorVue ref="editor" :value="article.content_markdown" />
				</div>
				<button type="button" class="btn btn-pink" @click="send">Edit</button>
			</fieldset>
		</form>

	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useArticlesStore } from '../../../store';
import type { Article } from '../../../store';
import MarkdownEditorVue from '../../../components/MarkdownEditor.vue';
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
	components: {
		MarkdownEditorVue,
	},
	methods: {
		send() {
			const markdown = (this.$refs.editor as any).markdown;
			const html = (this.$refs.editor as any).html;
			this.article.content_markdown = markdown;
			this.article.content_html = html
			store.updateArticle(this.article).then(_ => this.$router.push("/admin/articles"))
		}
	},

	async beforeMount() {
		const article = await store.getById(this.$route.params.id as string);
		if (article) this.article = article;
	},
});

</script>