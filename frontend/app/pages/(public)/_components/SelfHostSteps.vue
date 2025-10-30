<template>
  <section class="self-host">
    <h2>Self-host in minutes</h2>
    <div class="steps">
      <div class="step">
        <div class="step-index">1</div>
        <h3>Docker</h3>
        <div class="code-wrap">
          <pre class="code">docker compose up</pre>
          <button class="copy" @click="copyDockerCompose">Copy</button>
          <span v-if="copied" class="copied">Copied!</span>
        </div>
      </div>
      <div class="step">
        <div class="step-index">2</div>
        <h3>Go</h3>
        <p>Nothing to configure ! The app is ready to use.</p>
      </div>
      <div class="step">
        <div class="step-index">3</div>
        <h3>Personalize</h3>
        <p>Set environment variables for storage, auth and CDN integration and deploy to prod</p>
      </div>
    </div>
    <div class="notes">
      <span class="pill"
        ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>No telemetry</span
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
const copied = ref(false);
function copyDockerCompose() {
  navigator.clipboard?.writeText('docker compose up');
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>

<style scoped lang="scss">
.self-host {
  max-width: 1100px;
  margin: 4rem auto;
  text-align: center;
}

.steps {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-top: 16px;
}

.step {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: left;
  background: var(--bg-contrast);
}

.step-index {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  font-weight: 700;
  color: white;
  background: var(--primary);
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.code-wrap {
  display: flex;
  align-items: center;
}

.code {
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  background: var(--bg-color);
  flex: 1;
  overflow: auto;
}

.copy {
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-weight: 600;
  background: var(--bg-contrast);
  cursor: pointer;
  margin-left: 8px;
}

.copied {
  margin-left: 12px;
  font-size: 14px;
  color: var(--green);
  font-weight: 600;
}

.notes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 14px;
}

.pill {
  display: inline-flex;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-weight: 500;
  background: var(--bg-color);
  align-items: center;
  gap: 8px;
}

.pill svg {
  width: 16px;
  height: 16px;
  fill: var(--primary);
}
</style>
