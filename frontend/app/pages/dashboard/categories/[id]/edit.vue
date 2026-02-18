<template>
  <div class="page-card">
    <h1 style="font-size: 24px">{{ t('nodes.category.editTitle') }}</h1>
    <form v-if="category" @submit.prevent>
      <div class="form-row">
        <div class="form-column">
          <label>{{ t('common.labels.name') }}</label>
          <input id="name" v-model="category.name" type="text" required />
        </div>
        <div class="form-column">
          <label>{{ t('common.labels.role') }}</label>
          <AppRadio v-model="category.role" :items="CATEGORY_ROLES" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-column">
          <label>{{ t('common.labels.parent') }}</label>
          <AppSelect
            v-model="category.parent_id"
            :items="categoriesItem"
            :placeholder="t('common.placeholder.parent')"
            nullable
            :disabled="i => i.id == category!.id || nodesStore.isDescendant(category!, i.id as string)"
          />
        </div>
        <div class="form-column">
          <label for="order">{{ t('common.labels.order') }}</label>
          <input id="order" v-model.number="category.order" type="number" />
        </div>
      </div>
      <label style="display: flex; align-items: center">{{ t('common.labels.icon') }} <AppHint :text="t('nodes.category.iconHint')" /></label>
      <textarea v-model="category.icon" type="text" rows="5" />

      <label for="color">{{ t('common.labels.color') }}</label>
      <AppColorPicker v-model="category.color" name="color" nullable />

      <div class="actions-row">
        <AppButton type="danger" @click="deleteCategory()">{{ t('common.actions.delete') }}</AppButton>
        <AppButton type="primary" class="btn primary" @click="updateCategory">{{ t('common.actions.update') }}</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { CATEGORY_ROLES } from '~/helpers/constants';
import DeleteModal from '~/components/Node/Modals/Delete.vue';

definePageMeta({ breadcrumb: 'Edit' });

const { t } = useI18nT();
const nodesStore = useNodesStore();
const route = useRoute();
const nodesTree = useNodesTree();

const category = computed(() => nodesStore.getById(route.params.id as string));
const categoriesItem = nodesTree.treeUpToRole(2);

const updateCategory = async () => {
  if (category.value)
    nodesStore
      .update(category.value)
      .then(() => {
        useNotifications().add({ type: 'success', title: t('nodes.category.notifications.updated') });
        useRouter().push('/dashboard/categories');
      })
      .catch(e => useNotifications().add({ type: 'error', title: t('common.status.error'), message: e }));
};
const deleteCategory = async () => {
  useModal().add(new Modal(shallowRef(DeleteModal), { props: { categoryId: category.value?.id || '' } }));
};
</script>

<style scoped lang="scss">
label {
  margin-top: 10px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-column {
  min-width: 200px;
  flex: 1;
}

.actions-row {
  justify-content: flex-end;
}
</style>
