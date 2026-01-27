<template>
  <div v-if="isEnabled && providers.length > 0" class="oidc-providers">
    <div class="divider">
      <span>or continue with</span>
    </div>
    <div class="providers-grid">
      <button
        v-for="provider in providers"
        :key="provider.name"
        class="provider-btn"
        :style="{ '--provider-color': getProviderConfig(provider.name).color }"
        :disabled="isLoading"
        @click="loginWithProvider(provider.name)"
      >
        <!-- eslint-disable-next-line vue/no-v-html | Safe: icons are statically defined, not user input -->
        <span class="provider-icon" v-html="getProviderConfig(provider.name).icon"></span>
        <span class="provider-label">{{ getProviderConfig(provider.name).label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProviderConfig } from '~/helpers/oidc-providers';
const { providers, isEnabled, isLoading, fetchProviders, loginWithProvider } = useOIDC();

onMounted(() => {
  fetchProviders();
});
</script>

<style scoped lang="scss">
.oidc-providers {
  width: 100%;
  margin-top: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color, #e5e7eb);
  }

  span {
    font-size: 0.85rem;
    color: var(--text-secondary, #6b7280);
    white-space: nowrap;
  }
}

.providers-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.provider-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px;
  background: var(--bg-secondary, #fff);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary, #1f2937);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--provider-color);
    background: color-mix(in srgb, var(--provider-color) 8%, transparent);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.provider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.provider-label {
  color: inherit;
}

/* Single provider - full width */
.providers-grid:has(.provider-btn:only-child) .provider-btn {
  width: 100%;
  justify-content: center;
}

/* Dark mode support */
:root.dark .provider-btn {
  background: var(--bg-secondary, #1f2937);
  border-color: var(--border-color, #374151);
  color: var(--text-primary, #f9fafb);
}
</style>
