<template>
  <div class="table">
    <header>
      <input v-model="searchInput" type="text" placeholder="Search..." />
      <!-- Actions groupées (slot) -->
      <slot v-if="selectedRows.length > 0" name="bulk-actions" :selected="selectedRows"> </slot>
    </header>

    <div class="wrapper">
      <table>
        <thead>
          <tr>
            <!-- Case "Select all" -->
            <th>
              <input type="checkbox" style="width: 20px" :checked="selectedRows.length > 0" @change="toggleSelectAll" />
            </th>
            <th v-for="header in headers" :key="header.key">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <!-- Case à cocher -->
            <td>
              <input v-model="selectedRows" type="checkbox" :value="row" style="width: 20px" />
            </td>
            <td v-for="header in headers" :key="header.key">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-if="row[header.key]?.type === 'html'" v-html="row[header.key]?.content" />
              <span v-else-if="row[header.key]?.type === 'slot'">
                <slot :name="header.key" :cell="row[header.key]" />
              </span>
              <span v-else v-text="row[header.key]?.content" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td colspan="100%">
              <footer>
                <p>
                  Showing {{ paginator.startIndex.value }} to {{ paginator.endIndex.value }} of {{ paginator.totalItems.value }} entries |
                  <span>
                    <span>Rows per page</span>
                    <!-- eslint-disable-next-line vue/no-parsing-error -->
                    <select @change="(e: Event) => paginator.setMaxPerPage(parseInt((<HTMLSelectElement>e.target)?.value) || 10)">
                      <option value="10">10</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="250">250</option>
                    </select>
                  </span>
                </p>
                <div class="pagination">
                  <button type="button" :disabled="!paginator.hasPrevious()" @click="paginator.previous()">&lt;</button>
                  <button :class="{ active: paginator.currentPage.value === 1 }" @click="paginator.setPage(1)">1</button>
                  <span v-if="shouldShowEllipsisBefore" class="ellipsis">...</span>
                  <button v-for="page in visiblePages" :key="page" :class="{ active: paginator.currentPage.value === page }" @click="paginator.setPage(page)">
                    {{ page }}
                  </button>
                  <span v-if="shouldShowEllipsisAfter" class="ellipsis">...</span>
                  <button
                    v-if="paginator.totalPages.value > 1"
                    :class="{ active: paginator.currentPage.value === paginator.totalPages.value }"
                    @click="paginator.setPage(paginator.totalPages.value)"
                  >
                    {{ paginator.totalPages.value }}
                  </button>
                  <button type="button" :disabled="!paginator.hasNext()" @click="paginator.next()">&gt;</button>
                </div>
              </footer>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Paginator } from '../helpers/paginator';

const props = defineProps<{ headers: Header[]; rows: Field[] }>();
const itemsPerPage = ref(usePreferences().get('datatableItemsCount').value || 10);
const searchInput = ref('');

// Pagination + filter
const paginator = new Paginator<Field>(
  computed(() => props.rows),
  itemsPerPage.value,
);
paginator.filter(row => {
  return Object.values(row).some(value => value.content?.toLowerCase().includes(searchInput.value.toLowerCase()));
});
const data = paginator.currentPageItems;

// Gestion de la sélection
const selectedRows = ref<Field[]>([]);

const toggleSelectAll = () => {
  if (selectedRows.value.length) selectedRows.value = [];
  else selectedRows.value = [...data.value];
};

// Pagination (visible pages logic)
const maxVisiblePages = 3;
const visiblePages = computed(() => {
  const totalPages = paginator.totalPages.value;
  const currentPage = paginator.currentPage.value;
  const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2));
  const pages = Int16Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  return pages;
});

const shouldShowEllipsisAfter = computed(() => {
  const lastVisiblePage = visiblePages.value[visiblePages.value.length - 1];
  return lastVisiblePage !== undefined && lastVisiblePage < paginator.totalPages.value - 1;
});
const shouldShowEllipsisBefore = computed(() => {
  const firstVisiblePage = visiblePages.value[0];
  return firstVisiblePage !== undefined && firstVisiblePage > 2;
});

// Types
interface Header {
  key: string;
  label: string;
}
export interface Field<V = unknown> {
  [key: string]: {
    content?: string;
    type: 'html' | 'text' | 'slot' | undefined;
    data?: V;
  };
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border: 1.5px solid var(--border-color);
  border-radius: $radius-md;
}

header {
  display: flex;
  padding: 0 10px;
  align-items: center;
}

.wrapper {
  width: 100%;
  border-top: 1px solid var(--border-color);
  overflow-x: auto;
}

table {
  display: table;
  width: 100%;
  border-color: inherit;
  border-collapse: collapse;
  table-layout: auto;
}

th,
td {
  padding: 10px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  font-size: 13px;
  color: var(--font-color-dark);
  background: var(--bg-ui);
  text-transform: uppercase;
}

td {
  color: var(--font-color-light);

  > span {
    display: flex;
    align-items: center;
  }

  &:has(footer) {
    border-radius: 0 0 $radius-md $radius-md;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: $radius-sm;
  font-size: 1rem;

  &:hover {
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    color: white;
    background-color: var(--primary);
  }
}

footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

select {
  max-width: 100px;
  margin: 0 0 0 10px;
  padding: 4px 8px;
}

input {
  max-width: 300px;
  margin: 8px 5px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.ellipsis {
  margin: 0 5px;
  color: var(--font-color-dark);
}

@media screen and (width <= 768px) {
  table {
    table-layout: fixed;
  }

  th,
  td {
    width: 100%;
  }
}
</style>
