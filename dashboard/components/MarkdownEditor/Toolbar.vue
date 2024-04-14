<template>
	<div class="toolbar flex-container">
		<span v-for="item in toolbar" :key="item.name" v-html="item.icon" class="btn"
			@click="emitAction(item.action)"></span>
		<input placeholder="#tags" class="tags input" v-model="copy.tags" style="margin-right:5px;" />
		<select v-model="copy.accessibility" style="margin-right:5px;">
			<option value="1">Visible</option>
			<option value="2">Draf</option>
			<option value="3">Archive</option>
		</select>
		<select v-model="copy.category" style="margin-right:5px;">
			<optgroup v-for="cat in categoriesStore.getParents" :label="cat.name" :key="cat.id">
				<option v-for="subCat in categoriesStore.getChilds(cat.id)" :value="subCat.id" :key="subCat.id"
					v-text="subCat.name">
				</option>
			</optgroup>
		</select>
		<select v-model="copy.parent_id">
			<option selected :value="null"> No parent </option>
			<option v-for="doc in documentsStore.getByCategories(copy.category || '')" :value="doc.id" :key="doc.id"
				v-text="doc.name">
			</option>
		</select>
	</div>
</template>

<script setup lang="ts">
import { useCategoriesStore, useDocumentsStore, type Document, type Category } from "~/store";

const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();

const props = defineProps<{ document: Partial<Document> }>();
const copy = ref(props.document);
const e = defineEmits(['execute-action']);
const emitAction = (action: string) => e('execute-action', action, copy);

const toolbar = [
	{
		name: 'Bold',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>',
		action: 'bold',
	},
	{
		name: 'Italic',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>',
		action: 'italic',
	},
	{
		name: 'Underline',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>',
		action: 'underline',
	},
	{
		name: 'Strike',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M486-160q-76 0-135-45t-85-123l88-38q14 48 48.5 79t85.5 31q42 0 76-20t34-64q0-18-7-33t-19-27h112q5 14 7.5 28.5T694-340q0 86-61.5 133T486-160ZM80-480v-80h800v80H80Zm402-326q66 0 115.5 32.5T674-674l-88 39q-9-29-33.5-52T484-710q-41 0-68 18.5T386-640h-96q2-69 54.5-117.5T482-806Z"/></svg>',
		action: 'strike',
	},
	{
		name: 'Link',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>',
		action: 'link',
	},
	{
		name: 'Image',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>',
		action: 'image',
	},
	{
		name: 'Code',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>',
		action: 'code',
	},
	{
		name: 'Quote',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m228-240 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T458-480L320-240h-92Zm360 0 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T818-480L680-240h-92ZM320-500q25 0 42.5-17.5T380-560q0-25-17.5-42.5T320-620q-25 0-42.5 17.5T260-560q0 25 17.5 42.5T320-500Zm360 0q25 0 42.5-17.5T740-560q0-25-17.5-42.5T680-620q-25 0-42.5 17.5T620-560q0 25 17.5 42.5T680-500Zm0-60Zm-360 0Z"/></svg>',
		action: 'quote',
	},
	{
		name: 'List',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/></svg>',
		action: 'list',
	},
	{
		name: 'Ordered List',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M680-80v-60h100v-30h-60v-60h60v-30H680v-60h120q17 0 28.5 11.5T840-280v40q0 17-11.5 28.5T800-200q17 0 28.5 11.5T840-160v40q0 17-11.5 28.5T800-80H680Zm0-280v-110q0-17 11.5-28.5T720-510h60v-30H680v-60h120q17 0 28.5 11.5T840-560v70q0 17-11.5 28.5T800-450h-60v30h100v60H680Zm60-280v-180h-60v-60h120v240h-60ZM120-200v-80h480v80H120Zm0-240v-80h480v80H120Zm0-240v-80h480v80H120Z"/></svg>',
		action: 'orderedList',
	},
	{
		name: 'Exit',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z"/></svg>',
		action: 'exit',
	},
	{
		name: 'Preview',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z"/></svg>',
		action: 'preview',
	},
	{
		name: 'Save',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>',
		action: 'save',
	},
];
</script>

<style scoped lang="scss">
.toolbar {
	margin-bottom: 10px;
	user-select: none;
	display: flex;

	.btn {
		margin-right: 5px;
		opacity: 0.8;
		cursor: pointer;

		&:deep(svg) {
			fill: var(--font-color);
		}

		&:hover {
			opacity: 1;

			&:deep(svg) {
				fill: $primary-400;
			}
		}
	}

	input {
		display: none;
	}

	input,
	select {
		display: inline-block;
		width: min-content;
		padding: 0;
	}
}
</style>