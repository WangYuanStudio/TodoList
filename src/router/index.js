import Vue from 'vue'
import Router from 'vue-router'
import personal from '@/components/personal'
import team from '@/components/team'
import heart from '@/components/heart'
import alert from '@/components/alert'

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
      component: personal,
      children:[
        {
          path:'alert',
          component:alert
        }
      ]
    },
    {
      path: '/team',
      name: 'team',
      component: team,
      children:[
        {
          path:'alert',
          component:alert
        }
      ]
    },
    {
      path: '/heart',
      name: 'heart',
      component: heart,
      children:[
        {
          path:'alert',
          component:alert
        }
      ]
    }
  ]
})
