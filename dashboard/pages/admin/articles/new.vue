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
				<select name="main_category" v-model="article.main_category">
					<option v-for="category in themes" :value="category.path" :key="category.id">{{ category.path }}</option>
				</select>
				<label for="sub_category">Sub category:</label>
				<select name="sub_category" v-model="article.sub_category" title="test">
					<option v-for="category in theme.categories" :value="category.path" :key="category.id">{{ category.path
					}}</option>
				</select>
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="article.path" />
				<label for="content">Content</label>
				<div style="width:100%; height:100%;">
					<MarkdownEditorVue ref="editor" :markdown="article.content_markdown" />
				</div>
				<button type="button" class="btn btn-theme" @click="post">Post</button>
			</fieldset>
		</form>

	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Theme, useArticlesStore, useCategoriesStore } from '@/store';
import type { Article } from '@/store';
import MarkdownEditorVue from '@/components/MarkdownEditor.vue';
export default defineComponent({
	name: 'admin-articles-post',
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
			themes: [] as Theme[],
		};
	},
	components: {
		MarkdownEditorVue,
	},

	methods: {
		post() {
			const store = useArticlesStore();
			const markdown = (this.$refs.editor as any).markdown;
			const html = (this.$refs.editor as any).html;
			this.article.content_markdown = markdown;
			this.article.content_html = html;
			store.postArticle(this.article).then(() => this.$router.push('/admin/articles'));
		}
	},
	computed: {
		theme() {
			const theme = this.themes.find((t: Theme) => t.path === this.article.main_category) as Theme;
			return theme || [];
		}

	},
	beforeMount() {
		const categoriesStore = useCategoriesStore();
		this.themes = categoriesStore.getAll;
	},
});

</script>