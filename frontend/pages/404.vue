<!--404 error page (not found )-->
<template>
	<div class="view-medium">
		<div class="error-template">
			<h1>
				Oops!</h1>
			<h2>
				404 Not Found</h2>
			<div class="error-details">
				Sorry, an error has occured, Requested page not found! <br />
				<NuxtLink to="/" class="">Take Me Home </NuxtLink>
			</div>

		</div>
	</div>
</template>
<style scoped>
h1,
h2 {
	border: none;
}

.view-medium {
	margin-top: 50px;
	padding: 0 20px;
}
</style>