<template>
	<div class="view-medium">
		<div>
			<h1>
				Scientia</h1>
			<h2>Base de conaissances</h2>
			<div>
				Bienvenue sur l'application Scientia, ce projet est un site web quui regroupe des conaissances de base dans les
				domaines scientifiques (maths, physique technologie etc.)<br />
			</div>
			<h2>Informations</h2>
			<p>
				Si vous souhaitez suivre l'avancement de ce projet, vous pouvez consulter <a target="_blank"
					href="https://github.com/Smaug6739/docs">le repo github</a>. <br />
				Vous pouvez proposer de nouvelles idées ou reporter des problèmes en <a
					href="https://github.com/Smaug6739/docs/issues" target="_blank">participant au projet</a>.
			</p>
			<h2>Connexion</h2>
			<p>Pour écrire un nouveau post <NuxtLink to="/admin" no-prefetch>connectez vous</NuxtLink>.
			</p>
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