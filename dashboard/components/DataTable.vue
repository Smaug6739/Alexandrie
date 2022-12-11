<template>
	<div>
		<div class="table-responsive">
			<h2>Datatable</h2>
			<li class="li-style">
				<i class="bx bx-search" />
				<input type="text" placeholder="Search" v-model="searchInput" />
			</li>
			<table>
				<thead>
					<tr>
						<th v-for="(header, index) in headers" :key="index">
							{{ header.title }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in data" :key="index">
						<td v-for="(field, index) in item" :key="index">
							<span v-if="field.action == 'text'" v-html="field.content"></span>
							<span v-else-if="field.action == 'link'">
								<NuxtLink :to="field.content" class="small-btn btn-theme" type="button">Edit</NuxtLink>
							</span>
						</td>
					</tr>
					<tr>
						<td colspan="100%">
							<div class="actions-bar">
								<div class="left">
									<button type="button" class="small-btn btn-theme" @click="page--">&lt;Previous</button>
									<button type="button" class="small-btn btn-theme" @click="page++">Next&gt;</button>
								</div>
								<div class="right">
									<span>Items per page</span>
									<select v-model="itemsPerPage">
										<option value="5">5</option>
										<option value="10">10</option>
										<option value="20">20</option>
										<option value="30">30</option>
										<option value="40">40</option>
										<option value="50">50</option>
										<option value="100">100</option>
										<option value="250">250</option>
									</select>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>

const props = defineProps({

	headers: {
		type: Array as () => Header[],
		default: (): Header[] => [],
	},
	rows: {
		type: Array as () => Array<Field[]>,
		default: () => [],
	}
})

const itemsPerPage = ref(10)
const page = ref(1)
const searchInput = ref('')

const data = computed(() => {
	return props.rows.filter((row) => {
		return row.some((field) => {
			return field.content.toLowerCase().includes(searchInput.value.toLowerCase())
		})
	}).slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

interface Header {
	title: string;
}
interface Field {
	content: string;
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
	background-color: transparent;

	tbody {
		display: table-row-group;
		vertical-align: middle;
		border-color: inherit;
	}
}

button {
	margin-right: 20px;
}

.small-btn {
	cursor: pointer;
	display: inline-block;
	font-weight: 400;
	text-align: center;
	white-space: nowrap;
	vertical-align: middle;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	border: 1px solid transparent;
	padding: 0.1rem 0.25rem !important;
	font-size: 1rem;
	border-radius: 0.25rem;
	transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.actions-bar {
	display: flex;
	width: 100%;
	justify-content: space-between;
	max-height: 30px !important;

	select {
		max-width: 100px;
		margin: 0;
		margin-left: 10px;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.left {
		justify-content: flex-start;
	}

	.right {
		justify-content: flex-end;
	}
}

.bx-search {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	font-size: 22px;
	background: var(--contrast-color);
}

.bx-search:hover {
	background: var(--contrast-color);
}

.bx-search:hover {
	background: var(--font-color);
	color: var(--bg-color);
}


.li-style {
	position: relative;
	list-style: none;

	i {
		padding-left: 15px;
		height: 50px;
		min-width: 50px;
		line-height: 50px;
		font-size: 18px;
		border-radius: 12px;
	}

	input {
		font-size: 15px;
		color: var(--font-color);
		font-weight: 400;
		outline: none;
		height: 50px;
		width: 100%;
		border: none;
		border-radius: 12px;
		transition: all 0.2s ease;
		background: var(--contrast-color);
		padding: 0 20px 0 50px;
	}


}
</style>