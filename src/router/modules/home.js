import Dashboard from '@/dashboard.vue'

export default [
  {
    path: '/home',
    icons: 'icon-indexs',
    icon: 'icon-index',
    name: 'home',
    title: '首页',
    menu: true,
    component: Dashboard,
    pid: 'home',
    children: [
      {
        path: 'index',
        title: '首页',
        menu: true,
        name: 'home-index',
        meta: { id: 'home-index' },
        component: (resolve) => {
          require(['@/views/home/index.vue'], resolve)
        },
      },
    ],
  },
]
