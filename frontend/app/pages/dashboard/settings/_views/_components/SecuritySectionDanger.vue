<template>
  <section>
    <h3>{{ t('settings.security.dangerZone') }}</h3>
    <p class="page-subtitle">{{ t('settings.security.dangerZoneDesc') }}</p>

    <div class="section">
      <div class="card">
        <div class="card-content">
          <div class="card-icon">
            <Icon name="logout" display="sm" />
          </div>
          <div class="card-info">
            <h4>{{ t('settings.security.logout') }}</h4>
            <p>{{ t('settings.security.logoutDesc') }}</p>
          </div>
        </div>
        <AppButton type="secondary" @click="logout">{{ t('settings.security.logout') }}</AppButton>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="card-icon warning">
            <Icon name="devices" display="sm" />
          </div>
          <div class="card-info">
            <h4>{{ t('settings.security.logoutAll') }}</h4>
            <p>{{ t('settings.security.logoutAllDesc') }}</p>
          </div>
        </div>
        <AppButton type="danger" @click="logoutAll">{{ t('settings.security.logoutAll') }}</AppButton>
      </div>

      <div class="card destructive">
        <div class="card-content">
          <div class="card-icon destructive">
            <Icon name="delete" display="sm" />
          </div>
          <div class="card-info">
            <h4>{{ t('settings.security.deleteAccount') }}</h4>
            <p>{{ t('settings.security.deleteAccountDesc') }}</p>
            <details class="delete-details">
              <summary>{{ t('settings.security.deleteAccountDetails') }}</summary>
              <ul>
                <li>{{ t('settings.security.deleteAccountList.files') }}</li>
                <li>{{ t('settings.security.deleteAccountList.uploads') }}</li>
                <li>{{ t('settings.security.deleteAccountList.shares') }}</li>
                <li>{{ t('settings.security.deleteAccountList.data') }}</li>
              </ul>
              <p class="backup-hint">
                <NuxtLink to="/dashboard/settings?p=backup">{{ t('settings.security.backupHint') }}</NuxtLink>
              </p>
            </details>
          </div>
        </div>
        <AppButton type="danger" @click="openDeleteModal">{{ t('settings.security.deleteAccount') }}</AppButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DeleteAccountModal from '../../_modals/DeleteAccountModal.vue';

const emit = defineEmits(['close']);

const userStore = useUserStore();

const { t } = useI18nT();
const modals = useModal();

userStore.fetchSessions();

const logout = () => {
  logoutUser();
  emit('close');
};
const logoutAll = () => {
  logoutUserAll();
  emit('close');
};

const openDeleteModal = () => modals.add(new Modal(shallowRef(DeleteAccountModal)));
</script>
<style lang="scss" scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.card {
  display: flex;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  transition: border-color $transition-fast ease;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;

  &:hover {
    border-color: var(--border-strong);
  }

  &.destructive {
    border-color: var(--red-border);
    background: var(--red-bg-light);

    &:hover {
      border-color: var(--red);
    }
  }
}

.card-content {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  flex: 1;
  gap: 1rem;
}

.card-icon {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  color: var(--text-body);
  background: var(--surface-overlay);
  align-items: center;
  flex-shrink: 0;
  justify-content: center;

  &.warning {
    color: var(--orange-dark);
    background: var(--orange-bg);
  }

  &.destructive {
    color: var(--red);
    background: var(--red-bg);
  }
}

.card-info {
  min-width: 0;
  flex: 1;

  h4 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  > p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--text-secondary);
  }
}

.delete-details {
  margin-top: 0.75rem;

  summary {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--red-dark);
    cursor: pointer;
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }

  ul {
    margin: 0.5rem 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    padding-left: 1.25rem;

    li {
      margin: 0.2rem 0;
    }
  }

  .backup-hint {
    font-size: 0.8rem;
    color: var(--text-secondary);

    a {
      font-weight: 500;
      color: var(--primary);
      text-decoration: underline;
    }
  }
}

@media (width <= 600px) {
  .card {
    align-items: stretch;
    flex-direction: column;

    button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
