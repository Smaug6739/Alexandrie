<template>
	<div v-if="doc" class="container">
		<div class="header">
			<NuxtLink :to="'/dashboard/edit?doc=' + doc.id">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path
						d="m640-360 120-120-42-43-48 48v-125h-60v125l-48-48-42 43 120 120ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Zm60-120h60v-180h40v120h60v-120h40v180h60v-200q0-17-11.5-28.5T440-600H260q-17 0-28.5 11.5T220-560v200Z" />
				</svg>
			</NuxtLink>

			<NuxtLink :to="'/dashboard/edit?doc=' + doc.id">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path
						d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
				</svg>
			</NuxtLink>
			<NuxtLink @click="deleteDoc(doc.id)">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path
						d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
				</svg>
			</NuxtLink>
			<NuxtLink @click="print">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path
						d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
				</svg>
			</NuxtLink>
		</div>
		<div class="card" id="doc" v-html="doc.content_html"></div>
	</div>
</template>
<script setup lang="ts">
import { useDocumentsStore, type Document } from '~/store';
import { useRoute } from "vue-router";

const route = useRoute();
const doc_id = computed(() => route.query.doc as string);
const doc = ref<Document>();
const documentsStore = useDocumentsStore();

watchEffect(async () => {
	const docFromStore = documentsStore.getById(doc_id.value);
	if (docFromStore?.partial) {
		try {
			doc.value = await documentsStore.fetch({ id: doc_id.value as string });
		} catch (error) {
			console.error("Error fetching document:", error);
		}
	} else doc.value = docFromStore;
});

const print = () => window.print();
const deleteDoc = (id: string) => documentsStore.delete(id);

</script>

<style lang="scss" scoped>
.container {
	max-height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
}

.card {
	padding: 0 2rem;
}

.header {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin: 1rem 2rem;

	svg {
		cursor: pointer;
		fill: $primary-400;
		margin-left: 15px;
	}
}
</style>