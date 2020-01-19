import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Index'),
    children: [{
      path: '/',
      redirect: '/home'
  }, 
  {
      path: '/home',
      component: () => import('../views/Home'),
      meta: { keepAlive: true }
  },
  {
    path: '/homeProgress',
    component: () => import('../views/HomeProgress')
  }, 
  {
    path: '/allProject',
    component: () => import('../views/AllProject')
  },
  {
    path: '/nowProject',
    component: () => import('../views/NowProject')
  },
  {
    path: '/createProject',
    component: () => import('../views/CreateProject')
  },
  {
    path: '/todayPlan',
    component: () => import('../views/TodayPlan')
  },
  {
    path: '/createTast',
    component: () => import('../views/CreateTast')
  },
  {
    path: '/distributionTast',
    component: () => import('../views/DistributionTast')
  },
  {
    path: '/cycleProgress',
    component: () => import('../views/CycleProgress')
  },
  {
    path: '/timeProgress',
    component: () => import('../views/TimeProgress')
  },
  {
    path: '/establish',
    component: () => import('../views/Establish')
  },
  {
    path:'/entryDaily',
    component:() => import('../views/EntryDaily.vue')
  },]
    },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/regist',
    component: () => import(/* webpackChunkName: "about" */ '../views/Regist.vue')
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   // redirect: '/home',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  // },
]



const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
