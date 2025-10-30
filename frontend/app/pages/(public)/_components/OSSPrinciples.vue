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
.principles {
  max-width: 1100px;
  margin: 4rem auto 0;
  text-align: center;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-top: 14px;
}

.card {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: left;
  background: var(--bg-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 14px 32px rgb(0 0 0 / 12%);
  transform: translateY(-4px);
}
</style>
