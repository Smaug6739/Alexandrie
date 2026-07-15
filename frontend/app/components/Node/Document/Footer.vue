<template>
  <footer v-if="document">
    <div v-if="showAttachments" class="attachments">
      <div v-for="attachment in attachments" :key="attachment.id" class="attachment">
        <NodeResourceInline :node="attachment" />
      </div>
    </div>
    <div class="footer-top-row">
      <NuxtLink :to="`/dashboard/docs/edit/${document.id}`" class="edit-link">
        <Icon name="edit_page" display="sm" />
        <span>{{ t('nodes.document.editPage') }}</span>
      </NuxtLink>
      <div class="last-updated">
        <Icon name="update" />
        {{ t('nodes.document.lastUpdated') }} {{ formatRelativeDate(document.updated_timestamp) }}
      </div>
    </div>
    <div class="items">
      <NuxtLink v-if="previous" :to="`/dashboard/docs/${previous.id}`" class="item left">
        <b>{{ t('nodes.document.prevPage') }}</b>
        {{ previous.name }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="`/dashboard/docs/${next.id}`" class="item right">
        <b>{{ t('nodes.document.nextPage') }}</b>
        {{ next.name }}
      </NuxtLink>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';

const props = defineProps<{ document?: Node; next?: Node; previous?: Node }>();

const preferences = usePreferencesStore();
const nodeStore = useNodesStore();

const { t } = useI18nT();
const { formatRelativeDate } = useDateFormatters();

const showAttachments = preferences.get('documentShowAttachments');
const attachments = computed(() => {
  return nodeStore.nodes
    .getChildrenIds(props.document?.id)
    .map(id => nodeStore.getById(id))
    .filter(n => n?.role === 4) as Node[];
});
</script>

<style scoped lang="scss">
footer {
  margin: 50px 0 40px;
}

.attachments {
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;

  .attachment {
    margin: 5px 0;
  }
}

.edit-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  background: var(--surface-transparent);
  transition:
    color $transition-base ease,
    background-color $transition-base ease;

  &:hover {
    color: var(--primary);
    background: var(--primary-bg);
  }
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

.item {
  display: block;
  flex: 1;
  width: 100%;
  min-width: 280px;
  max-width: 400px;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 450;
  transition: color 0.25s;

  &:hover {
    border: 1px solid var(--primary);
    color: var(--primary);
  }

  b {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
  }
}

.right {
  margin-left: auto;
  text-align: right;
}

.left {
  margin-right: auto;
  text-align: left;
}

.footer-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-weight: 450;
}
</style>
