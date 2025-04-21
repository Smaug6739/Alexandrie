<!-- Category creation modal -->
<!-- Should be like folder creation on linux or mac -->
<template>
  <div class="modal fade" id="createCategoryModal" tabindex="-1" role="dialog" aria-labelledby="createCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createCategoryModalLabel">Create Category</h5>
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div>
            <div class="form-group">
              <label for="categoryName">Category Name</label>
              <input type="text" class="form-control" id="categoryName" v-model="category.name" required />
            </div>
            <AppButton type="primary" @click="createCategory">Create</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/stores';
import test_wp2 from './test_wp2.vue';

const categoriesStore = useCategoriesStore();

const category = ref<Category>({
  name: '',
  type: 'category',
  id: '',
  role: 0,
});
const createCategory = () => {
  useModal().modals.value.push({
    component: shallowRef(test_wp2),
    name: 'CreateCategoryModal',
    props: undefined,
  });
  // categoriesStore.post(category.value)
};
</script>

<style scoped lang="scss">
.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
}

.close {
  cursor: pointer;
}
</style>
