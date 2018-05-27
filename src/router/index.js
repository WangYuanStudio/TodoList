import Vue from 'vue'
import Router from 'vue-router'
import personal from '@/components/personal'
import team from '@/components/team'
import heart from '@/components/heart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/personal'
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    },
    {
      path: '/team',
      name: 'team',
      component: team
    },
    {
      path: '/heart',
      name: 'heart',
      component: heart
    }
  ]
})
