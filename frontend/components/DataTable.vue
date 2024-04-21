<template>
	<div class="container">
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
			<path
				d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
		</svg>
		<input type="text" placeholder="Search" v-model="searchInput" />
		<table>
			<thead>
				<tr>
					<th v-for="(header, index) in headers" :key="index" :class="{ noMobile: index > 1 }">
						{{ header.title }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in data" :key="index">
					<td v-for=" (field, index) in row.fields" :key="index" :class="{ noMobile: index > 1 }">
						<span v-if="!field.action" v-text="field.content"></span>
						<span v-else>
							<NuxtLink :to="field.action" class="small-btn" type="button" v-text="field.content">
							</NuxtLink>
						</span>
					</td>
				</tr>
				<tr>
					<td colspan="100%">
						<div class="actions-bar">
							<div class="left">
								<button type="button" class="small-btn" @click="page--">&lt;Previous</button>
								<button type="button" class="small-btn" @click="page++">Next&gt;</button>
							</div>
							<div class="right">
								<span>Items per page</span>
								<select v-model="itemsPerPage">
									<option value="15">15</option>
									<option value="30">30</option>
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
</template>

<script lang="ts" setup>

const props = defineProps<{ headers: Header[], rows: Row[] }>()
const itemsPerPage = ref(15)
const page = ref(1)
const searchInput = ref('')

const data = computed(() => {
	return props.rows.filter((row) => {
		return row.fields.some((field) => {
			return field.content.toLowerCase().includes(searchInput.value.toLowerCase())
		})
	}).slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

interface Header {
	title: string;
}
interface Row {
	fields: Field[];
}
interface Field {
	content: string;
	action?: string;
}
</script>
<style lang="scss" scoped>
.container {
	position: relative;
	zoom: 0.7;
}

table {
	width: 100%;
}

button {
	margin-right: 20px;
}

.small-btn {
	padding: 0.1rem 0.25rem;
	font-size: 1rem;
}

.noMobile {
	display: none;
}

button {
	background-color: $primary-400;
	color: #fff;
}

.actions-bar {
	display: flex;
	width: 100%;
	justify-content: space-between;

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


svg {
	position: absolute;
	top: 13px;
	left: 13px;
	fill: var(--grey);
}

input {
	height: 50px;
	padding: 0 0 0 45px;
	outline: none;
	border-radius: 10px;
}

@media screen and (min-width: 1000px) {
	.container {
		zoom: 1;
	}

	.noMobile {
		display: table-cell;
	}

	table {
		zoom: 1;
	}
}
</style>