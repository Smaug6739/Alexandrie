<template>
	<div class="container">
		<select name="category-filter" @change="v => selected = (v.target as HTMLSelectElement)?.value">
			<option value="">All</option>
			<option v-for="category in categories" :key="category.id" :value="category.id">
				{{ category.name }}
			</option>
		</select>
	</div>
</template>

<script setup lang="ts">
import type { Category } from '~/store';

defineProps<{ categories: Category[] }>();
const selected = defineModel();
</script>

<style scoped lang="scss">
.container {
	padding: 5px 10px 0 0;
}

select {
	border-radius: 5px;
	padding: 5px 0;
	border: 1px solid var(--border-color);
	background: var(--bg-contrast-2);
	color: var(--font-color);
	cursor: pointer;
	outline: none;
}
</style>
