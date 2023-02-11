<template>
	<section class="datatable">
		<div class="search">
			<i class="bx bx-search" />
			<input type="text" placeholder="Search" v-model="searchInput" />
		</div>
		<table>
			<thead>
				<tr>
					<th v-for="header in headers" :key="header.field">
						{{ header.label }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in filteredRows" :key="index">
					<td v-for="header in headers" :key="header.field">
						<!--Allow slots-->
						<slot :name="header.field" :row="row">
							<!--If no slot is provided, use the default-->
							{{ header.representedAs ? header.representedAs(row) : row[header.field] }}
						</slot>
					</td>
				</tr>
				<tr>
					<td colspan="100%">
						<div class="actions-bar">
							<div class="left">
								<button type="button" class="small-btn btn-theme" @click="page--"
									:class="hasPreviousPage ? '' : 'no-page'">&lt;Previous</button>
								<button type="button" class="small-btn btn-theme" @click="page++"
									:class="hasNextPage ? '' : 'no-page'">Next&gt;</button>
								<p>Page {{ page }} of {{ totalPages }}</p>
							</div>
							<div class="right">
								<span>Items per page</span>
								<select v-model="itemsPerPage">
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="15">15</option>
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
	</section>

</template>

<script lang="ts" setup>
import type { Header, Row } from "./dtypes"

const props = defineProps<{
	headers: Header[];
	rows: Row[];
}>();

const itemsPerPage = ref(15)
const page = ref(1)
const searchInput = ref('')

const filteredRows = computed(() => {
	const start = (page.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	return props.rows.filter((row) => {
		const rowValues = Object.values(row);
		return rowValues.some((value) => {
			if (typeof value === 'string') {
				return value.toLowerCase().includes(searchInput.value.toLowerCase());
			}
			return false;
		});
	}).slice(start, end);

})

const hasNextPage = computed(() => (page.value * itemsPerPage.value) < props.rows.length)
const hasPreviousPage = computed(() => page.value > 1)
const totalPages = computed(() => Math.ceil(props.rows.length / itemsPerPage.value))

</script>


<style lang="scss" scoped>
.datatable {
	margin-top: 20px;
	max-width: 99%;
}


table {
	width: 100%;
	background-color: transparent;

	tbody {
		display: table-row-group;
		vertical-align: middle;
		border-color: inherit;
	}

	tr,
	td {
		line-height: 0.5rem;
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

.no-page {
	pointer-events: none;
}

.bx-search {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	font-size: 22px;
	background: var(--contrast-color);
}



.search {
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