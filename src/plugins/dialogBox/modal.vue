<template>
  <div v-if="isShow && show" id="dialog-modal-wrap" class="dialog-modal-wrap">
    <div class="modal-shade animated fadeIn" @click="() => { if (shadeClose || shadeHide) closeModal(true) }"></div>
    <div class="modal-content animated fadeIn" ref="modal-content" :style="{ top: `${top < 0 ? 0 : (top > 100 ? 100 : top)}vh` }">
      <!-- 头部 -->
      <div class="modal-block modal-header" v-if="showHead">
        <slot name="header">
          <div class="header-title-wrap">{{title}}</div>
        </slot>
      </div>
      <!-- 内容区域 -->
      <div class="modal-block modal-body" v-if="showBody">
        <slot name="body">
          <div class="body-wrap">{{content}}</div>
        </slot>
      </div>
      <!-- 尾部，操作按钮 -->
      <div class="modal-block modal-footer" v-if="showButton">
        <slot name="button">
          <div class="buttons-wrap">
            <span v-for="(button, buttonIndex) in buttons" :key="buttonIndex" :style="{ width: `calc(100% / ${buttons.length})` }" @click="button.callBack">{{button.txt}}</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-modal',
  props: {
    top: {
      default: 34
    },
    show: {
      default: true
    },
    showHead: {
      default: true
    },
    showBody: {
      default: true
    },
    showButton: {
      default: true
    },
    shadeHide: {
      default: false
    }
  },
  data () {
    return {
      isShow: true,
      shadeClose: true,
      title: 'Modal 标题',
      content: '',
      buttons: [
        {
          txt: '取消',
          callBack: () => {
            this.$emit('cancel')
            this.closeModal()
          }
        },
        {
          txt: '确定',
          callBack: () => {
            this.$emit('ok', this.closeModal)
          }
        }
      ]
    }
  },
  beforeMount () {
    let dialogMsg = document.querySelector('#dialog-modal-wrap')
    if (dialogMsg && dialogMsg.parentNode) {
      dialogMsg.parentNode.removeChild(dialogMsg)
    }
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
    },
    closeModal (isCancel) {
      if (isCancel) this.$emit('cancel')
      this.$refs['modal-content'].classList.remove('fadeIn')
      this.$refs['modal-content'].classList.add('fadeOut')
      setTimeout(() => {
        this.isShow = false
        document.body.removeEventListener("touchmove", this.preventDefault);
        document.body.style.overflow = "auto";
      }, 0.2 * 1000)
      this.$emit('close')
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.isShow = true
        document.body.addEventListener("touchmove", this.preventDefault, {
          passive: false
        });
        document.body.style.overflow = "hidden";
      } else {
        document.body.removeEventListener("touchmove", this.preventDefault);
        document.body.style.overflow = "auto";
      }
    }
  }
}
</script>

<style lang="less" scoped>
.modal-shade {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(44, 44, 44, 0.8);
  z-index: 99999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.modal-content {
  position: fixed;
  top: 30vh;
  left: 1.5rem;
  width: calc(100% - 3rem);
  text-align: center;
  font-size: 0.8rem;
  z-index: 99999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  user-select: none;
  box-shadow: 0 0 8px #33333336;
  div.modal-block {
    position: relative;
    background-color: #ffffff;
    color: #383838;
  }
  .header-title-wrap {
    position: relative;
    padding: 0.6rem 0;
    text-align: center;
    font-size: 0.96rem;
    font-weight: bold;
  }
  .header-title-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: rgba(138, 138, 138, 0.1);
  }
  .modal-body {
    position: relative;
    border-radius: 10px 10px 0 0;
  }
  .modal-body::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    width: 100%;
    height: 1rem;
    background-image: url('./../../assets/form_bottom.png');
    background-repeat: repeat-x;
    background-size: 100% auto;
    background-position: top;
  }
  .body-wrap {
    position: relative;
    padding: 0.4rem 0.7rem;
    text-align: left;
  }
  .buttons-wrap {
    position: relative;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    span {
      position: relative;
      display: inline-block;
      text-align: center;
      padding: 0.6rem 0;
      font-size: 0.86rem;
      font-weight: bold;
    }
    span:nth-of-type(n + 2)::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -0.5px;
      width: 1px;
      background: rgba(138, 138, 138, 0.1);
    }
  }
  .buttons-wrap::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: rgba(138, 138, 138, 0.1);
  }
}
</style>
