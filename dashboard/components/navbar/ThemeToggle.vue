<template>
	<Icon @click="toggleTheme" :name='themeIcon'></Icon>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import Icon from "@/components/Icon.vue"
const themeIcon = ref('bx-moon');

function toggleTheme() {
	if (document.documentElement.getAttribute("data-theme") === "dark") {
		document.documentElement.setAttribute("data-theme", "light");
		themeIcon.value = "bx-sun";
	} else if (document.documentElement.getAttribute("data-theme") === "light") {
		document.documentElement.setAttribute("data-theme", "dark");
		themeIcon.value = "bx bx-moon";
	} else {
		document.documentElement.setAttribute("data-theme", "light");
		themeIcon.value = "bx bx-sun";
	}
}
</script>

<style scoped lang="scss">
i {
	cursor: pointer;
	opacity: 0.5;
	font-size: 1.5rem;

	&:hover {
		opacity: 1;
		color: $primary-400
	}
}
</style>