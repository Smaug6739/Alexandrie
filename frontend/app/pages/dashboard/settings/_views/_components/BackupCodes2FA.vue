<template>
  <div class="modal">
    <h2>Backup Recovery Codes</h2>

    <div class="warning-box">
      <p>
        <strong>Keep these codes safe!</strong>
        If you lose your 2FA device, these codes are the only way to recover your account. Each code can only be used once.
      </p>
    </div>

    <div class="codes-container">
      <div class="codes-list">
        <div v-for="(code, index) in backupCodes" :key="code" class="code-row">
          <span class="code-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <code class="code-text">{{ code.slice(0, 4) }}-{{ code.slice(4) }}</code>
        </div>
      </div>

      <button class="btn-copy" type="button" @click="copyAllCodes">
        <Icon :name="copied ? 'check' : 'copy'" display="sm" />
        <span>{{ copied ? 'Codes copied!' : 'Copy all codes' }}</span>
      </button>
    </div>

    <div class="footer">
      <AppButton type="secondary" @click="downloadCodes"> Download text file </AppButton>
      <AppButton type="primary" @click="emit('close')"> I have saved these codes </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  backupCodes: string[];
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const copied = ref(false);

function downloadCodes() {
  const text = `ALEXANDRIE RECOVERY CODES\nGenerated on: ${new Date().toLocaleDateString()}\n\n` + props.backupCodes.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `alexandrie-backup-codes.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function copyAllCodes() {
  if (copied.value) return;
  try {
    await navigator.clipboard.writeText(props.backupCodes.join('\n'));
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy codes: ', err);
  }
}
</script>

<style scoped lang="scss">
.modal {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.codes-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-overlay);
}

.codes-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 1.5rem;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--surface-transparent);
  }

  .code-index {
    font-family: monospace;
    font-size: 0.75rem;
    color: var(--text-secondary);
    opacity: 0.6;
    user-select: none;
  }

  .code-text {
    font-family: monospace;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.05em;
  }
}

.btn-copy {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--surface-transparent);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--border);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (width <= 400px) {
  .codes-list {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
