<template>
	<i class="bx" :class="name"></i>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
defineProps({
	name: {
		type: String,
		required: true,
	},
});

</script>

<style lang="scss" scoped>
i {
	min-width: 50px;
	line-height: 50px;
	font-size: 18px;
	text-align: center;
	border-radius: 12px;
	line-height: 50px;
}
</style>