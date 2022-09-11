<template>
	<div>
		<Sidebar />
		<BackToTop />
		<router-view name="doc" />
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BackToTop from "../../components/common/back-to-top/index"
import Sidebar from "../../components/layout/sidebar/Sidebar.vue";

export default defineComponent({
	name: "Data",
	components: {
		Sidebar,
		BackToTop,
	},
});
</script>
