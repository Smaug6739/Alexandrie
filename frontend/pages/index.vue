<template>
	<div class="container">
    <nav>
      <div class="container"></div>
      <div class="actions">
        <NuxtLink to="/login" class="login">Login</NuxtLink>
        <NuxtLink to="/" class="sign-up">Sign up</NuxtLink>
      </div>

    </nav>
		<main>
			<div class="content-wrapper">
				<div class="intro">
					<div class="intro-text">
						<h1>Your Ideas, Documents & Plans. Unified. <br /> Alexandrie</h1>
						<h3>Alexandrie is the connected workspace where <br /> better, faster work happens</h3>
					</div>
					<div class="btns-block">
            <NuxtLink to="/dashboard" class="get-started">Get started</NuxtLink>
            <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="github">Github</NuxtLink>
					</div>
				</div>
				<div class="images">

					<div class="img-container">
            <img :src="`/main-${colorMode.value}.webp`" alt="Documents Image" />
					</div>
				</div>
			</div>
		</main>
		<footer>
			<Logo />
		</footer>
	</div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>

<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
nav {
  height: 65px;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
}
.actions {
  a {
    padding: 4px 15px;
    margin: 0 8px;
    border-radius: 25px;
  }
}
.sign-up {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  &:hover {
    outline: 2px solid var(--border-color);
    outline-offset: 2px;
  }
}
.login {
  background: var(--font-color);
  color: var(--bg-color);
  &:hover {
    outline: 2px solid var(--font-color);
    outline-offset: 2px;
  }
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
	font-size: 3.2rem;
	font-weight: 700;
}

.intro h3 {
	font-size: 1.3rem;
	font-weight: 500;
	text-decoration: none;
}

.btns-block {
  display: flex;
  justify-content: center;
	margin: 2rem;
	a {
    margin: 0 0.5rem;
		padding: 0.5rem 1.4rem;
		border-radius: 0.45rem;

		font-weight: 500;
		font-size: 1.2rem;
    &:hover {
      transform: scale(1.03)
    }
	}
  .get-started {
    background-color: var(--font-color);
    color: var(--bg-color);
    border: 1px solid var(--bg-color);
  }
  .github {
    background-color: var(--bg-color);
    color: var(--font-color);
    border: 1px solid var(--font-color);
  }
}

.none {
	display: none;
}

.images {
	display: flex;
	align-items: center;
	justify-content: center;
}

.img-container {
	width: 1000px;
}

@media (min-width: 768px) {
	.none {
		display: block;
	}
}

@media (min-width: 1024px) {
	.img-container {
	}
}

footer {
	padding: 1rem;
}
</style>
