<template>
  <footer>
    <Logo />
    <p class="p2">Developed and designed by Smaug with ❤️</p>
  </footer>
</template>

<style scoped lang="scss">
footer {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
}

footer .p2 {
  font-size: 14px;
  font-weight: 400;
}

footer .logo {
  max-width: 100px;
}

@media (max-width: 768px) {
  footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem 1rem;
    margin: 0;
  }

  footer .p2 {
    margin-top: 1rem;
  }
}
</style>
