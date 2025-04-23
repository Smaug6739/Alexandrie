<template>
  <span class="header">
    <NuxtLink :to="`/dashboard/docs/edit/${doc_id}`">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
      </svg>
    </NuxtLink>
    <NuxtLink @click="print">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path
          d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"
        />
      </svg>
    </NuxtLink>
    <NuxtLink @click="openDeleteModal">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
      </svg>
    </NuxtLink>
  </span>
</template>

<script setup lang="ts">
import DeleteDocumentModal from '../_modals/DeleteDocumentModal.vue';

const props = defineProps<{ doc_id: string }>();
const print = () => window.print();
const openDeleteModal = () => useModal().add(new Modal(shallowRef(DeleteDocumentModal), { documentId: props.doc_id }));
</script>

<style lang="scss" scoped>
.header svg {
  cursor: pointer;
}

a {
  margin: 0 5px;
}

.header svg path {
  fill: var(--font-color);
}

button {
  font-weight: 600;
  font-size: medium;
}

.confirm {
  background-color: var(--font-color);
  color: var(--bg-color);
}
</style>
