<template>
  <div></div>
</template>

<script setup lang="ts">
import NodeJoin from '~/components/Node/Modals/Join.vue';

const route = useRoute();
const modals = useModal();

const openJoinModal = async () => {
  modals.add(new Modal(shallowRef(NodeJoin), { props: { code: route.query.code } }));
};

onMounted(() => {
  openJoinModal();
  navigateTo('/dashboard');
});
</script>
