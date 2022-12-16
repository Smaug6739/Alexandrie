<template>
	<div class="view-medium">
		<h1><span class="gradient">Alexandrie</span></h1>
		<h2>Base de données</h2>
		Alexandrie est une base de donnée qui regroupe des connnaissances dans les domainees scientifiques
		(mathématiques, physique, ingénierie, informatique, etc...).
		<h2>Domaines</h2>
		<ul>
			<li v-for="category of categories">
				<NuxtLink :to="`/docs/${category.name}`" no-prefetch>{{ category.name }}</NuxtLink>
			</li>
		</ul>
		<h2>Roadmap</h2>
		<ul>
			<li>Remplacement de Scientia par Alexandrie</li>
			<li>Ouverture d'un sous domaine pour le développement/informatique</li>
			<li>Migration des anciennes ressources</li>
		</ul>
		<h2>Informations</h2>
		<p>
			Si vous souhaitez suivre l'avancement de ce projet, vous pouvez consulter <a target="_blank"
				href="https://github.com/Smaug6739/docs">le repo github</a>. <br />
			Vous pouvez proposer de nouvelles idées ou reporter des problèmes en <a
				href="https://github.com/Smaug6739/docs/issues" target="_blank">participant au projet</a>. <br />
			L'API est accessible sous réserve d'accord. <br />
			Le code source est disponible sous licence MIT. <br />
			<!--Sponsors-->
			<a href="https://www.buymeacoffee.com/smaug6739" target="_blank"><img
					src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"
					style="height: 51px;width: 217px; margin-top:12px;" /></a>
		</p>
	</div>
</template>
<style scoped lang="scss">
h1 {
	font-size: 3rem;
}

h2 {
	font-size: 2rem;
}

h1,
h2 {
	border: none;
}

.gradient {
	background: linear-gradient(45deg, #f7b500, #b620e0, #32c5ff);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
</style>
<script setup lang="ts">
import { useCategoriesStore } from '~~/store';
const categories = useCategoriesStore().getAll;
</script>