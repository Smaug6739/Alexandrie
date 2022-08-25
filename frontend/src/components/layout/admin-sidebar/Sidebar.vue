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
									<router-link :to="menuItem.link" class="a-block-style">
										<i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
										<span class="links_name">{{ menuItem.name }}</span>
									</router-link>
								</span>
								<span class="tooltip">{{ menuItem.name }}</span>
								<ul v-if="isOpened">
								</ul>
							</li>
						</span>
					</ul>
				</div>
			</div>
		</div>
	</aside>
</template>
<script lang="ts" src="./admin-sidebar.ts"></script>
<style lang="scss" scoped>
@import "./admin-sidebar.scss";
</style>
