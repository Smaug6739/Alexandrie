<template>
  <div class="card-component category-edit">
    <header class="page-header">
      <div class="header-content">
        <h1>{{ category?.role === 1 ? 'Workspace' : 'Category' }}</h1>
        <p class="subtitle">Manage your category settings and information</p>
      </div>
      <div class="header-actions">
        <AppButton type="danger" class="delete-btn" @click="deleteCategory()">
          <Icon name="trash" /> Delete
        </AppButton>
        <AppButton type="primary" class="save-btn" @click="updateCategory">
          <Icon name="save" /> Save Changes
        </AppButton>
      </div>
    </header>

    <form v-if="category" @submit.prevent class="edit-form">
      <!-- Basic Information Section -->
      <section class="form-section">
        <h2 class="section-title">
          <Icon name="info" />
          Basic Information
        </h2>
        <div class="form-content">
          <div class="form-field">
            <label for="name">Name</label>
            <input 
              id="name" 
              v-model="category.name" 
              type="text" 
              required 
              class="form-input"
              placeholder="Enter category name"
            />
          </div>

          <div class="form-field">
            <label>Type</label>
            <AppRadio 
              v-model="category.role" 
              :items="CATEGORY_ROLES" 
              class="role-selector"
            />
          </div>
        </div>
      </section>

      <!-- Organization -->
      <section class="form-section">
        <h2 class="section-title">
          <Icon name="folder" />
          Organization
        </h2>
        <div class="form-content">
          <div class="form-field">
            <label>Parent Category</label>
            <AppSelect
              v-model="category.parent_id"
              :items="categoriesItem"
              placeholder="Select parent category"
              :disabled="(i) => i.id == category!.id || nodesStore.isDescendant(category!, (i as Item).id)"
              class="form-select"
            />
          </div>

          <div class="form-field">
            <label for="order">Display Order</label>
            <input 
              id="order" 
              v-model.number="category.order" 
              type="number"
              class="form-input"
              min="0"
            />
            <small class="field-hint">Lower numbers appear first</small>
          </div>
        </div>
      </section>

      <!-- Appearance -->
      <section class="form-section">
        <h2 class="section-title">
          <Icon name="palette" />
          Appearance
        </h2>
        <div class="form-content">
          <div class="form-field icon-field">
            <label class="icon-label">
              Icon 
              <AppHint text="SVG icons are supported" />
            </label>
            <div class="icon-input-group">
              <textarea 
                v-model="category.icon" 
                class="form-input"
                rows="3"
                placeholder="Paste your SVG icon code here"
              />
              <div v-if="category.icon" class="icon-preview">
                <span>Preview</span>
                <div 
                  class="preview-box"
                  :style="{ color: category.color || 'var(--font-color)' }"
                  v-html="category.icon"
                ></div>
              </div>
            </div>
          </div>

          <div class="form-field">
            <label>Theme Color</label>
            <AppColorPicker 
              v-model="category.color" 
              :nullable="true"
              class="color-picker"
            />
          </div>
        </div>
      </section>

      <!-- Category Details -->
      <section class="form-section details-section">
        <h2 class="section-title">
          <Icon name="details" />
          Category Details
        </h2>
        <div class="details-grid">
          <div class="detail-card">
            <span class="detail-label">Category ID</span>
            <span class="detail-value">{{ category.id }}</span>
          </div>
          <div class="detail-card">
            <span class="detail-label">Created On</span>
            <span class="detail-value">{{ formatDate(category.created_timestamp) }}</span>
          </div>
          <div class="detail-card">
            <span class="detail-label">Last Modified</span>
            <span class="detail-value">{{ formatDate(category.updated_timestamp) }}</span>
          </div>
          <div class="detail-card">
            <span class="detail-label">Child Categories</span>
            <span class="detail-value">{{ childCategories.length }}</span>
          </div>
        </div>

        <!-- Child Categories List -->
        <div v-if="childCategories.length > 0" class="children-section">
          <h3 class="subsection-title">
            <Icon name="subfolder" />
            Child Categories
          </h3>
          <div class="children-grid">
            <NuxtLink 
              v-for="child in childCategories" 
              :key="child.id"
              :to="`/dashboard/categories/${child.id}/edit`"
              class="child-card"
            >
              <div class="child-icon" v-html="child.icon"></div>
              <span class="child-name">{{ child.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </form>
  </div>
</template>

<style scoped lang="scss">
.category-edit {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.page-header {
  margin-bottom: var(--spacing-xl);
  
  .header-content {
    h1 {
      font-size: 2rem;
      margin: 0;
      color: var(--heading-color);
    }
    
    .subtitle {
      color: var(--text-muted);
      margin: var(--spacing-xs) 0 0;
    }
  }

  .header-actions {
    margin-top: var(--spacing-md);
    display: flex;
    gap: var(--spacing-md);
    
    .delete-btn, .save-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      min-width: 120px;
      justify-content: center;
    }
  }
}

.form-section {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  
  .section-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 1.25rem;
    margin: 0 0 var(--spacing-lg);
    color: var(--heading-color);
    
    .icon {
      color: var(--primary-color);
    }
  }
}

.form-content {
  display: grid;
  gap: var(--spacing-lg);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

.form-field {
  margin-bottom: var(--spacing-md);
  
  label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
    color: var(--label-color);
  }
  
  .field-hint {
    display: block;
    margin-top: var(--spacing-xs);
    color: var(--text-muted);
  }
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--input-bg);
  color: var(--text-color);
  transition: all 0.2s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
    outline: none;
  }
}

.icon-field {
  .icon-input-group {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-start;
    
    @media (max-width: 767px) {
      flex-direction: column;
    }
    
    textarea {
      flex: 1;
    }
  }
  
  .icon-preview {
    text-align: center;
    
    span {
      display: block;
      margin-bottom: var(--spacing-xs);
      color: var(--text-muted);
    }
    
    .preview-box {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-color);
      border-radius: var(--radius-md);
      border: 2px solid var(--border-color);
    }
  }
}

.details-section {
  .details-grid {
    display: grid;
    gap: var(--spacing-md);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    margin-bottom: var(--spacing-xl);
  }
  
  .detail-card {
    background: var(--surface-alt-color);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    
    .detail-label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: var(--spacing-xs);
    }
    
    .detail-value {
      font-weight: 500;
      color: var(--text-color);
    }
  }
}

.children-section {
  margin-top: var(--spacing-xl);
  
  .subsection-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-md);
    color: var(--heading-color);
  }
  
  .children-grid {
    display: grid;
    gap: var(--spacing-md);
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .child-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--surface-hover-color);
      border-color: var(--primary-color);
    }
    
    .child-icon {
      width: 24px;
      height: 24px;
      color: var(--primary-color);
    }
    
    .child-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// Enhanced Mobile Responsiveness
@media (max-width: 767px) {
  .category-edit {
    padding: var(--spacing-md);
  }
  
  .page-header {
    text-align: center;
    
    .header-actions {
      flex-direction: column;
      width: 100%;
      
      button {
        width: 100%;
      }
    }
  }
  
  .form-section {
    padding: var(--spacing-md);
  }
  
  .details-grid {
    grid-template-columns: 1fr !important;
  }
  
  .children-grid {
    grid-template-columns: 1fr !important;
  }
  
  .form-content {
    grid-template-columns: 1fr !important;
  }
}
</style>
