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
				<router-link to="/" class="">Take Me Home </router-link>
			</div>

		</div>
	</div>
</template>
<style>
h1,
h2 {
	border: none;
}

.view-medium {
	margin-top: 50px;
}
</style>