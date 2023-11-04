<template>
  <Navbar />
  <Notification />
  <NuxtPage style="overflow-y: auto;" />
  <div id="backdrop"></div>
</template>
<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from './store';
import Navbar from './components/Navbar.vue';
import Notification from "../components/Notification/Notification.vue";

// @ts-ignore
useDocumentsStore().fetch({ fields: ['id', 'name', 'description', 'accessibility', 'category', 'created_timestamp'] });
useCategoriesStore().fetch();

</script>