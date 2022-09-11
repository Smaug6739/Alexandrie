<!--404 error page (not found )-->
<template>
	<div>
		<div class="view-medium">
			<div>
				<h1>
					Scientia</h1>
				<h2>{{  category?.name  }}</h2>
				<div>
					Bienvenue dans la catégorie {{  category?.name  }} vous retrouvtrez ici plusieurs documents classéss dans les
					catégories suivantes : {{  category?.categories?.map(c => c.name).join(", ")  }}, vous pouvez
					naviguer et les retrouver en utilisant la sidebar sur le coté gauche.
				</div>
				<h2>Informations</h2>
				<p>
					{{  category?.description  }}
				</p>
			</div>
		</div>
	</div>
</template>
<style scoped>
h1,
h2 {
	border: none;
}

.view-medium {
	margin-top: 50px;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { Theme, useCategoriesStore } from "../../store";
const categoriesStore = useCategoriesStore();

export default defineComponent({
	name: "Data",
	data() {
		return {
			category: {} as Theme | undefined,
		};
	},
	async mounted() {
		this.category = await this.getCategory();
	},
	methods: {
		async getCategory() {
			return await categoriesStore.getByPath(this.$route.params.subject as string);
		}
	},
	watch: {
		async $route() {
			this.category = await this.getCategory();
		}
	},
});
</script>