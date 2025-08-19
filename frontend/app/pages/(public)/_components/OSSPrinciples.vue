<template>
  <section class="principles">
    <h2>Our principles</h2>
    <div class="grid">
      <div class="card">
        <h3>Open by default</h3>
        <p>Public roadmap, transparent development, community-driven decisions.</p>
      </div>
      <div class="card">
        <h3>User freedom</h3>
        <p>Self-host, no lock-in, full export and import of your notes.</p>
      </div>
      <div class="card">
        <h3>Data portability</h3>
        <p>Standard Markdown and assets, works offline, easy backups.</p>
      </div>
      <div class="card">
        <h3>Simplicity first</h3>
        <p>Fast, reliable, minimal dependencies and predictable behavior.</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.principles { text-align: center; margin: 4rem auto; max-width: 1100px }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-top: 14px }
.card { border: 1px solid var(--border-color); background: var(--bg-color); border-radius: 12px; padding: 16px; text-align: left; transition: transform .2s ease, box-shadow .2s ease }
.card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(0,0,0,.12) }
</style>

