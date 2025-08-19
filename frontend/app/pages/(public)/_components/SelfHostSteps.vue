<template>
  <section class="self-host">
    <h2>Self-host in minutes</h2>
    <div class="steps">
      <div class="step">
        <div class="step-index">1</div>
        <h3>Docker</h3>
        <div class="code-wrap">
          <pre class="code">docker compose up -d --build</pre>
          <button class="copy" @click="copyDockerCompose">Copy</button>
        </div>
      </div>
      <div class="step">
        <div class="step-index">2</div>
        <h3>Configure</h3>
        <p>Set environment variables for storage, auth and CDN integration.</p>
      </div>
      <div class="step">
        <div class="step-index">3</div>
        <h3>Go</h3>
        <p>Open your instance, import notes, and start writing.</p>
      </div>
    </div>
    <div class="notes">
      <span class="pill"
        ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>No telemetry by default</span
      >
      <span class="pill"
        ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>Keep full control of your data</span
      >
      <span class="pill"
        ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>MIT License</span
      >
    </div>
  </section>
</template>

<script setup lang="ts">
function copyDockerCompose() {
  navigator.clipboard?.writeText('docker compose up -d --build');
}
</script>

<style scoped lang="scss">
.self-host {
  text-align: center;
  margin: 4rem auto;
  max-width: 1100px;
}
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.step {
  background: var(--bg-contrast);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  text-align: left;
}
.step-index {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  font-weight: 700;
  margin-bottom: 8px;
}
.code-wrap {
  display: flex;
  align-items: center;
}
.code {
  flex: 1;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 14px;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
}
.copy {
  margin-left: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--bg-contrast);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-weight: 600;
}
.notes {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 14px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  color: var(--text-color);
  font-weight: 500;
}
.pill svg {
  width: 16px;
  height: 16px;
  fill: var(--primary);
}
</style>
