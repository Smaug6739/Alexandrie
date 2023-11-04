<template>
	<span>
		<Icon
			svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>'
			class="icon" />
		<input type="text" :placeholder="searchPlaceholder"
			@input="(v) => emit('search', (v.target as HTMLInputElement).value)" />
	</span>
</template>

<script lang="ts" setup>
import Icon from "@/components/Icon.vue";

defineProps<{ searchPlaceholder: string }>();
const emit = defineEmits(['search']);
</script>

<style lang="scss" scoped>
input {
	outline: none;
	height: 50px;
	border: none;
	border-radius: 12px;
	transition: all $transition-duration ease;
	background: var(--bg-contrast);
	font-size: 15px;
	color: var(--font-color);
	padding: 0 20px 0 50px;
	width: 97%;
}

span {
	margin-top: 25px;
	position: relative;
}

.icon {
	position: absolute;
	top: 0;
	left: 0;
}
</style>