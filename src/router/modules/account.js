export default [
  {
    path: '/',
    name: '/',
    redirect: {
      name: 'home',
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      noLogin: true,
    },
    component: (resolve) => {
      require(['@/views/account/login/index.vue'], resolve)
    },
  },
]
