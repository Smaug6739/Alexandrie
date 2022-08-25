<template>
	<div>
		<h1>Dashboard: Edit category</h1>
		<admin-sidebar />
		<div class="ctn">
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
					<button type="button" class="btn btn-pink" @click="send">Edit</button>
				</fieldset>
			</form>
			<h2>Sub categories</h2>
			<fieldset style="padding:10px;">
				<fieldset v-for="(sub, index) of theme.categories" :key="index">
					<legend>Sub category: {{ sub.name }}</legend>
					<label for="name">Name:</label>
					<input type="text" placeholder="Name" name="name" v-model="sub.name" />
					<label for="description">Description:</label>
					<input type="text" placeholder="Description" name="description" v-model="sub.description" />
					<label for="path">Path:</label>
					<input type="text" placeholder="Path" name="path" v-model="sub.path" />
					<label for="icon">Icon:</label>
					<input type="text" placeholder="Icon" name="icon" v-model="sub.icon" />
					<button type="button" class="btn btn-pink" @click="editSub(index)">Edit</button>
				</fieldset>
			</fieldset>
		</div>
	</div>

</template>
<script lang="ts">
import adminSidebar from '../../components/layout/admin-sidebar/Sidebar.vue';
import CustomComponentVue from '../../components/CustomComponent.vue';
import { defineComponent } from 'vue';
import type { Theme } from '../../store';
import { useCategoriesStore } from '../../store';
const store = useCategoriesStore();
export default defineComponent({
	name: 'admin-articles-edit',
	components: {
		adminSidebar,
		CustomComponentVue,
	},
	data() {
		return {
			theme: {} as Theme,
		};
	},
	methods: {
		send() {
			store.updateMainCategory(this.theme).then(r => {
				this.$router.push("/admin/categories");
			})
		},
		editSub(index: number) {
			store.updateSubCategory(this.theme.id, this.theme.categories[index]).then(r => {
				this.$router.push("/admin/categories");
			})
		}
	},
	async beforeMount() {
		const theme = await store.getById(this.$route.params.id as string);
		if (theme) this.theme = theme;
	},
});
</script>
<style lang="scss" scoped>
.ctn {
	width: 80%;
	margin: auto;
	margin-top: 3% !important;
}

fieldset {
	padding: 10px;
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