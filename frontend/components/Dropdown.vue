<template>
	<div class="menu-item-parent" @mouseenter="isOpen = true" @mouseleave="isOpen = false">

		<div>
			<NuxtLink style="font-weight: 600;cursor:pointer;" class="a-classic title">{{ title }}<svg
					xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 24 24"
					class="vt-flyout-button-text-icon">
					<path
						d="M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z">
					</path>
				</svg></NuxtLink>

			<Transition>
				<div class="sub-menu" v-if="isOpen" @click="isOpen = false">
					<slot />
				</div>
			</Transition>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Menu',
	data() {
		return {
			isOpen: false,
		};
	},
	props: {
		title: {
			type: String,
			required: true,
		},
	},
};
</script>
<style scoped lang="scss">
.menu-item-parent {
	position: relative;
}

svg {
	width: 20px;
	margin-left: 3px;
	fill: var(--font-color) !important;
	opacity: 0.8;
	transition: opacity .25s;

	&:hover {
		opacity: 1;
		fill: var(--font-color);
	}
}

.title {
	display: flex;
	align-items: center;
}

.sub-menu {
	position: absolute;
	z-index: 1;
	display: block;
	width: max-content;
	padding: 8px;
	border-radius: 16px 16px 16px 16px;
	border: 1px solid var(--border-color);
	opacity: 1;
	background: var(--bg-color);
}

ul {
	list-style: none;
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.sub-menu {
	cursor: pointer;
}
</style>
