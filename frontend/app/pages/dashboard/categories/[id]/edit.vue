<template>
  <div class="page-card">
    <Teleport to="#navbar-title">{{ t('nodes.category.editTitle') }}</Teleport>
    <form v-if="category" @submit.prevent>
      <Teleport to="#navbar-actions">
        <AppBtnIcon nav icon="delete" :tooltip="t('common.actions.delete')" @click="deleteCategory" />
        <AppBtnIcon nav icon="save" :tooltip="t('common.actions.update')" @click="updateCategory" />
      </Teleport>
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
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteModal from '~/components/Node/Modals/Delete.vue';
import { CATEGORY_ROLES } from '~/helpers/constants';

definePageMeta({ breadcrumb: { i18n: 'common.actions.edit' } });

const nodesStore = useNodesStore();

const { t } = useI18nT();
const nodesTree = useNodesTree();
const modals = useModal();
const notifications = useNotifications();
const route = useRoute();
const router = useRouter();

const category = computed(() => nodesStore.getById(route.params.id as string));
const categoriesItem = nodesTree.getTreeUpToRole(2);

// Actions
const updateCategory = async () => {
  if (category.value)
    nodesStore
      .update(category.value)
      .then(() => {
        notifications.add({ title: t('nodes.category.notifications.updated'), type: 'success' });
        router.push('/dashboard/categories');
      })
      .catch(e => notifications.add({ message: e, title: t('common.status.error'), type: 'error' }));
};

const deleteCategory = async () => {
  if (!category.value) return;
  modals.add(
    new Modal(shallowRef(DeleteModal), {
      props: {
        node: category.value,
        redirectTo: '/dashboard/categories',
      },
    }),
  );
};

// Shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Delete') return;
  event.preventDefault();
  deleteCategory();
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
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
</style>
