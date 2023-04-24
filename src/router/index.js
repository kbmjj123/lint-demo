import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewUI from 'view-design'
import Cookies from '@/utils/cookie'
import Util from '@/utils/util'
import { routers } from './router'
Vue.use(VueRouter)
export const router = new VueRouter({
  routes: routers,
})
router.beforeEach((to, from, next) => {
  // ViewUI.LoadingBar.start();
  const token = Util.getUrlParam('token')
  if (token || null !== token) {
    Cookies.set('token', token)
  }
  if (!Cookies.get('token')) {
    // 当前未登录
    if (to.meta.noLogin) {
      // 目标页面无需登录
      next()
    } else {
      // 目标页面需要登录
      next({ name: 'login' })
    }
  } else {
    // 当前已登录
    const curRouterObj = Util.getRouterObjByName(to.name)
    if (curRouterObj) {
      Util.toDefaultPage(to, next)
    } else if (to.name !== 'error-404') {
      next({ replace: true, name: 'error-404' })
    } else {
      next()
    }
  }
})

router.afterEach((to) => {
  // ViewUI.LoadingBar.finish();
  window.scrollTo(0, 0)
})
