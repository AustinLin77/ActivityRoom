import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import MyOrder from '@/components/MyOrder'
import OrderList from '@/components/OrderList'
import MyOrderDetails from '@/components/MyOrderDetails'
import MyRewrite from '@/components/MyRewrite'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: MyOrder,
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: OrderList
    },
    {
      path: '/myOrderDetails',
      name: 'myOrderDetails',
      component: MyOrderDetails
    },
    {
      path: '/myRewrite',
      name: 'myRewrite',
      component: MyRewrite
    },
  ]
})
