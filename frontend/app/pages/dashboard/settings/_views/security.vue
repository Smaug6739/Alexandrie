<template>
  <div>
    <h2 class="ctitle">Security</h2>
    <p class="csubtitle">Manage your security settings and monitor your account activity.</p>
    <h3>Last connection</h3>
    <div v-if="store.last_connection" class="last-connection">
      <div style="display: flex">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="569.4 86.3 83.6 48.2" width="100px">
          <path
            fill="var(--cl-chassis-back, black)"
            d="M577 89.8c0-1.4.2-2 .6-2.6.5-.5 1.2-.9 2.8-.9h61.7c1.4 0 2 .3 2.5.8s.7 1.2.7 2.7v41c0 1.4-.2 2-.5 2.4a2.7 2.7 0 0 1-2.2 1.1h-63c-.8 0-1.6-.3-2-1-.4-.4-.6-1-.6-2.5v-41Z"
          />
          <path
            fill="var(--cl-chassis-screen, #323232)"
            d="M578.4 132.9h65.5c.3 0 .6-.2.8-.4.2-.2.2-.5.2-1.4V89.8c0-1.2-.1-2-.6-2.4-.5-.5-1-.7-2.2-.7h-61.7c-1.3 0-2 .3-2.5.8-.4.4-.5 1-.5 2.3v41.3c0 .9 0 1.2.2 1.4.2.2.5.4.8.4Z"
          />
          <path
            fill-rule="evenodd"
            stroke="var(--cl-chassis-back1, 'gold')"
            stroke-width="0.3"
            d="M611.2 88.5a.3.3 0 1 0 0-.5.3.3 0 1 0 0 .5Z"
            clip-rule="evenodd"
          />
          <path
            fill="var(--cl-chassis-bottom, #191919)"
            fill-rule="evenodd"
            d="M569.4 133.3v-.5H653v.5s-1.9.6-4 .8c-1.4.1-3.7.4-8.9.4h-57.4c-4.5 0-8.3-.3-10-.5-1.7-.2-3.3-.7-3.3-.7Z"
            clip-rule="evenodd"
          />
          <path fill="var(--cl-screen, #111111)" fill-rule="evenodd" d="M579.7 89.5h63v39.4h-63V89.5Z" clip-rule="evenodd" />
        </svg>
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
