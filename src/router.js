import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Index from './views/Index.vue'

Vue.use(Router)
Vue.use(store)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        pageBg: '#ffffff'
      }
    },
    {
      path: '/apply',
      name: 'apply',
      component: () => import('./views/Apply.vue'),
      meta: {
        pageBg: '#9B0009'
      }
    },
    {
      path: '/apply-list',
      name: 'apply-list',
      component: () => import('./views/MyApplyList.vue'),
      meta: {
        pageBg: '#ffffff'
      }
    },
    {
      path: '/generate',
      name: 'generate-ma',
      component: () => import('./views/GenerateMas.vue'),
      meta: {
        pageBg: '#ffffff'
      }
    }
    // {
    //   path: '/fullTimeHome',
    //   name: 'fullTimeHome',
    //   component: () => import('./views/FullTimeHome.vue'),
    //   beforeEnter: (to, from, next) => {
    //     refForVuexData()
    //     if (store.state.userBaseInfo.phone == null) {
    //       next('/')
    //     } else {
    //       next()
    //     }
    //   },
    //   meta: {
    //     title: '自营专职加盟',
    //     isFullPage: true,
    //     pageBg: {
    //       backgroundColor: '#303030',
    //       backgroundImage: `url(${require('@/assets/black_point_bg.png')})`
    //     }
    //   }
    // }
  ]
})
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})
router.beforeResolve((to, from, next) => {
  if (to.meta.keepAliveName) {
    if (from.name == to.meta.keepAliveName) {
      to.meta.keepData = true
    } else {
      to.meta.keepData = false
    }
  }
  refForVuexData()
  document.body.parentNode.style['backgroundImage'] = ''
  document.body.parentNode.style['backgroundRepeat'] = ''
  document.body.parentNode.style['backgroundSize'] = ''
  document.body.parentNode.style['backgroundPosition'] = ''
  if (to.meta.pageBg) {
    if (router.app.$vctool.isObject(to.meta.pageBg)) {
      for (let styleKey in to.meta.pageBg) {
        document.body.parentNode.style[styleKey] = to.meta.pageBg[styleKey]
      }
    } else {
      document.body.parentNode.style.backgroundColor = to.meta.pageBg
    }
  } else {
    document.body.parentNode.style.backgroundColor = '#F5F5F5'
  }
  if (to.meta.isFullPage === true) {
    document.body.parentNode.style.overflow = 'hidden'
  } else {
    document.body.parentNode.style.overflow = 'auto'
  }
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = document.querySelector('meta[name="web-describe"]').getAttribute('content')
  }
  next()
})

let refForVuexData = function() {
  router.app.$store.replaceState(Object.assign({}, router.app.$store.state, JSON.parse(sessionStorage.getItem('store'))))
  sessionStorage.clear()
}

export default {
  router: router,
  store: store
}
