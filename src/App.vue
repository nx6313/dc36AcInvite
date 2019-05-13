<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
    <span v-if="isShowServiceTypeTool" class="currentServiceType" v-drag:config="{ about: ['top', 'right'], overstep: false, inertia: true, recover: true, tap: showLogVc }">
      <span class="tip">当前服务器</span>
      <span class="content">
        <Marquee :lists="[currentServiceType]"></Marquee>
      </span>
    </span>
  </div>
</template>

<script>
import { BASE_URL, APP_CONFIG } from '@/utils/constants'
import Marquee from '@/components/Marquee.vue'

export default {
  provide() {
    return {
      reload: this.reload,
      savePageData: this.savePageData,
      getPageData: this.getPageData,
      clearPageData: this.clearPageData
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    isShowServiceTypeTool() {
      return APP_CONFIG.isTest || process.env.NODE_ENV != 'production' || this.$SHOW_TEST_TOOL
    },
    currentServiceType() {
      return this.$BASE_HOST
    }
  },
  components: {
    Marquee
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    savePageData() {
      this.$store.commit('setPageData', {
        data: this.$children[this.$children.length - 1].$data
      })
    },
    getPageData() {
      return this.$store.state.pageData.data
    },
    clearPageData() {
      this.$store.dispatch('clearPageData')
    },
    showLogVc() {
      this.$vconsole.show()
    }
  }
}
</script>


<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  min-height: 100vh;
  textarea {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
  .currentServiceType {
    position: fixed;
    top: 0.5rem;
    right: 0.8rem;
    z-index: 999;
    background-color: #2c3e50;
    color: #e8e8e8;
    font-size: 0.6rem;
    padding: 0.2rem 0.8rem;
    border-radius: 10rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
    .tip {
      display: inline-block;
      padding-right: 0.4rem;
      vertical-align: middle;
      text-shadow: 0 0 10px #c0a1a1;
    }
    .content {
      display: inline-block;
      max-width: 5rem;
      vertical-align: middle;
      color: #a3a3a3;
    }
  }
}

body, html {
  padding: 0;
  margin: 0;
  -webkit-overflow-scrolling: touch;
}

div.react-confirm-alert-overlay {
  background: rgba(61, 61, 61, 0.4) !important;
  div.react-confirm-alert-body {
    width: 80vw !important;
    padding: 10px !important;
    border-radius: 4px !important;
    font-size: 0.6rem;
    h1 {
      font-size: 0.8rem;
    }
  }
}

input {
  outline: none;
  user-select: normal !important;
  -webkit-appearance: none !important;
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar-thumb {
  border: none;
}

div#__vconsole {
  user-select: none;
  div#__vc_log_default {
    div.vc-log {
      padding-bottom: 0 !important;
    }
  }
}

.wheelpicker {
  .wheelpicker-panel {
    .wheelpicker-actions {
      border-bottom: none;
      button {
        outline: none;
      }
    }
    .wheelpicker-main {
      .wheelpicker-mask-current {
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }
}

.vld-overlay.is-full-page {
  z-index: 9999999 !important;
}

input[type="range"] {
  -webkit-appearance: none;
  margin-top: 42px;
  background-color: #ebeff4;
  -webkit-appearance: none;
  height:4px;
  padding: 0;
  border: none !important;
  padding: 0 !important;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  cursor: default;
  top: 0;
  height: 20px;
  width: 20px;
  transform: translateY(0px);
  background: #ffffff;
  border-radius: 15px;
  border: 5px solid #0098b3;
  box-shadow: 0 -1px 5px #fc7701 inset;
  -webkit-box-shadow: 0 -1px 5px #fc7701 inset;
}
</style>
