<template>
  <footer>
    <div style="display: flex; align-items: center; column-gap: 0.5rem">
      <IconApp fill="var(--font-color)" style="width: 90px" />
      <NuxtLink to="/" style="font-weight: 600">Alexandrie</NuxtLink>
    </div>
    <p>Developed and designed by Smaug with ❤️</p>
  </footer>
</template>
<style scoped lang="scss">
footer {
  display: flex;
  padding: 1.5rem 2rem;
  align-items: center;
  border-top: 1px solid var(--border-color);
  justify-content: space-between;
}

@media (width <= 768px) {
  footer {
    margin: 0;
    padding: 2rem 1rem;
    text-align: center;
    align-items: center;
    flex-direction: column;
  }

  img {
    margin: 0 10px;
  }

  footer p {
    margin-top: 1rem;
  }
}
</style>
