<template>
	<Collapse v-if="item.childrens.length">
		<template v-slot:header>
			<SidebarItem :item="item" />
		</template>
		<template v-slot:body>
			<template v-for="(child, index) in item.childrens">
				<div style="margin-left:25px;">
					<CollapseItem v-if="child.childrens?.length" :item="child" :key="index" />
					<SidebarItem v-else :item="child" />
				</div>
			</template>
		</template>
	</Collapse>
	<SidebarItem v-else :item="item" />
</template>
<script setup lang="ts">
import { type Item } from './helpers';
import Collapse from './Collapse.vue';
import SidebarItem from './SidebarItem.vue';

defineProps<{ item: Item }>();
</script>
