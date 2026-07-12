<template>
  <div v-if="parsedTags.length" class="tags">
    <tag v-for="tag in parsedTags" :key="tag" class="primary" :class="{ clickable }" @click="onClick($event, tag)">{{ tag }}</tag>
  </div>
</template>

<script setup lang="ts">
import { parseTags } from '~/helpers/node';

const props = withDefaults(defineProps<{ tags?: string; clickable?: boolean }>(), { tags: '', clickable: true });

const router = useRouter();

const parsedTags = computed(() => parseTags(props.tags));

function onClick(event: MouseEvent, tag: string) {
  if (!props.clickable) return;
  event.preventDefault();
  event.stopPropagation();
  router.push({ path: '/dashboard/docs', query: { tags: tag } });
}
</script>

<style scoped lang="scss">
.tags {
  display: flex;
  flex-wrap: wrap;
}

.clickable {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
