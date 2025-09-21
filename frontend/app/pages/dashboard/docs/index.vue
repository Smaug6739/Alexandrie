<template>
  <div class="card-component">
    <header>
      <h1 v-if="category">
        <Icon :name="category.icon || category?.icon || 'files'" :class="`category-icon ${getAppColor(category.color || category?.color as number, true)}`" />
        {{ category.name }}
      </h1>
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

const { filtered, workspaceId } = useSidebar();
const nodesStore = useNodesStore();
const view: Ref<'table' | 'list'> = ref('list');
const category = computed(() => nodesStore.getById(workspaceId.value || ''));
const documents = computed(() => {
  const result: Node[] = [];
  const getDocs = (items: Item[]) => {
    for (const item of items) {
      if (item.data.role == 3) result.push(item.data);
      if (item.childrens) getDocs(item.childrens);
    }
  };
  getDocs(filtered.value);
  return result;
});
</script>

<style scoped lang="scss">
h1 {
  display: flex;
  align-items: center;
}

.category-icon {
  width: 30px;
  height: 30px;
  padding: 6px;
  border-radius: 6px;
  margin-right: 10px;
}

.line-container {
  display: flex;
  flex-direction: column;
}

.line-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-top: 1px solid var(--border-color);
}

.line-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom: 1px solid var(--border-color);
}
</style>
