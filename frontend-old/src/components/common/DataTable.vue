<template>
	<div>
		<div class="table-responsive">
			<table class="">
				<thead>
					<tr>
						<th v-for="(header, index) in headers" :key="index">
							{{ header.title }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in rows" :key="index">
						<td v-for="(field, index) in item" :key="index">
							<span v-if="field.action == 'text'" v-html="field.title"></span>
							<span v-else-if="field.action == 'link'">
								<NuxtLink :to="field.title" class="btn" type="button">Edit</NuxtLink>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<div style="display: flex;">
				<button type="button" class="btn btn-pink">&lt;Previous</button>
				<button type="button" class="btn btn-pink">Next&gt;</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'admin-dashboard',
	props: {
		options: {
			type: Object,
			default: () => ({
				itemsPerPage: 10,
			}),
		},
		headers: {
			type: Array as () => Header[],
			default: (): Header[] => [],
		},
		rows: {
			type: Array as () => Array<Field[]>,
			default: () => [],
		}
	},

});
interface Header {
	title: string;
}
interface Field {
	title: string;
	action: "text" | "link";
}
</script>
<style lang="scss" scoped>
.table-responsive {
	overflow-x: auto;
	max-width: 100%;
}

table {
	width: 100%;
}

button {
	margin-right: 20px;

}
</style>