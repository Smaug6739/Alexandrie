<template>
	<i class="bx" :class="name, big ? 'big' : ''"></i>
</template>

<script lang="ts" setup>
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
	min-height: 50px;
	width: 50px;
	height: 50px;
	line-height: 50px;
	font-size: 19px;
	border-radius: 12px;
	text-align: center;
}

.big {
	height: 60px;
	min-width: 50px;
	font-size: 28px;
	line-height: 60px;
}
</style>