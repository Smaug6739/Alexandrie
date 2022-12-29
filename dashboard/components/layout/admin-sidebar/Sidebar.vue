

<template>
	<aside>
		<div class="sidebar" :class="isOpened ? 'open' : ''">
			<div class="logo-details" style="margin: 6px 14px 0 14px">
				<img v-if="menuLogo" :src="menuLogo" alt="menu-logo" class="menu-logo icon" />
				<i v-else class="bx icon" :class="menuIcon" />
				<div class="logo_name">
					{{ menuTitle }}
				</div>
				<i class="bx" :class="isOpened ? 'bx-menu-alt-right' : 'bx-menu'" id="btn" @click="isOpened = !isOpened" />
			</div>

			<div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
          max-height: calc(100% - 60px);
        ">

				<div id="my-scroll" style="margin: 6px 14px 0 14px">


					<ul class="nav-list" style="overflow: visible">
						<li class="li-style" v-if="isSearch" @click="isOpened = true">
							<i class="bx bx-search" />
							<input type="text" :placeholder="searchPlaceholder" v-model="searchInput" />
							<span class="tooltip">{{ searchTooltip }}</span>
						</li>

						<span v-for="(menuItem, index) of menuItems" :key="index">
							<li class="li-style">
								<span class="a-style">
									<router-link :to="menuItem.link" class="a-block-style a-classic">
										<i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
										<span class="links_name">{{ menuItem.name }}</span>
									</router-link>
								</span>
								<span class="tooltip">{{ menuItem.name }}</span>
							</li>
						</span>
						<span>
							<li class="li-style">
								<span class="a-style">
									<a href="#" class="a-block-style" @click="logout">
										<i class="bx bx-power-off" />
										<span cass="links_name">Log out</span>
									</a>
								</span>
								<span class="tooltip">Log out</span>
							</li>
						</span>
					</ul>
				</div>
			</div>
		</div>
	</aside>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
	//! Menu settings

	menuTitle: {
		type: String,
		default: 'Docs',
	},
	menuLogo: {
		type: String,
		default: '',
	},
	menuIcon: {
		type: String,
		default: 'bxs-graduation',
	},
	isPaddingLeft: {
		type: Boolean,
		default: true,
	},
	menuOpenedPaddingLeftBody: {
		type: String,
		default: '280px',
	},
	menuClosedPaddingLeftBody: {
		type: String,
		default: '78px',
	},

	//! Search
	isSearch: {
		type: Boolean,
		default: true,
	},
	searchPlaceholder: {
		type: String,
		default: 'Search...',
	},
	searchTooltip: {
		type: String,
		default: 'Search',
	},

	menuItems: {
		type: Array<MenuItem>,
		default: (): MenuItem[] => [
			{
				link: '/admin',
				name: 'Dashboard',
				tooltip: 'Dashboard',
				icon: 'bx-home',
			},
			{
				link: '/admin/articles',
				name: 'Articles',
				tooltip: 'Articles',
				icon: 'bx-news',
			},
			{
				link: '/admin/categories',
				name: 'Categories',
				tooltip: 'Categories',
				icon: 'bx-category',
			},
			{
				link: '/admin/files',
				name: 'File Manager',
				tooltip: 'Files',
				icon: 'bx-folder',
			},
			{
				link: '/admin/sitemap',
				name: 'Sitemap',
				tooltip: 'Files',
				icon: 'bx-sitemap',
			},
		],
	},
});

const isOpened = ref(false);
const searchInput = ref('');

onMounted(() => {
	if (process.client) window.document.body.style.paddingLeft = '78px';
	if (process.client) window.innerWidth > 768 ? isOpened.value = true : isOpened.value = false;
});
onBeforeUnmount(() => {
	if (process.client) window.document.body.style.paddingLeft = '0';
});

watch(() => isOpened.value, () => {
	window.document.body.style.transition = 'all 0.3s ease';
	window.document.body.style.paddingLeft =
		isOpened.value && props.isPaddingLeft ? props.menuOpenedPaddingLeftBody : props.menuClosedPaddingLeftBody;
})



function logout() {
	fetch(`${import.meta.env.VITE_BASE_API}/api/v1/auth/disconnection`, {
		method: 'GET',
		credentials: 'include',
	}).then(() => {
		router.push('/');
	});
}

interface MenuItem {
	name: string;
	icon: string;
	link: string;
	tooltip: string;
}
</script>
<style lang="scss" scoped>
@import "./admin-sidebar.scss";
</style>
