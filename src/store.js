import Vue from 'vue'
import Vuex from 'vuex'
import { SOME_MUTATION } from '@/utils/mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions: {
    // eslint-disable-next-line
    clearAll({ commit, state }) {
      for (let mudule in state) {
        if (Object.prototype.toString.call(state[mudule]) == '[object Object]') {
          for (let key in state[mudule]) {
            if (Object.prototype.toString.call(state[mudule][key]) == '[object Object]') {
              for (let nextKey in state[mudule][key]) {
                state[mudule][key][nextKey] = null
              }
            } else {
              state[mudule][key] = null
            }
          }
        } else {
          state[mudule] = null
        }
      }
    }
  },
  modules: {
    // 用户auth登陆认证信息
    auth: {
      state: {
        secret: null,
        token: null,
        byLogin: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateAuth] (state, payload) {
          state.secret = payload.secret
          state.token = payload.token
        },
        [SOME_MUTATION.updateAuthLoginType] (state, payload) {
          state.byLogin = payload
        }
      },
      actions: {}
    },
    userBaseInfo: {
      state: {
        info: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateUserBaseInfoInfo] (state, payload) {
          state.info = payload.info
        }
      },
      actions: {
        // eslint-disable-next-line
        clearUserBaseInfo({ commit, state }) {
          state.info = null
        }
      }
    },
    // 页面缓存数据
    pageData: {
      state: {
        data: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.setPageData] (state, payload) {
          state.data = payload.data
        }
      },
      actions: {
        // eslint-disable-next-line
        clearPageData({ commit, state }) {
          state.data = null
        }
      }
    }
  }
})

export default store
