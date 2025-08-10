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
  background: var(--primary);
  color: var(--bg-color);

  &:hover {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
</style>
