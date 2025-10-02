<template>
  <div class="card-component">
    <div class="page-header">
      <h1>{{ category?.role === 1 ? 'Workspace' : 'Category' }} Settings</h1>
      <div class="header-actions">
        <AppButton type="danger" @click="deleteCategory()">Delete</AppButton>
        <AppButton type="primary" class="btn primary" @click="updateCategory">Save Changes</AppButton>
      </div>
    </div>

    <form v-if="category" @submit.prevent class="edit-form">
      <div class="form-grid">
        <!-- Basic Information Section -->
        <div class="form-section">
          <h2 class="section-title">Basic Information</h2>
          <div class="form-group">
            <label>Name</label>
            <input 
              id="name" 
              v-model="category.name" 
              type="text" 
              required 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Role</label>
            <AppRadio 
              v-model="category.role" 
              :items="CATEGORY_ROLES" 
              class="role-radio"
            />
          </div>

          <div class="form-group">
            <label>Parent Category</label>
            <AppSelect
              v-model="category.parent_id"
              :items="categoriesItem"
              placeholder="Select a category parent"
              :disabled="(i) => i.id == category!.id || nodesStore.isDescendant(category!, (i as Item).id)"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="order">Display Order</label>
            <input 
              id="order" 
              v-model.number="category.order" 
              type="number"
              class="form-input" 
            />
          </div>
        </div>

        <!-- Appearance Section -->
        <div class="form-section">
          <h2 class="section-title">Appearance</h2>
          <div class="form-group">
            <label class="icon-label">
              Icon 
              <AppHint text="SVG supported" />
            </label>
            <textarea 
              v-model="category.icon" 
              type="text" 
              rows="5"
              class="form-input"
              placeholder="Paste SVG code here" 
            />
            <div v-if="category.icon" class="icon-preview">
              <span>Preview:</span>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="preview" v-html="category.icon"></div>
            </div>
          </div>

          <div class="form-group">
            <label for="color">Accent Color</label>
            <AppColorPicker 
              v-model="category.color" 
              name="color" 
              :nullable="true" 
              class="color-picker"
            />
          </div>
        </div>

        <!-- Category Information Section -->
        <div class="form-section info-section">
          <h2 class="section-title">Category Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">{{ category.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Created:</span>
              <span class="info-value">{{ formatDate(category.created_timestamp) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Updated:</span>
              <span class="info-value">{{ formatDate(category.updated_timestamp) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Child Categories:</span>
              <span class="info-value">{{ childCategories.length }}</span>
            </div>
          </div>

          <div v-if="childCategories.length > 0" class="children-list">
            <h3>Child Categories</h3>
            <ul>
              <li v-for="child in childCategories" :key="child.id">
                <NuxtLink :to="`/dashboard/categories/${child.id}/edit`">
                  {{ child.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteModal from '../_modals/DeleteCategoryModal.vue';
import type { Item } from '~/types';

const nodesStore = useNodesStore();
const route = useRoute();

const category = computed(() => nodesStore.getById(route.params.id as string));
const categoriesItem = computed(() => 
  new TreeStructure(useSidebarTree().nodes.value.filter(i => i.data.role <= 2)).generateTree()
);

const childCategories = computed(() => {
  return nodesStore.getAll.toArray().filter(node => node.parent_id === category.value?.id);
});

definePageMeta({ breadcrumb: 'Edit' });

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const updateCategory = async () => {
  if (category.value)
    nodesStore
      .update(category.value)
      .then(() => {
        useNotifications().add({ type: 'success', title: 'Category updated' });
        useRouter().push('/dashboard/categories');
      })
      .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};

const deleteCategory = async () => {
  useModal().add(new Modal(shallowRef(DeleteModal), { 
    props: { categoryId: category.value?.id || '' }
  }));
};
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }
}

.edit-form {
  .form-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

.form-section {
  background: var(--background-light);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 1.25rem;
    margin: 0 0 1.5rem;
    color: var(--font-color);
  }
}

.form-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--font-color);
  }
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background);
  color: var(--font-color);
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--primary);
    outline: none;
  }
}

.role-radio {
  display: flex;
  gap: 1rem;
}

.icon-preview {
  margin-top: 1rem;
  
  span {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: var(--font-color-light);
  }

  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: var(--background);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
}

.info-section {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    background: var(--background);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .info-label {
      display: block;
      font-size: 0.875rem;
      color: var(--font-color-light);
      margin-bottom: 0.25rem;
    }

    .info-value {
      font-weight: 500;
      color: var(--font-color);
    }
  }
}

.children-list {
  margin-top: 1.5rem;
  
  h3 {
    font-size: 1rem;
    margin: 0 0 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 0.5rem;
      
      a {
        color: var(--primary);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Mobile Responsiveness
@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    .header-actions {
      width: 100%;
      justify-content: center;
    }
  }

  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .info-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
