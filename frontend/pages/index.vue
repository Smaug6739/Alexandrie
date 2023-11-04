<template>
	<div class="homepage">
		<header class="hero">
			<h1 class="site-title">Bienvenue sur Alexandrie</h1>
			<p class="site-description">Espace de gestion de notes et de documents.</p>
			<div class="dashboard-link">
				<NuxtLink to="https://dashboard.alexandrie-hub.fr">Accéder au dashboard</NuxtLink>
			</div>
		</header>

		<main class="content">
			<section class="category-list">
				<h2>Explorez les catégories</h2>
				<div class="category-cards">
					<div v-for="category in categories" :key="category.id" class="category-card">
						<NuxtLink :to="`/docs/${category.id}`">
							<div class="category-card-content">
								<i class="fas fa-folder"></i>
								<span>{{ category.name }}</span>
							</div>
						</NuxtLink>
					</div>
				</div>
			</section>

			<section class="document-list">
				<h2>Derniers documents</h2>
				<div class="document-cards">
					<div v-for="document in recentDocuments" :key="document.id" class="document-card">
						<a :href="`/docs/${document.category}/${document.id}`">
							<h3>{{ document.name }}</h3>
							<p>{{ document.description }}</p>
						</a>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.homepage {
	text-align: center;
	padding: 20px;
	color: var(--font-color);

	.hero {
		padding: 20px 80px;
		text-align: center;

		.site-title {
			font-size: 2.5rem;
			margin-bottom: 20px;
		}

		.site-description {
			font-size: 1.2rem;
		}

		.dashboard-link {
			font-size: 1.1rem;
			margin-top: 15px;
		}
	}

	.content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.category-list,
	.document-list {
		h2 {
			font-size: 2rem;
		}

		.category-cards,
		.document-cards {
			display: grid;
			gap: 20px;

			.category-card,
			.document-card {
				background: var(--bg-contrast);
				border-radius: 10px;
				box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
				padding: 20px;
				text-align: center;

				a {
					text-decoration: none;
					color: var(--font-color);
					transition: color $transition-duration;

					&:hover {
						color: $primary-400;
					}
				}

			}

			&.document-cards {
				grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
				margin-top: 20px;
			}

			&.category-cards {
				grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
				justify-content: center;
				margin-top: 20px;
				transition: all $transition-duration;
				padding: 20px;

				.category-card {
					transition: transform $transition-duration;

					&:hover {
						transform: scale(1.05);
					}
				}
			}
		}
	}
}
</style>

<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from '~/store';

const recentDocuments = computed(() => useDocumentsStore().getRecents(6));
const categories = computed(() => useCategoriesStore().getParents);
</script>
