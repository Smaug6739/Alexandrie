<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from './stores';
// @ts-ignore
useDocumentsStore().fetch({ fields: ['id', 'name', 'description', 'category', 'created_timestamp'] });
useCategoriesStore().fetch();
</script>