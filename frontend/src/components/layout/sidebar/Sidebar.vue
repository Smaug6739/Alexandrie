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

          <!--SUBJECTS-->
          <div class="mobile-only">
            <ul class="menu nav-list" style="overflow: visible">
              <li v-for="subject of categories" :key="subject.path" class="li-style">
                <span class="a-style">
                  <router-link :to="subject.path" class="a-block-style ">
                    <i class="bx" :class="'bx-square-rounded'" />
                    <span class="links_name">{{ subject.name }}</span>
                  </router-link>
                </span>
                <span class="tooltip">{{ subject.name }}</span>
              </li>
              <hr>
            </ul>
          </div>
          <!--END SUBJECTS-->


          <ul class="nav-list" style="overflow: visible">
            <li class="li-style" v-if="isSearch" @click="isOpened = true">
              <i class="bx bx-search" />
              <input type="text" :placeholder="searchPlaceholder" v-model="searchInput" />
              <span class="tooltip">{{ searchTooltip }}</span>
            </li>

            <span v-for="(menuItem, index) of menuItems2" :key="index">
              <li class="li-style">
                <span class="a-style"><a href="#" class="a-block-style">
                    <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
                    <span class="links_name">{{ menuItem.name }}</span>
                  </a></span>
                <span class="tooltip">{{ menuItem.name }}</span>
                <ul v-if="isOpened">
                  <span v-for="(children, index) of menuItem.childrens" :key="index">
                    <li class="children" @click="close">
                      <router-link :to="children.link" class="sub_link">{{
                          children.name
                      }}</router-link>
                    </li>
                  </span>
                </ul>
              </li>
            </span>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" src="./sidebar.ts"></script>
<style lang="scss" scoped>
@import "./sidebar.scss";
</style>
