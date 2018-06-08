import Vue from 'vue'
import Router from 'vue-router'
import personal from '@/components/personal'
import team from '@/components/team'
import heart from '@/components/heart'
import alert from '@/components/alert'
import created from '@/components/created'
import join from '@/components/join'
import hearted from '@/components/hearted'

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
    },
    {
      path: '/created',
      name: 'created',
      component: created
    },
    {
      path: '/join',
      name: 'join',
      component: join
    },
    {
      path: '/hearted',
      name: 'hearted',
      component: hearted
    }
  ]
})
