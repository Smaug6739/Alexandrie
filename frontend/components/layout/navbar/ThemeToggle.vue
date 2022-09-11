<template>
	<i @click="toggleTheme" class='bx bx-moon' ref="themeIcon"></i>

</template>

<script lang="ts" setup>

import { ref } from 'vue'
const themeIcon = ref();

function toggleTheme() {
	if (document.documentElement.getAttribute("data-theme") === "dark") {
		document.documentElement.setAttribute("data-theme", "light");
		themeIcon.value.className = "bx bx-sun";
	} else if (document.documentElement.getAttribute("data-theme") === "light") {
		document.documentElement.setAttribute("data-theme", "dark");
		themeIcon.value.className = "bx bx-moon";
	} else {
		document.documentElement.setAttribute("data-theme", "light");
		themeIcon.value.className = "bx bx-sun";
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