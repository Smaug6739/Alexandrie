<template>
  <section class="sponsor-wall">
    <h2>Support the project</h2>
    <p class="subtitle">Help fund hosting, CI, docs and community bounties</p>
    <div class="wall">
      <div v-for="i in 8" :key="i" class="slot"></div>
    </div>
    <div class="actions">
      <a href="https://github.com/sponsors/Smaug6739" target="_blank" class="btn">Become a sponsor</a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sponsor-wall { text-align: center; margin: 4rem auto; max-width: 1100px; padding: 2rem; background: var(--bg-contrast); border: 1px solid var(--border-color); border-radius: 16px }
.subtitle { color: var(--text-muted) }
.wall { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 12px }
.slot { height: 84px; border: 1px dashed var(--border-color); border-radius: 12px; background: var(--bg-color) }
.actions { margin-top: 12px }
.btn { padding: 10px 16px; border-radius: 999px; border: 1px solid var(--border-color); text-decoration: none; font-weight: 600 }
</style>

