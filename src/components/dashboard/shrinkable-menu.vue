<template>
  <div :style="{ background: bgColor }" class="ivu-shrinkable-menu">
    <slot name="top"></slot>
    <Menu
      ref="sideMenu"
      :style="{
        maxHeight: menuMaxHeight,
        overflowX: 'hidden',
        overflowY: 'scroll',
      }"
      :active-name="routerName"
      :theme="theme"
      width="auto"
      @on-select="changeMenu"
    >
      <template v-for="item in menuList">
        <MenuItem
          v-if="item.menu"
          :key="'menuitem' + item.name"
          :name="item.name"
        >
          <span
            :class="[
              'icon',
              item.icon,
              routerName === item.name ? item.icons : '',
            ]"
            :style="{ fontSize: '16px' }"
          ></span>
          <span
            :key="'title' + item.name"
            class="layout-text"
            style="line-height: 1.5"
            >{{ item.title }}
          </span>
        </MenuItem>
      </template>
    </Menu>
  </div>
</template>
<script>
import util from '@/utils/util'

export default {
  name: 'ShrinkableMenu',
  props: {
    data: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
  data() {
    return {
      routerName: '',
      openNames: '',
      menuMaxHeight: '',
    }
  },
  computed: {
    bgColor() {
      return this.theme === 'dark' ? '#19212B' : '#fff'
    },
    shrinkIconColor() {
      return this.theme === 'dark' ? '#fff' : '#19212B'
    },
    menuItem() {
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].name === this.routerName.split('-')[0]) {
          return this.menuList[i]
        }
      }
      return {}
    },
    menuList() {
      // const access = +this.$cookies.get('userId');
      // const menus = [];
      // this.data.forEach(item => {
      //     if (item.accessList === undefined || (item.accessList && item.accessList.indexOf(access) !== -1)) {
      //         menus.push(item);
      //     }
      // });
      // return menus;
      return this.data
    },
  },
  watch: {
    $route(to) {
      this.activeMenuItem(to.name)
    },
    theme() {},
  },
  mounted() {
    this.activeMenuItem(this.$route.name)
    this.$nextTick(() => {
      let screenH =
        document.documentElement.clientHeight ||
        document.documentElement.clientHeight
      let menuNode = this.$refs && this.$refs['sideMenu']
      if (menuNode) {
        console.info(menuNode.$el.offsetTop)
        this.menuMaxHeight = `${screenH - menuNode.$el.offsetTop}px`
      }
    })
  },
  methods: {
    changeMenu(value) {
      if (
        value !== this.routerName ||
        (value === this.routerName && value === 'marketing')
      ) {
        this.$emit(
          'on-change',
          this.menuItem.children && this.menuItem.children.length > 1
            ? this.menuItem.children
            : [],
          this.menuItem
        )
        this.$router.push({
          name: value,
        })
      }
    },

    activeMenuItem(routerName) {
      const menuItem = util.getRouterObjByName(routerName)
      if (menuItem) {
        if (menuItem.getParent) {
          const firsetMenuItem = menuItem.getParent()
          this.routerName = firsetMenuItem.name
        } else {
          this.routerName = menuItem.name
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import './styles/menu.less';
</style>
