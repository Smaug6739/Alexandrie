<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div v-if="isOpen" class="global-search-overlay" @click="closeSearch">
        <div class="global-search-modal" @click.stop>
          <div class="search-header">
            <div class="search-input-wrapper">
              <Icon name="search" class="search-icon" />
                             <input
                 ref="searchInput"
                 v-model="searchQuery"
                 type="text"
                 placeholder="Search for a page or action..."
                 class="search-input"
                 @keydown="handleKeydown"
                 @input="filterResults"
               />
            </div>
            <button class="close-btn" @click="closeSearch">
              <Icon name="close" />
            </button>
          </div>
          
          <div class="search-results">
            <div v-if="searchQuery && combinedNavItems.length === 0 && filteredDocuments.length === 0" class="no-results">
              <Icon name="search" class="no-results-icon" />
              <p>No results found for "{{ searchQuery }}"</p>
            </div>

            <div class="search-results-list">
              <template v-if="combinedNavItems.length || filteredDocuments.length">
                <div class="section" v-if="combinedNavItems.length">
                  <div class="section-title">Pages & actions</div>
                  <div
                    v-for="(nav, nIdx) in combinedNavItems"
                    :key="nav.id"
                    class="search-result-item"
                    :class="{ 'selected': selectedIndex === nIdx }"
                    @click="nav.onClick()"
                    @mouseenter="selectedIndex = nIdx"
                  >
                    <Icon :name="nav.icon" class="result-icon" />
                    <div class="result-content">
                      <span class="result-title">{{ nav.title }}</span>
                      <span class="result-description">{{ nav.description }}</span>
                    </div>
                    <kbd v-if="nav.shortcut" class="shortcut">{{ nav.shortcut }}</kbd>
                    <Icon v-else name="new_tab" class="navigate-icon" />
                  </div>
                </div>

                <div class="section" v-if="filteredDocuments.length">
                  <div class="section-title">Documents</div>
                  <div
                    v-for="(doc, dIdx) in filteredDocuments"
                    :key="`doc-${doc.id}`"
                    class="search-result-item"
                    :class="{ 'selected': selectedIndex === combinedNavItems.length + dIdx }"
                    @click="navigateTo(doc)"
                    @mouseenter="selectedIndex = combinedNavItems.length + dIdx"
                  >
                    <Icon :name="doc.icon" class="result-icon" />
                    <div class="result-content">
                      <span class="result-title">{{ doc.title }}</span>
                      <span class="result-description">{{ doc.description }}</span>
                    </div>
                    <Icon name="new_tab" class="navigate-icon" />
                  </div>
                </div>
              </template>
            </div>
          </div>
          
                     <div class="search-footer">
             <div class="shortcuts">
               <kbd>↑↓</kbd> Navigate
               <kbd>Enter</kbd> Select
               <kbd>Escape</kbd> Close
             </div>
           </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import CreateCategoryModal from '@/pages/dashboard/categories/_modals/CreateCategoryModal.vue'

interface SearchResult {
  id: string
  title: string
  description: string
  icon: string
  path: string
  category: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  shortcut: string
  action: () => void
}

const router = useRouter()
const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement>()

 const availablePages: SearchResult[] = [
   {
     id: 'home',
     title: 'Home',
     description: 'Main dashboard',
     icon: 'dashboard',
     path: '/dashboard',
     category: 'Navigation'
   },
   {
     id: 'docs',
     title: 'Documents',
     description: 'Manage your documents',
     icon: 'file',
     path: '/dashboard/docs',
     category: 'Management'
   },
   {
     id: 'categories',
     title: 'Categories',
     description: 'Organize your categories',
     icon: 'categories',
     path: '/dashboard/categories',
     category: 'Management'
   },
   {
     id: 'cdn',
     title: 'CDN',
     description: 'Manage your resources',
     icon: 'cdn',
     path: '/dashboard/cdn',
     category: 'Management'
   },
   {
     id: 'import',
     title: 'Import',
     description: 'Import documents',
     icon: 'import',
     path: '/dashboard/import',
     category: 'Actions'
   },
   {
     id: 'settings',
     title: 'Settings',
     description: 'Configure the application',
     icon: 'settings',
     path: '/dashboard/settings',
     category: 'Configuration'
   }
 ]

const filteredResults = ref<SearchResult[]>([])

// Unified filtering across actions and pages
const query = computed(() => searchQuery.value.trim().toLowerCase())
function tokenize(text: string) {
  return text.trim().toLowerCase().split(/\s+/).filter(Boolean)
}
function matchesTokens(haystack: string, tokens: string[]) {
  const value = haystack.toLowerCase()
  return tokens.every(t => value.includes(t))
}
const filteredActions = computed<QuickAction[]>(() => {
  const tokens = tokenize(searchQuery.value)
  if (tokens.length === 0) return quickActions
  return quickActions.filter(a =>
    matchesTokens(a.title, tokens) || matchesTokens(a.description, tokens)
  )
})
// Documents from store (filter by title and tags)
const documentsStore = useDocumentsStore()
const filteredDocuments = computed<SearchResult[]>(() => {
  const tokens = tokenize(searchQuery.value)
  if (tokens.length === 0) return []
  return documentsStore.getAll
    .filter((d: any) => {
      const name = String(d.name || '').toLowerCase()
      const tags = Array.isArray(d.tags)
        ? d.tags.join(' ')
        : String(d.tags || '').replace(/[#,]/g, ' ')
      return tokens.every(t => name.includes(t) || tags.toLowerCase().includes(t))
    })
    .map((d: any) => ({
      id: d.id,
      title: d.name,
      description: d.tags ? `#${String(d.tags)}` : 'Document',
      icon: 'files',
      path: `/dashboard/docs/${d.id}`,
      category: 'Documents'
    }))
})
const filteredPages = computed<SearchResult[]>(() => {
  const tokens = tokenize(searchQuery.value)
  if (tokens.length === 0) return availablePages
  return availablePages.filter(page => {
    const pool = `${page.title} ${page.description} ${page.category}`
    return matchesTokens(pool, tokens)
  })
})
const combinedNavItems = computed(() => {
  return [
    ...filteredActions.value.map(a => ({
      id: `action-${a.id}`,
      icon: a.icon,
      title: a.title,
      description: a.description,
      shortcut: a.shortcut,
      onClick: () => executeAction(a)
    })),
    ...filteredPages.value.map(p => ({
      id: `page-${p.id}`,
      icon: p.icon,
      title: p.title,
      description: p.description,
      onClick: () => navigateTo(p)
    }))
  ]
})
const flattenedItems = computed(() => {
  const nav = combinedNavItems.value.map(i => ({
    kind: 'nav' as const,
    onClick: i.onClick
  }))
  const docs = filteredDocuments.value.map(d => ({
    kind: 'doc' as const,
    onClick: () => navigateTo(d)
  }))
  return [...nav, ...docs]
})

 const quickActions: QuickAction[] = [
   {
     id: 'new-doc',
     title: 'New document',
     description: 'Create a new document',
     icon: 'add_file',
     shortcut: 'Ctrl+N',
     action: () => router.push('/dashboard/docs/new')
   },
   {
     id: 'new-category',
     title: 'New category',
     description: 'Create a new category',
     icon: 'add_folder',
     shortcut: 'Ctrl+Shift+N',
     action: () => router.push('/dashboard/categories')
   },
   {
     id: 'search-docs',
     title: 'Search in docs',
     description: 'Search in your documents',
     icon: 'search',
     shortcut: 'Ctrl+q',
     action: () => router.push('/dashboard/docs')
   },
   {
     id: 'upload-file',
     title: 'Upload file',
     description: 'Add a resource to CDN',
     icon: 'import',
     shortcut: 'Ctrl+U',
     action: () => router.push('/dashboard/cdn')
   }
 ]

onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      openSearch()
    }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault()
      router.push('/dashboard/cdn')
    }
    else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault()
      useModal().add(new Modal(shallowRef(CreateCategoryModal), { role: 1 }))
    }

    if (e.key === 'Escape' && isOpen.value) {
      closeSearch()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  const openListener = () => openSearch()
  window.addEventListener('global-search-open', openListener as EventListener)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('global-search-open', openListener as EventListener)
  })
})

function openSearch() {
  isOpen.value = true
  selectedIndex.value = 0
  searchQuery.value = ''
  nextTick(() => {
    searchInput.value?.focus()
  })
}

function closeSearch() {
  isOpen.value = false
  searchQuery.value = ''
  selectedIndex.value = 0
}

function filterResults() {
  // Reset selection when query changes
  selectedIndex.value = 0
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = flattenedItems.value.length === 0
      ? 0
      : (selectedIndex.value + 1) % flattenedItems.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = flattenedItems.value.length === 0
      ? 0
      : (selectedIndex.value - 1 + flattenedItems.value.length) % flattenedItems.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (flattenedItems.value.length > 0) {
      const entry = flattenedItems.value[selectedIndex.value]!
      entry.onClick()
    }
  }
}

function navigateTo(result: SearchResult) {
  router.push(result.path)
  closeSearch()
}

function executeAction(action: QuickAction) {
  action.action()
  closeSearch()
}

defineExpose({
  openSearch,
  closeSearch
})
</script>

<style scoped lang="scss">
.global-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.global-search-modal {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 92%;
  max-width: 720px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideIn 0.2s ease-out;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: var(--text-muted);
  }
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--border-color);
    color: var(--text-color);
  }
}

.search-results {
  max-height: calc(80vh - 160px);
  overflow-y: auto;
}

.quick-actions {
  padding: 20px;
  
  h3 {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.quick-actions-grid {
  display: grid;
  gap: 8px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: var(--border-color);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.action-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-title {
  font-weight: 600;
  color: var(--text-color);
}

.action-description {
  font-size: 13px;
  color: var(--text-muted);
}

.shortcut {
  background: var(--border-color);
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-family: monospace;
  font-weight: 600;
}

.search-results-list {
  padding: 8px 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover,
  &.selected {
    background: var(--border-color);
  }
}

.result-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-description {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navigate-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.section {
  padding: 8px 0 4px;
}
.section-title {
  position: sticky;
  top: 0;
  background: var(--bg-color);
  z-index: 1;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 6px 20px;
}

.no-results {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
  
  .no-results-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
}

.search-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.shortcuts {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  
  kbd {
    background: var(--border-color);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 600;
  }
}

.search-modal-enter-active,
.search-modal-leave-active {
  transition: all 0.2s ease;
}

.search-modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.search-modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .global-search-modal {
    width: 95%;
    margin: 20px;
    max-height: 80vh;
  }
  
  .shortcuts {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
