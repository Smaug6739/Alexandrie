<template>
	<div>
		<div class="alert" v-bind:class="type || 'primary'">
			<slot> </slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.alert {
	margin: 5px;
	position: relative;
	padding: 1rem 1rem;
	margin-bottom: 1rem;
	border: 1px solid transparent;
	border-radius: 0.25rem;
	font-size: 1.1rem;

	a {
		font-weight: 700;
	}
}

strong {
	font-weight: 500;
}

.primary {
	color: #084298;
	background-color: #cfe2ff;
	border-color: #b6d4fe;
}

.success {
	background: #d1e7dd;
	color: #0f5132;
	border-color: #badbcc;
}

.danger {
	color: #842029;
	background-color: #f8d7da;
	border-color: #f5c2c7;
}


.warning {
	color: #664d03;
	background-color: #fff3cd;
	border-color: #ffecb5;
}
</style>

<script lang="ts">
export default {
	name: "Alert",
	props: {
		type: String,
	},
};
</script>