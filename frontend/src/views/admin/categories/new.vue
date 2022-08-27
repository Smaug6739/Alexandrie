<template>
	<div>
		<form>
			<fieldset>
				<legend>Catégorie</legend>
				<label for="name">Name:</label>
				<input type="text" placeholder="Name" name="name" v-model="theme.name" />
				<label for="description">Description:</label>
				<input type="text" placeholder="Description" name="description" v-model="theme.description" />
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="theme.path" />
				<label for="icon">Icon:</label>
				<input type="text" placeholder="Icon" name="icon" v-model="theme.icon" />
				<button type="button" class="btn btn-pink" @click="postMain">Post</button>
				butt
			</fieldset>
		</form>
		<h2>Sub categories</h2>
		<form>
			<fieldset>
				<legend>Name</legend>
				<label for="name">Name:</label>
				<input type="text" placeholder="Name" name="name" v-model="sub.name" />
				<label for="description">Description:</label>
				<input type="text" placeholder="Description" name="description" v-model="sub.description" />
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="sub.path" />
				<label for="icon">Icon:</label>
				<input type="text" placeholder="Icon" name="icon" v-model="sub.icon" />
				<label for="icon">Parent category:</label>
				<input type="text" placeholder="Icon" name="icon" v-model="sub.parent_category" />
				<button type="button" class="btn btn-pink" @click="postSub">Post</button>

			</fieldset>
		</form>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Theme, Category } from '../../../store';
import { useCategoriesStore } from '../../../store';
const store = useCategoriesStore();
export default defineComponent({
	name: 'admin-categories-edit',
	data() {
		return {
			theme: {} as Theme,
			sub: {} as Category,
		};
	},
	methods: {
		postMain() {
			store.postMainCategory(this.theme).then(() => this.$router.push('/admin/categories'));
		},
		postSub() {
			store.postSubCategory(this.sub).then(() => this.$router.push('/admin/categories'));
		}
	},
	async beforeMount() {
		const theme = await store.getById(this.$route.params.id as string);
		if (theme) this.theme = theme;
	},
});
</script>