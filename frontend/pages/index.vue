<script setup lang="ts">
import { useCategoriesStore } from '~/store';
const colorMode = useColorMode()
const categories = computed(() => useCategoriesStore().getParents);

</script>

<template>
	<div style="height:100%;display: flex; flex-direction: column;">
		<main style="height:100%;flex-grow: 1;padding-top:5rem;">
			<div style="height: 100%; display: flex; flex-direction: column;">
				<div
					style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 2rem; flex: 1;">
					<div style="max-width: 48rem; gap: 1rem;">
						<h1 style="font-size: 2.7rem; font-weight: 700; ">
							Your Ideas, Documents & Plans. Unified. Welcome to
							<span>Alexandrie</span>
						</h1>
						<h3 style="font-size: 1.7rem; font-weight: 500;text-decoration: none;">
							Alexandrie is the connected workspace where <br />
							better, faster work happens
						</h3>
						<hr style="margin:10px 0;" />
						<!-- Display categories -->
						<div style="display: flex; justify-content: center; gap: 1rem;">
							<NuxtLink v-for="category in categories" :key="category.id" :to="`/docs/${category.id}`">
								{{ category.name }}
							</NuxtLink>
						</div>
						<hr style="margin:10px 0;" />
						<AppButton type="opposite">

							<p style="display:flex; align-items: center; margin:0;">Get started
								&nbsp;
								<Arrow />
							</p>

						</AppButton>
					</div>
					<div style="display: flex; align-items: center; justify-content: center; max-width: 80rem;">
						<div style="width: 300px; height: 300px;" class="none">
							<img :src="`/documents-${colorMode.value}.png`" />
						</div>
						<div style="width: 300px; height: 300px;">
							<img :src="`/reading-${colorMode.value}.png`" />
						</div>
					</div>
				</div>
				<div
					style="display: flex; align-items: center; width: 100%; padding: 1.5rem; z-index: 50;justify-content: space-between;">
					<Logo />
					<div style="margin-left: auto; justify-content: space-between; align-items: center; gap: 0.5rem;">
						<AppButton type="ghost">Privacy Policy</AppButton>
						<AppButton type="ghost">Terms of Service</AppButton>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.img-container {
	position: relative;
	width: 300px;
	height: 300px;
}

@media (min-width: 768px) {
	.none {
		display: block;
	}
}

@media (min-width: 1024px) {

	.img-container {
		width: 350px;
		height: 350px;
	}
}
</style>