// import {
//   path
// } from 'chromedriver'
import Vue from 'vue'
import Router from 'vue-router'
const layout = () => import('@/components/layout')
// 登录页
const reload = () => import('@/components/reLoad')

const main = () => import('@/views/index')
const warningCenter = () => import('@/views/warningCenter')
const data = () => import('@/views/data')
const AdGroup=()=>import('@/views/adGroup')
const Campaign=()=>import('@/views/campaign')
Vue.use(Router)
// 固定的路由表
export const fixedRouter = [{
    path: '',
    component: reload,
    hidden: true
  },
  
  {
    path: '',
    component: layout, //整体页面的布局(包含左侧菜单跟主内容区域)
    children: [{
      path: 'main',
      component: main,
      meta: {
        title: '数据看板', //菜单名称
        roles: ['user', 'admin'], //当前菜单哪些角色可以看到
        icon: 'icon-brokenLine' //菜单左侧的icon图标
      }
    }]
  },
  {
    path: '',
    component: layout,
    children: [{
      path: 'warningCenter',
      component: warningCenter,
      meta: {
        title: '预警中心',
        icon: 'icon-warning',
        roles: ['user', 'admin'],
      }
    }]
  },
  
  {
    path: '',
    component: layout,
    children: [{
      path: 'lanuch',
      component: data,
      meta: {
        title: '投放中心',
        icon: 'icon-launch',
        roles: ['user', 'admin'],
      }
    }]
  },
  {
    path: '',
    component: layout,
    children: [{
      path: 'ranking',
      component: data,
      meta: {
        title: '关键词排名',
        icon: 'icon-ranking',
        roles: ['user', 'admin'],
      }
    }]
  },
  {
    path: '',
    component: layout,
    children: [{
      path: 'budget',
      component: data,
      meta: {
        title: '预算追踪',
        icon: 'icon-budget',
        roles: ['user', 'admin'],
      }
    }]
  },
  {
    path: '',
    component: layout,
    children: [{
      path: 'adManage',
      component: data,
      meta: {
        title: '广告管理',
        icon: 'icon-ad',
        roles: ['user', 'admin'],
      }
    }]
  },
  {
    path: '',
    component: layout,
    children: [{
      path: 'user',
      component: data,
      meta: {
        title: '权限管理',
        icon: 'icon-user',
        roles: ['user', 'admin'],
      }
    }]
  },
  {
    path: '',
    component: layout, //整体页面的布局(包含左侧菜单跟主内容区域)
    children: [{
      path: 'adGroup',
      component: AdGroup,
      meta: {
        title: 'adGroup', //菜单名称
        roles: ['user', 'admin'], //当前菜单哪些角色可以看到
        icon: 'el-icon-info' //菜单左侧的icon图标
      }
    }],
    hidden: true
  },
  {
    path: '',
    component: layout, //整体页面的布局(包含左侧菜单跟主内容区域)
    children: [{
      path: 'campaign',
      component: Campaign,
      meta: {
        title: 'campaign', //菜单名称
        roles: ['user', 'admin'], //当前菜单哪些角色可以看到
        icon: 'el-icon-info' //菜单左侧的icon图标
      }
    }],
    hidden: true
  },
]
// 需要权限判断展示的路由
export const permissionRouter = [

]

export default new Router({
  mode: 'hash',
  routes: fixedRouter

})
