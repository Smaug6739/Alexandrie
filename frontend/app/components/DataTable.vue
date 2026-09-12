<template>
  <div class="table">
    <header>
      <input v-model="searchInput" type="text" :placeholder="t('components.dataTable.searchPlaceholder')" />
      <slot v-if="selectedRows.length > 0" name="bulk-actions" :selected="selectedRows"> </slot>
    </header>

    <div class="wrapper">
      <table>
        <thead>
          <tr>
            <th class="selection-heading">
              <input type="checkbox" aria-label="Select all rows on this page" style="width: 20px" :checked="selectedRows.length === data.length && data.length > 0" @change="toggleSelectAll" />
            </th>
            <th v-for="header in headers" :key="header.key" scope="col" :class="header.align && `align-${header.align}`">
              <span>{{ header.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index" class="data-row">
            <td>
              <input v-model="selectedRows" type="checkbox" :aria-label="`Select row ${paginator.startIndex.value + index}`" :value="row" style="width: 20px" />
            </td>
            <td v-for="header in headers" :key="header.key" :class="header.align && `align-${header.align}`">
              <span class="cell-label" aria-hidden="true">{{ header.label }}</span>
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
            <td :colspan="headers.length + 1" class="footer-cell">
              <footer>
                <p class="page-summary">
                  {{
                    t('components.dataTable.showing', { start: paginator.startIndex.value, end: paginator.endIndex.value, total: paginator.totalItems.value })
                  }}
                  <span class="summary-divider">|</span>
                  <label class="page-size">
                    <span>{{ t('components.dataTable.rowsPerPage') }}</span>
                    <!-- eslint-disable-next-line vue/no-parsing-error -->
                    <select :value="itemsPerPage" @change="(e: Event) => paginator.setMaxPerPage(parseInt((<HTMLSelectElement>e.target)?.value) || 10)">
                      <option value="10">10</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="250">250</option>
                    </select>
                  </label>
                </p>
                <div class="pagination" role="navigation" aria-label="Pagination">
                  <button type="button" aria-label="Previous page" :disabled="!paginator.hasPrevious()" @click="paginator.previous()">&lt;</button>
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
                  <button type="button" aria-label="Next page" :disabled="!paginator.hasNext()" @click="paginator.next()">&gt;</button>
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

const { t } = useI18nT();
const props = defineProps<{ headers: Header[]; rows: Field[] }>();
const itemsPerPage = usePreferencesStore().get('datatableItemsCount');
const searchInput = ref('');

// Pagination + filter
const paginator = new Paginator<Field>(
  computed(() => props.rows),
  itemsPerPage.value || 10,
);
paginator.filter(row => {
  return Object.values(row).some(value => value.content?.toLowerCase().includes(searchInput.value.toLowerCase()));
});
const data = paginator.currentPageItems;

const selectedRows = ref<Field[]>([]);

const toggleSelectAll = () => {
  if (selectedRows.value.length) selectedRows.value = [];
  else selectedRows.value = [...data.value];
};

// Parents can read the selection (e.g. to wire a Delete-key bulk action).
defineExpose({ selectedRows });

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
  align?: 'left' | 'center' | 'right' | 'space-around' | 'space-between';
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
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
}

header {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.wrapper {
  width: 100%;
  border-top: 1px solid var(--border);
  overflow-x: auto;
}

table {
  display: table;
  min-width: 100%;
  margin: 0;
  border-color: inherit;
  border-radius: 0;
  border-collapse: collapse;
  table-layout: auto;
}

th,
td {
  > span {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }

  &.align-right > span {
    justify-content: flex-end;
  }

  &.align-center > span {
    justify-content: center;
  }

  &.align-space-around > span {
    justify-content: space-around;
  }

  &.align-space-between > span {
    justify-content: space-between;
  }
}

/* --- ADAPTATIONS SPÉCIFIQUES --- */
th {
  font-size: 13px;
  color: var(--text-primary);
  text-align: left;
  text-transform: uppercase;
  background: var(--surface-transparent);

  &.align-right {
    padding-right: 30px;
  }
}

td {
  color: var(--text-secondary);
  text-align: left; /* Reset */

  &.align-right {
    padding-right: 10px;
  }

  &:has(footer) {
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
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
  justify-content: space-between;
  width: 100%;
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
  border: 1px solid var(--border);
  border-radius: 5px;
}

.ellipsis {
  margin: 0 5px;
  color: var(--text-primary);
}

td > .cell-label {
  display: none;
}

.page-size {
  display: inline;
  margin: 0;
  font: inherit;
  color: inherit;
}

@media screen and (width <= 768px) {
  .table,
  .wrapper {
    min-width: 0;
    max-width: 100%;
  }

  header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding-bottom: 8px;
  }

  input[type='text'] {
    width: 100%;
    max-width: 100%;
    margin: 8px 0 0;
  }

  input[type='checkbox'] {
    flex-shrink: 0;
    min-height: 24px;
  }

  .wrapper {
    overflow: visible;
  }

  table,
  thead,
  tbody,
  tr,
  td,
  th.selection-heading {
    display: block;
    width: 100%;
    min-width: 0;
  }

  table {
    overflow: visible;
  }

  thead th:not(.selection-heading) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    border: 0;
    clip-path: inset(50%);
    overflow: hidden;
  }

  th.selection-heading {
    padding: 4px 12px;
  }

  .data-row {
  margin: 8px;
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.data-row > td {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 6px 0;
  border: 0;

  &:first-child {
    display: block;
    padding-bottom: 8px;
  }

  &:not(:first-child)::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
  }

  > span {
    min-width: 0;
    width: 100%;
    overflow-wrap: anywhere;
  }
}

    > span {
      flex-wrap: wrap;
      min-width: 0;
      max-width: 100%;
      overflow-wrap: anywhere;
    }

    &.align-center > span {
  justify-content: flex-start;
}

    > .cell-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    :deep(tag) {
      min-width: 0;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }

  .footer-cell {
    padding: 12px;
  }

  footer {
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .page-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
  }

  .summary-divider {
    display: none;
  }

  .page-size {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  select {
    width: auto;
    min-height: 44px;
    margin: 0;
  }

  .pagination {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 4px;

    button {
      min-width: 44px;
      min-height: 44px;
      margin: 0;
    }
  }
}

</style>
