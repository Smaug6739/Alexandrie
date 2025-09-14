<template>
  <div class="card-component">
    <header>
      <h1>Documents <tag blue>New</tag></h1>
      <ViewSelection v-model="view" />
    </header>
    <template v-if="documents.length">
      <div v-if="view == 'table'" class="line-container">
        <DocumentLine v-for="document of documents" :key="document.id" :document="document" class="line-item" />
      </div>
      <DocumentsGrid v-else :documents="documents" />
    </template>
    <NoContent v-else title="No documents found" description="There are no documents here">
      <NuxtLink to="/dashboard/docs/new"><AppButton type="link" style="font-weight: bold">Create new one </AppButton></NuxtLink>
    </NoContent>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const view: Ref<'table' | 'list'> = ref('list');
const documents = computed(() => {
  const result: Node[] = [];
  const getDocs = (items: Item[]) => {
    for (const item of items) {
      if (item.data.role == 3) result.push(item.data);
      if (item.childrens) getDocs(item.childrens);
    }
  };
  getDocs(useSidebarTree().filtered.value);
  return result;
});
</script>

<style scoped lang="scss">
.line-container {
  display: flex;
  flex-direction: column;
}

.line-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.line-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
