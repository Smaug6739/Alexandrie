<template>
  <section class="self-host">
    <div class="section-header">
      <h2>Self-host in minutes</h2>
      <p class="subtitle">Take full control of your data with a simple deployment</p>
    </div>

    <div class="steps-container">
      <div class="steps">
        <div v-for="(step, index) in steps" :key="index" class="step">
          <div class="step-header">
            <div class="step-index">{{ index + 1 }}</div>
            <h3>{{ step.title }}</h3>
          </div>
          <div class="step-content">
            <p v-html="step.description" />
            <div v-if="step.code" class="code-wrap">
              <pre class="code">{{ step.code }}</pre>
              <button class="copy" @click="copyCode(step.code, index)">
                <svg v-if="copiedIndex !== index" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="visual">
        <div class="terminal">
          <div class="terminal-header">
            <div class="terminal-dots"><span></span><span></span><span></span></div>
            <span class="terminal-title">Terminal</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="prompt">$</span>
              <span class="command">docker compose up -d</span>
            </div>
            <div class="terminal-line output">
              <span>[+] Running 3/3</span>
            </div>
            <div class="terminal-line output success">
              <span>✓ Container alexandrie-db Started</span>
            </div>
            <div class="terminal-line output success">
              <span>✓ Container alexandrie-minio Started</span>
            </div>
            <div class="terminal-line output success">
              <span>✓ Container alexandrie-app Started</span>
            </div>
            <div class="terminal-line">
              <span class="prompt">$</span>
              <span class="cursor"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="notes">
      <span class="pill">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>
        No telemetry
      </span>
      <span class="pill">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>
        Full data ownership
      </span>
      <span class="pill">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>
        MIT License
      </span>
      <span class="pill">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" /></svg>
        Docker ready
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Clone the repo',
    description:
      'Get the config files from GitHub <br /> <a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml">Download the docker-compose.yml file</a> <br /><a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/.env.example">Download the .env.example file</a> ',
    //code: 'git clone https://github.com/Smaug6739/Alexandrie.git',
  },
  {
    title: 'Configure',
    description: 'Change environment variables as needed (optional)',
    code: 'cp .env.example .env && nano .env',
  },
  {
    title: 'Launch',
    description: 'Start all services with Docker Compose',
    code: 'docker compose up -d',
  },
];

const copiedIndex = ref<number | null>(null);

function copyCode(code: string, index: number) {
  navigator.clipboard?.writeText(code);
  copiedIndex.value = index;
  setTimeout(() => (copiedIndex.value = null), 2000);
}
</script>

<style scoped lang="scss">
.self-host {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--font-color-light);
}

.steps-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 2rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step {
  position: relative;
  padding: 1.5rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateX(4px);
  }
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0.75rem;
}

.step-index {
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  color: white;
  background: var(--primary);
  align-items: center;
  justify-content: center;
}

.step-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.step-content p {
  font-size: 0.9rem;
  color: var(--font-color-light);
  margin-bottom: 0.75rem;
}

.code-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-family: $monospace-font;
  font-size: 13px;
  background: var(--bg-contrast);
  overflow: auto;
  white-space: nowrap;
}

.copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--font-color-light);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
}

// Terminal Visual
.visual {
  display: flex;
  justify-content: center;
}

.terminal {
  width: 100%;
  max-width: 500px;
  background: #1e1e2e;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 12px 16px;
  background: #181825;
  border-bottom: 1px solid #313244;
}

.terminal-dots {
  display: flex;
  gap: 6px;

  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &:nth-child(1) {
      background: #f38ba8;
    }
    &:nth-child(2) {
      background: #f9e2af;
    }
    &:nth-child(3) {
      background: #a6e3a1;
    }
  }
}

.terminal-title {
  font-size: 12px;
  color: #6c7086;
}

.terminal-body {
  padding: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.8;
}

.terminal-line {
  display: flex;
  gap: 8px;
  color: #cdd6f4;

  &.output {
    color: #6c7086;
    padding-left: 18px;
  }

  &.success {
    color: #a6e3a1;
  }
}

.prompt {
  color: #a6e3a1;
}

.command {
  color: #89b4fa;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #cdd6f4;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.notes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.pill {
  display: inline-flex;
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-weight: 500;
  font-size: 13px;
  background: var(--bg-color);
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
  }
}

.pill svg {
  width: 16px;
  height: 16px;
  fill: var(--green);
}

@media screen and (max-width: 968px) {
  .steps-container {
    grid-template-columns: 1fr;
  }

  .visual {
    order: -1;
  }
}

@media screen and (max-width: 640px) {
  .self-host {
    padding: 1rem;
  }

  .notes {
    gap: 8px;
  }

  .pill {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
