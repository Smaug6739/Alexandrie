<template>
  <div>
    <h2 class="ctitle">Security</h2>
    <p class="csubtitle">Manage your security settings and monitor your account activity.</p>
    <h3>Last connection</h3>
    <div v-if="store.last_connection" class="last-connection">
      <div style="display: flex">
        <img src="/svg/computer.svg" alt="Device icon" />
        <div>
          <p><strong>Last connection:</strong> {{ numericDate(store.last_connection.timestamp) }}</p>
          <p><strong>IP:</strong> {{ store.last_connection.ip_adress }} ({{ store.last_connection.location }})</p>
          <p><strong>Browser:</strong> {{ parseUserAgent(store.last_connection.user_agent).browser }}</p>
          <p><strong>OS:</strong> {{ parseUserAgent(store.last_connection.user_agent).os }}</p>
        </div>
      </div>
      <p>{{ store.last_connection.user_agent }}</p>
    </div>
    <p class="warning">If you don't recognize this connection, please change your password and click on "Log out from all devices".</p>
    <h3>Password</h3>
    <form @submit.prevent="changePassword">
      <div class="form-group">
        <label for="password">New password</label>
        <input id="password" v-model="passwordValue" type="password" required />
      </div>
      <div class="form-group">
        <span style="display: flex; align-items: center"
          ><label for="password_confirm">Confirm password</label> <span v-if="errPasswordNotMatch" class="err"> Password do not match !</span></span
        >
        <input id="password_confirm" v-model="passwordConfirmValue" type="password" required />
      </div>
      <AppButton type="primary">Change password</AppButton>
    </form>
    <h3>Danger</h3>
    <div>
      You can log out from all devices or log out from this device. <br />
      Be careful, if you log out from all devices, you will be redirected to the login page. Please save your work before.
    </div>
    <AppButton type="danger" @click="logout">Log out</AppButton>
    <AppButton type="danger" @click="logoutAll">Log out from all devices</AppButton>
    <h2>Delete account</h2>
    <div>
      You can delete your account. <br />
      Be careful, if you delete your account, you will lose all your data and you will not be able to recover it.
      <br />
      <strong>By deleting your account you will remove:</strong>
      <ul>
        <li>All your files and folders</li>
        <li>All your uploads</li>
        <li>All your shares</li>
        <li>All your account data (preferences, profile...)</li>
      </ul>
      <p>
        You can <NuxtLink to="/dashboard/settings?p=backup" style="color: var(--primary); text-decoration: underline">export your data</NuxtLink> before
        deleting your account.
      </p>
    </div>
    <AppButton type="danger" @click="openDeleteModal">Delete account</AppButton>
  </div>
</template>

<script setup lang="ts">
import DeleteAccountModal from '../_modals/DeleteAccountModal.vue';
import { parseUserAgent } from '~/helpers/utils';

const emit = defineEmits(['close']);

const store = useUserStore();

const { numericDate } = useDateFormatters();

const passwordValue = ref('');
const passwordConfirmValue = ref('');
const errPasswordNotMatch = ref(false);

const changePassword = async () => {
  if (!store.user) return;
  if (passwordValue.value !== passwordConfirmValue.value) return (errPasswordNotMatch.value = true);
  store
    .updatePassword(passwordValue.value)
    .then(() => {
      passwordValue.value = '';
      passwordConfirmValue.value = '';
      errPasswordNotMatch.value = false;
      useNotifications().add({ type: 'success', title: 'Password changed successfully' });
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error during password saving', message: e.message }));
};

const logout = () => {
  logoutUser();
  emit('close');
};
const logoutAll = () => {
  logoutUserAll();
  emit('close');
};

const openDeleteModal = () => useModal().add(new Modal(shallowRef(DeleteAccountModal)));
</script>

<style scoped lang="scss">
.last-connection {
  padding: 0.3rem 0.5rem;
  border-radius: 10px;
  background-color: var(--bg-contrast-2);
  align-items: center;
}

p {
  margin: 0.5rem;
  font-size: 0.9rem;
}

.warning {
  font-size: 0.9rem;
  color: var(--red);
}

.err {
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  color: var(--red);
}
</style>
