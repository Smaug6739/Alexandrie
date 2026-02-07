<template>
  <nav>
    <NuxtLink to="/login" class="login">Login</NuxtLink>
    <NuxtLink to="/signup" class="sign-up">Sign up</NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: flex-end;

  a {
    margin: 0 8px;
    padding: 4px 15px;
    border-radius: 25px;
  }
}

.sign-up {
  border: 1px solid var(--border);
  background: var(--surface-base);

  &:hover {
    outline: 2px solid var(--border);
    outline-offset: 2px;
  }
}

.login {
  color: var(--surface-base);
  background: var(--primary);

  &:hover {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
</style>
