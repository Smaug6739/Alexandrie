<template>
	<input @input="handleInputChange" v-model="query" type="text" placeholder="Search..." />
</template>

<style lang="scss" scoped>
input {
	-webkit-appearance: none;
	appearance: none;
	cursor: text;
	width: 240px;
	height: 2.1rem;
	display: inline-block;
	border-radius: 8px;
	font-size: 0.9rem;
	line-height: 2rem;
	padding: 0.5rem 0.5rem 0.5rem 2rem;
	transition: all ease $transition-duration;
	background: var(--bg-color) url('search.svg') 0.6rem 0.5rem no-repeat;
	background-size: 1rem;
}

input:focus {
	box-shadow: 0 0 0 1px var(--border-color);
	outline: none;
	width: 300px;
}
</style>

<script lang="ts" setup>
const query = ref('');

const emit = defineEmits();

const handleInputChange = (event: Event) => {
	emit('update:query', query.value);
}
</script>