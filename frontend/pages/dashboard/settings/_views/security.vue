<template>
  <h1>Security</h1>
  <h2>Last connection</h2>
  <div class="last_connection" v-if="store.last_connection">
    <div style="display: flex">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="569.4 86.3 83.6 48.2" width="100px">
        <path fill="var(--cl-chassis-back, black)" d="M577 89.8c0-1.4.2-2 .6-2.6.5-.5 1.2-.9 2.8-.9h61.7c1.4 0 2 .3 2.5.8s.7 1.2.7 2.7v41c0 1.4-.2 2-.5 2.4a2.7 2.7 0 0 1-2.2 1.1h-63c-.8 0-1.6-.3-2-1-.4-.4-.6-1-.6-2.5v-41Z"></path>
        <path fill="var(--cl-chassis-screen, #323232)" d="M578.4 132.9h65.5c.3 0 .6-.2.8-.4.2-.2.2-.5.2-1.4V89.8c0-1.2-.1-2-.6-2.4-.5-.5-1-.7-2.2-.7h-61.7c-1.3 0-2 .3-2.5.8-.4.4-.5 1-.5 2.3v41.3c0 .9 0 1.2.2 1.4.2.2.5.4.8.4Z"></path>
        <path fill-rule="evenodd" stroke="var(--cl-chassis-back1, 'gold')" stroke-width="0.3" d="M611.2 88.5a.3.3 0 1 0 0-.5.3.3 0 1 0 0 .5Z" clip-rule="evenodd"></path>
        <path fill="var(--cl-chassis-bottom, #191919)" fill-rule="evenodd" d="M569.4 133.3v-.5H653v.5s-1.9.6-4 .8c-1.4.1-3.7.4-8.9.4h-57.4c-4.5 0-8.3-.3-10-.5-1.7-.2-3.3-.7-3.3-.7Z" clip-rule="evenodd"></path>
        <path fill="var(--cl-screen, #111111)" fill-rule="evenodd" d="M579.7 89.5h63v39.4h-63V89.5Z" clip-rule="evenodd"></path>
      </svg>
      <div>
        <p><strong>Last connection:</strong> {{ new Date(store.last_connection.timestamp).toLocaleString() }}</p>
        <p><strong>IP:</strong> {{ store.last_connection.ip_adress }} ({{ store.last_connection.location }})</p>
        <p><strong>Browser:</strong> {{ parseUserAgent(store.last_connection.user_agent).browser }}</p>
        <p><strong>OS:</strong> {{ parseUserAgent(store.last_connection.user_agent).os }}</p>
      </div>
    </div>
    <p>{{ store.last_connection.user_agent }}</p>
  </div>
  <p class="warning">If you don't recognize this connection, please change your password and click on "Log out from all devices".</p>
  <h2>Password</h2>
  <form @submit.prevent="changePassword">
    <div class="form-group">
      <label for="password">New password</label>
      <input id="password" type="password" required v-model="passwordValue" />
    </div>
    <div class="form-group">
      <span style="display: flex"><label for="password_confirm">Confirm password</label> <span v-if="errorMessages.passwordNotMatch" class="err"> Password do not match !</span></span>
      <input id="password_confirm" type="password" required v-model="passwordConfirmValue" />
    </div>
    <AppButton type="danger">Change password</AppButton>
  </form>
  <h2>Danger</h2>
  <AppButton type="danger" @click="logoutUser">Log out</AppButton>
  <AppButton type="danger" @click="logoutUserAll">Log out from all devices</AppButton>
</template>

<script setup lang="ts">
const route = useRoute();
const currentPage = ref(route.query.p || 'profile');
const store = useUserStore();
const passwordValue = ref('');
const passwordConfirmValue = ref('');
const errorMessages = ref({
  passwordNotMatch: false,
});

watchEffect(() => (currentPage.value = route.query.p || 'profile'));

const changePassword = async () => {
  if (!store.user) return;
  if (passwordValue.value !== passwordConfirmValue.value) return (errorMessages.value.passwordNotMatch = true);
  store.updatePassword(passwordValue.value);
};

watchEffect(() => (currentPage.value = route.query.p || 'profile'));
</script>

<style scoped lang="scss">
.last_connection {
  align-items: center;
  padding: 0.3rem 0.5rem;
  border-radius: 15px;
  background-color: var(--bg-contrast-2);
}
p {
  margin: 0.5rem;
  font-size: 0.9rem;
}

.warning {
  color: $red;
  font-size: 0.9rem;
}
.err {
  color: $red;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
}
</style>
