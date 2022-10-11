<template>
	<i class="bx" :class="name, big ? 'big' : ''"></i>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
defineProps({
	name: {
		type: String,
		required: true,
	},
	big: {
		type: Boolean,
		required: false,
	}
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

.big {
	height: 60px;
	min-width: 50px;
	font-size: 28px;
	line-height: 60px;
}
</style>