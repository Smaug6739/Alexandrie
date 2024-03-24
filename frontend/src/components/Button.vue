<template>
	<button :class="`button button--${style}`">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ type: string }>()
const style = computed(() => props.type)

</script>

<style lang="scss">
button {
	padding: 10px 20px;
	border-radius: 5px;
	border: none;
	color: white;
	cursor: pointer;
	font-size: 16px;
	transition: 0.3s;
}

.button--default {
	background-color: #2d2d2d;

	&:hover {
		background-color: #3d3d3d;
	}
}

.button--primary {
	background-color: #007bff;

	&:hover {
		background-color: #0056b3;
	}
}

.button--success {
	background-color: #28a745;

	&:hover {
		background-color: #218838;
	}
}

.button--danger {
	background-color: #dc3545;

	&:hover {
		background-color: #c82333;
	}
}

.button--warning {
	background-color: #ffc107;

	&:hover {
		background-color: #d39e00;
	}
}

.button--info {
	background-color: #17a2b8;

	&:hover {
		background-color: #138496;
	}
}

.button--light {
	background-color: #f8f9fa;
	color: #2d2d2d;

	&:hover {
		background-color: #e2e6ea;
	}
}

.button--opposite {
	background-color: var(--font-color);
	color: var(--bg-color);

	&:hover {
		background-color: var(--font-color);
	}


}

.button--ghost {
	background-color: transparent;
	color: var(--font-color-dimmed);

	&:hover {
		background-color: var(--bg-color-secondary);
	}
}
</style>
