<template>
	<div>
		<form>
			<fieldset v-if="theme.id">
				<legend>Catégorie</legend>
				<label for="name">Name:</label>
				<input type="text" placeholder="Name" name="name" v-model="theme.name" />
				<label for="description">Description:</label>
				<input type="text" placeholder="Description" name="description" v-model="theme.description" />
				<label for="description">Order:</label>
				<input type="number" placeholder="Order" name="order" v-model="theme.order" />
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="theme.path" />
				<label for="icon">Icon:</label>
				<input type="text" placeholder="Icon" name="icon" v-model="theme.icon" />

				<button type="button" class="btn btn-theme" @click="editMain">Edit</button>
				<button type="button" class="btn btn-red" @click="delMain">Delete</button>
			</fieldset>
		</form>
		<h2>Sub categories</h2>
		<fieldset style="padding:10px;" v-if="theme.id">
			<fieldset v-for="(sub, index) of theme.categories" :key="index">
				<legend>Sub category: {{ sub.name }}</legend>
				<label for="name">Name:</label>
				<input type="text" placeholder="Name" name="name" v-model="sub.name" />
				<label for="description">Description:</label>
				<input type="text" placeholder="Description" name="description" v-model="sub.description" />
				<label for="description">Order:</label>
				<input type="number" placeholder="Order" name="order" v-model="sub.order" />
				<label for="path">Path:</label>
				<input type="text" placeholder="Path" name="path" v-model="sub.path" />
				<label for="icon">Icon:</label>
				<input type="text" placeholder="Icon" name="icon" v-model="sub.icon" />
				<label for="icon">Parent category:</label>
				<select name="parent_id" v-model="sub.parent_category">
					<option v-for="category in themes" :value="category.path" :key="category.id">{{ category.path }}</option>
				</select>
				<button type="button" class="btn btn-theme" @click="editSub(index)">Edit</button>
				<button type="button" class="btn btn-red" @click="delSub(sub.id)">Delete</button>
			</fieldset>
		</fieldset>
	</div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Theme } from '../../../store';
import { useCategoriesStore } from '../../../store';
export default defineComponent({
	name: 'admin-articles-edit',
	data() {
		return {
			themes: [] as Theme[],
			theme: {} as Theme,

		};
	},

	methods: {
		editMain() {
			const store = useCategoriesStore();
			store.updateMainCategory(this.theme).then(_ => this.$router.push("/admin/categories"))
		},
		editSub(index: number) {
			const store = useCategoriesStore();
			const category = this.theme.categories[index]
			if (!category) return;
			store.updateSubCategory(this.theme.id, category).then(_ => this.$router.push("/admin/categories"))
		},
		delSub(index: string) {
			const store = useCategoriesStore();
			store.deleteSubCategory(this.theme.id, index).then(_ => this.$router.push("/admin/categories"))
		},
		delMain() {
			const store = useCategoriesStore();
			store.deleteMainCategory(this.theme.id).then(_ => this.$router.push("/admin/categories"))
		}
	},
	beforeMount() {
		const store = useCategoriesStore();
		const theme = store.getById(this.$route.params.id as string);
		if (theme) this.theme = theme;
		this.themes = store.getAll;
	},
});
</script>
<style scoped>
button {
	margin-right: 5px;
}
</style>