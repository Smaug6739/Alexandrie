<template>
	<div class="container">
		<main>
			<div class="content-wrapper">
				<div class="intro">
					<div class="intro-text">
						<h1>Your Ideas, Documents & Plans. Unified. Welcome to <span>Alexandrie</span></h1>
						<h3>Alexandrie is the connected workspace where <br /> better, faster work happens</h3>
					</div>
					<div class="get-started">
						<NuxtLink to="/dashboard">Get started</NuxtLink>
					</div>
				</div>
				<div class="images">
					<div class="img-container none">
						<img :src="`/documents-${colorMode.value}.png`" alt="Documents Image" />
					</div>
					<div class="img-container">
						<img :src="`/reading-${colorMode.value}.png`" alt="Reading Image" />
					</div>
				</div>
			</div>

		</main>
		<footer>
			<Logo />
			<div class="footer-links none">
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>

<style scoped lang="scss">
.container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

main {
	flex-grow: 1;
	padding-top: 1.5rem;
}

.content-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	flex: 1;
}

.intro {
	max-width: 48rem;
	gap: 1rem;
}

.intro h1 {
	font-size: 2.7rem;
	font-weight: 700;
}

.intro h3 {
	font-size: 1.7rem;
	font-weight: 500;
	text-decoration: none;
}

.get-started {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.none {
	display: none;
}

.images {
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 80rem;
}

.img-container {
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

footer {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 1rem;
	justify-content: space-between;
}

.footer-links {
	margin-left: auto;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
}
</style>
