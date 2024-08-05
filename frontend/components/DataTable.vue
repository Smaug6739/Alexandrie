<template>
  <div class="container">
    <div class="header">
      <input type="text" v-model="searchInput" placeholder="Search..." />
      <div>
        <span>Rows per page</span>
        <select @change="(e: Event) => paginator.setMaxPerPage(parseInt((<HTMLSelectElement>e.target)?.value) || 10)">
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.key">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data">
          <td v-for="header in headers">
            <span v-if="row[header.key]?.type === 'html'" v-html="row[header.key]?.content"></span>
            <NuxtLink v-else-if="row[header.key]?.type === 'link'" v-html="row[header.key]?.content" :to="row[header.key]?.to"></NuxtLink>
            <span v-else v-text="row[header.key]?.content"></span>
          </td>
        </tr>
        <tr>
          <td colspan="100%">
            <div class="footer">
              <p>Showing {{ paginator.startIndex.value }} to {{ paginator.endIndex.value }} of {{ paginator.totalItems.value }} entries</p>
              <div class="pagination">
                <button type="button" @click="paginator.previous()" :disabled="!paginator.hasPrevious()">&lt;</button>
                <button @click="paginator.setPage(1)" :class="{ active: paginator.currentPage.value === 1 }">1</button>
                <span v-if="shouldShowEllipsisBefore" class="ellipsis">...</span>
                <button v-for="page in visiblePages" :key="page" @click="paginator.setPage(page)" :class="{ active: paginator.currentPage.value === page }">{{ page }}</button>
                <span v-if="shouldShowEllipsisAfter" class="ellipsis">...</span>
                <button v-if="paginator.totalPages.value > 1" @click="paginator.setPage(paginator.totalPages.value)" :class="{ active: paginator.currentPage.value === paginator.totalPages.value }">{{ paginator.totalPages.value }}</button>
                <button type="button" @click="paginator.next()" :disabled="!paginator.hasNext()">&gt;</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { Paginator } from '../helpers/paginator';
const props = defineProps<{ headers: Header[]; rows: Field[] }>();
const itemsPerPage = ref(10);
const searchInput = ref('');

const paginator = new Paginator<Field>(
  computed(() => props.rows),
  itemsPerPage.value,
);
paginator.filter(row => {
  return Object.values(row).some(value => value.content.toLowerCase().includes(searchInput.value.toLowerCase()));
});
const data = paginator.currentPageItems;

const maxVisiblePages = 3; // Number of pages to show around the current page

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

interface Header {
  key: string;
  label: string;
}
interface Field {
  [key: string]: {
    content: string;
    type?: 'html' | 'text' | 'link';
    to?: string;
  };
}
</script>

<style lang="scss" scoped>
.container {
  border-radius: 15px;
  border: 1.5px solid var(--border-color);
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-color: inherit;
}

th,
td {
  padding: 10px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
td > span {
  display: flex;
  align-items: center;
}

th {
  color: var(--font-color-dark);
}

td {
  color: var(--font-color-light);

  &:has(.footer) {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
}

button {
  margin-right: 20px;
  padding: 0.1rem 0.25rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
  }

  &:hover,
  &.active {
    transform: none;
    font-weight: bold;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
}

.pagination .active {
  background-color: var(--active-color);
}

.footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

select {
  max-width: 100px;
  margin: 0;
  margin-left: 10px;
  padding: 0;
}

svg {
  position: absolute;
  top: 13px;
  left: 13px;
  fill: var(--grey);
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

@media screen and (min-width: 1000px) {
  .container {
    zoom: 1;
  }

  .noMobile {
    display: table-cell;
  }

  table {
    zoom: 1;
  }
}
</style>
