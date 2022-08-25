<template>
	<div :class="color" style="display: inline-block;">
		<span style="display: inline-flex; align-items: baseline;" class="name">
			<svg style="align-self: center;" class="octicon octicon-info mr-2" viewBox="0 0 16 16" version="1.1" width="16"
				height="16" aria-hidden="true">
				<path fill-rule="evenodd"
					d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z">
				</path>
			</svg>
			{{ name }}
		</span>
		<slot></slot>
	</div>
</template>
<style scoped lang="scss">
svg {
	box-sizing: border-box;
	color: #58a6ff;
	color-scheme: dark;
	display: inline-block;
	fill: #58a6ff;
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
	color: #58a6ff;
	margin-right: 5px;
}

.red {
	svg {
		fill: #ff4d4d;
		color: #ff4d4d;
	}

	.name {
		color: #ff4d4d;
	}
}

.turquoise {
	svg {
		fill: #00b5ad;
		color: #00b5ad;
	}

	.name {
		color: #00b5ad;
	}
}
</style>

<script lang="ts">
export default {
	name: "Info",
	props: {
		name: {
			type: String,
			default: "Info",
		},
		color: {
			type: String,
			default: "",
		}
	}
};
</script>