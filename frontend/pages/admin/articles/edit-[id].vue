<template>
	<div>
		<form>
			<fieldset v-if="article">
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
				<select name="sub_category" v-model="article.sub_category">
					<option v-for="sub_category of theme?.categories" :value="sub_category.path" :key="sub_category.id">
						{{ sub_category.path}}
					</option>
				</select>
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="article.path" />
				<label for="content">Content</label>
				<div style="width:100%; height:100%;">
					<MarkdownEditorVue ref="editor" :markdown="article.content_markdown" />
				</div>
				<button type="button" class="btn btn-theme" @click="edit">Edit</button>
				<button type="button" class="btn btn-red" @click="del">Delete</button>
			</fieldset>
		</form>

	</div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Theme, useArticlesStore, useCategoriesStore } from '@/store';
import MarkdownEditorVue from '@/components/MarkdownEditor.vue';

const store = useArticlesStore();
const categoriesStore = useCategoriesStore();
const router = useRouter();
const route = useRoute();



const themes = ref<Theme[]>(categoriesStore.getAll);
const editor = ref();

const article = computed(() => store.getById(route.params.id as string))

function edit() {
	if (!article.value) return;
	const markdown = (editor as any).markdown;
	const html = (editor as any).html;
	article.value.content_markdown = markdown;
	article.value.content_html = html
	store.updateArticle(article.value).then(_ => router.push("/admin/articles"))
}
function del() {
	if (!article.value) return;
	const store = useArticlesStore();
	store.deleteArticle(article.value.id).then(_ => router.push("/admin/articles"))
}

const theme = computed(() => {
	if (!article.value) return;
	const theme = themes.value.find((t: Theme) => t.path === article.value!.main_category) as Theme;
	return theme || [];
})


</script>
<style lang="scss" scoped>
button {
	margin-right: 5px;
}
</style>