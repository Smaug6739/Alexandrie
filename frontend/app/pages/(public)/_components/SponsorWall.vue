<template>
  <section class="sponsor-wall">
    <h2>Support the project</h2>
    <p class="subtitle">Help fund hosting, CI, docs and community bounties</p>
    <div class="actions">
      <a href="https://github.com/sponsors/Smaug6739" target="_blank" class="btn">Become a sponsor</a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sponsor-wall {
  max-width: 1100px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
  background: var(--bg-contrast);
}

.actions {
  margin-top: 12px;
}

.btn {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
}
</style>
