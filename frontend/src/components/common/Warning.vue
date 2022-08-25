<template>
	<div :class="color" style="display: inline-block;">
		<span style="display: inline-flex; align-items: baseline;" class="name">
			<svg style="align-self: center;" class="octicon octicon-alert mr-2" viewBox="0 0 16 16" version="1.1" width="16"
				height="16" aria-hidden="true">
				<path fill-rule="evenodd"
					d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z">
				</path>
			</svg>
			{{ name }}
		</span>
		<slot></slot>
	</div>
</template>
<style scoped>
svg {
	box-sizing: border-box;
	color: #d29922;
	color-scheme: dark;
	display: inline-block;
	fill: #d29922;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	font-size: 16px;
	margin-right: 8px;
	overflow-wrap: break-word;
	overflow-x: visible;
	overflow-y: visible;
	vertical-align: text-bottom
}


.name {
	font-weight: 600;
	color: rgb(210, 153, 34);
	margin-right: 5px;
}
</style>

<script lang="ts">
export default {
	name: "Warning",
	props: {
		name: {
			type: String,
			default: "Warning",
		},
		color: {
			type: String,
			default: "",
		}
	}
};
</script>