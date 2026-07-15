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
        @click.prevent="loginWithProvider(provider.name)"
      >
        <!-- eslint-disable-next-line vue/no-v-html | Safe: icons are statically defined, not user input -->
        <span class="provider-icon" v-html="getProviderConfig(provider.name).icon"></span>
        <span class="provider-label">{{ getProviderLabel(provider.name) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProviderConfig, getProviderLabel } from '~/helpers/oidc-providers';

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
  gap: 1rem;
  margin-bottom: 1rem;

  &::before,
  &::after {
    flex: 1;
    height: 1px;
    background: var(--border);
    content: '';
  }

  span {
    font-size: 0.85rem;
    color: var(--text-secondary);
    white-space: nowrap;
  }
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  max-width: 400px;
  margin: 0 auto;

  // When only 1 provider, center it with max-width
  &:has(.provider-btn:only-child) {
    max-width: 500px;
  }
}

.provider-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-body);
  background: var(--surface-base);
  cursor: pointer;
  transition:
    border-color $transition-base ease,
    background-color $transition-base ease,
    box-shadow $transition-base ease,
    transform $transition-base ease;

  &:hover:not(:disabled) {
    border-color: var(--provider-color);
    background: color-mix(in srgb, var(--provider-color) 8%, transparent);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
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
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
}

.provider-label {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
