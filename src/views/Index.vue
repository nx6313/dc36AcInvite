<template>
  <div class="page animated fadeIn" :style="{ overflow: showShareTip ? 'hidden' : '' }">
    <div class="pageTopImgWrap">
      <img class="pageTopImg" :src="$page_top_ic_title">
      <div class="myApply" @click="toMyApplyList">
        <img class="myApplyImg" :src="$my_apply_img">
        <span>我的</span>
      </div>
    </div>
    <div class="pageMaImgWrap">
      <img class="pageMaImg" :src="$ma_bg">
      <img class="maImg" :src="maImg" :style="{ zIndex: showShareTip ? '99999999' : '9' }" v-if="maImg">
      <span class="maImg maNeedLogin" v-if="!maImg" @click="showLoginModal = true">未授权，点击授权</span>
      <img class="embellish_icon embellish_1" :src="$embellish_1">
      <img class="embellish_icon embellish_2" :src="$embellish_5">
      <div class="shareTipWrap animated fadeIn" @click="showShareTip = false" v-if="showShareTip"></div>
      <div class="shareTipWordWrap animated fadeIn" v-if="showShareTip">
        长按下方二维码，发送给好友
      </div>
    </div>
    <span :class="['transpondBtn', showShareTip ? 'hasShowShareTipBtn' : '']" @click="maImg ? (showShareTip = !showShareTip) : (showLoginModal = true)">转发邀请</span>
    <img class="embellish_icon embellish_3" :src="$embellish_6">
    <Modal :showHead="false" :showButton="false" :show="showLoginModal" @close="showLoginModal = false">
      <template slot="body">
        <div class="loginPage">
          <div class="title">信息授权</div>
          <div class="inputItemWrap phoneWrap">
            <input type="number" v-model="userPhone">
            <i class="clearIcon animated fadeIn" v-if="showClearBtn" @click="userPhone = ''"></i>
          </div>
          <span :class="['toLoginBtn', loginBtnCanUse ? 'toLoginBtnCanUse' : '']" @click="loginBtnCanUse ? toLogin() : () => {}">确认授权</span>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'
import Modal from '@/plugins/dialogBox/modal'

export default {
  name: 'index-page',
  components: {
    Modal
  },
  data () {
    return {
      showLoginModal: false,
      userPhone: '',
      showClearBtn: false,
      loginBtnCanUse: false,
      showShareTip: false,
      maImg: null,
      userInfo: null
    }
  },
  created () {
    if (this.$route.query.data) {
      this.userInfo = JSON.parse(this.$route.query.data)
      this.createQr({
        level: this.userInfo.level,
        pid: this.userInfo.pid,
        id: this.userInfo.id,
        name: this.userInfo.user_name,
        phone: this.userInfo.phone
      })
    } else {
      let saveUserInfo = this.$store.state.userBaseInfo.info
      if (saveUserInfo) {
        this.userInfo = saveUserInfo
        this.createQr({
          level: this.userInfo.level,
          pid: this.userInfo.pid,
          id: this.userInfo.id,
          name: this.userInfo.user_name,
          phone: this.userInfo.phone
        })
      } else {
        let level = this.$comfun.getRequest('level')
        if (level && (Number(level) === 1 || Number(level) === 2 || Number(level) === 3)) {
          this.$router.replace('/apply')
        }
        // this.showLoginModal = true
      }
    }
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
    },
    createQr (params) {
      this.$comfun.generateQrCode(this.$WEB_APP_PATH, params).then(res => {
        this.maImg = res
      })
    },
    toMyApplyList () {
      if (this.userInfo === null) {
        this.showLoginModal = true
      } else {
        this.$router.push({
          path: '/apply-list',
          query: {
            data: JSON.stringify({
              memberid: this.userInfo.id,
              phone: this.userInfo.phone
            })
          }
        })
      }
    },
    toLogin () {
      if (this.userPhone.trim() == '') { this.$comfun.showToast(this, '请先输入您的手机号'); return false }
      if (!SOME_RULES.phone.test(this.userPhone.trim())) { this.$comfun.showToast(this, '请填入正确的手机号'); return false }
      
      this.$comfun.showLoading(this, 'getUserInfo')
      this.$comfun.http_post(this, this.$api.getUserInfo, {
        phone: this.userPhone.trim()
      }).then(data => {
        this.$comfun.hideLoading('getUserInfo')
        if (data.status === 'OK' && data.data) {
          if (data.data.level === 4) {
            this.$comfun.showToast(this, '对不起，您不是本公司员工，无权登录')
          } else {
            this.$comfun.showToast(this, '信息授权成功')
            this.showLoginModal = false
            this.userInfo = data.data
            this.createQr({
              level: this.userInfo.level,
              pid: this.userInfo.pid,
              id: this.userInfo.id,
              name: this.userInfo.user_name,
              phone: this.userInfo.phone
            })
            this.$store.commit('updateUserBaseInfoInfo', {
              info: this.userInfo
            })
          }
        } else {
          this.$comfun.showToast(this, '您未申请过专属二维码，请扫描上级码进行生成')
        }
      })
    }
  },
  watch: {
    userPhone (val) {
      if (val !== '') {
        this.showClearBtn = true
        if (SOME_RULES.phone.test(val.trim()))
          this.loginBtnCanUse = true
        else 
          this.loginBtnCanUse = false
      } else {
        this.showClearBtn = false
        this.loginBtnCanUse = false
      }
    },
    showShareTip (v) {
      if (!v) {
        document.body.removeEventListener("touchmove", this.preventDefault)
        document.body.style.overflow = "auto"
      } else {
        document.body.addEventListener("touchmove", this.preventDefault, {
          passive: false
        })
        document.body.style.overflow = "hidden"
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
}
.pageTopImgWrap {
  position: relative;
  width: 100%;
  .pageTopImg {
    position: relative;
    width: 100%;
  }
  .myApply {
    position: absolute;
    display: block;
    top: 1.2rem;
    right: 0;
    font-size: 0.8rem;
    background-color: #FBF3CF;
    color: #D80017;
    padding: 0.2rem 0.5rem 0.2rem 0.6rem;
    border-radius: 20rem 0 0 20rem;
    box-shadow: inset 9px -10px 1rem 0px rgba(220, 168, 17, 0.8);
    display: -webkit-flex; /* Safari */
    display: flex;
    align-items: center;
    .myApplyImg {
      position: relative;
      display: inline-block;
      width: 16px;
      margin-right: 6px;
    }
  }
}
.pageMaImgWrap {
  position: relative;
  width: 100%;
  margin-top: -8rem;
  z-index: 1;
  .pageMaImg {
    position: relative;
    width: 100%;
  }
  .maImg {
    position: absolute;
    top: calc(50% - 100% * 0.454);
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: block;
    width: calc(100vw * 0.32);
    height: calc(100vw * 0.32);
  }
  .maNeedLogin {
    text-align: center;
    font-size: 0.8rem;
    line-height: calc(100vw * 0.3);
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  }
}
.transpondBtn {
  position: relative;
  display: block;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  background-color: #EE001C;
  border-radius: 20rem;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0 1.2rem;
  box-shadow: inset 0px -20px 1rem 2px rgba(76, 76, 76, 0.36);
  margin-bottom: 3rem;
  z-index: 1;
}
.transpondBtn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 20rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.hasShowShareTipBtn {
  background-color: #545454;
  color: #7b7b7b;
  box-shadow: inset 0px -20px 1rem 2px rgba(117, 117, 117, 0.36);
}
.hasShowShareTipBtn::before {
  box-shadow: 0 0 10px rgba(64, 64, 64, 0.2);
}
.embellish_icon {
  position: absolute;
  width: 3.8rem;
  bottom: 0;
}
.embellish_1 {
  left: 0;
  bottom: 1.6rem;
}
.embellish_2 {
  right: 0;
  bottom: 0;
}
.embellish_3 {
  position: fixed;
  width: 3.4rem;
  left: 46vw;
}
.shareTipWrap {
  position: absolute;
  top: -500rem;
  left: 0;
  right: 0;
  bottom: -500rem;
  z-index: 9999;
  background-color: rgba(27, 27, 27, 0.8);
  -vendor-animation-duration: 0.4s;
  animation-duration: 0.4s;
}
.shareTipWordWrap {
  position: absolute;
  top: calc(50% - 100% * 0.24);
  left: 0;
  right: 0;
  margin: auto;
  display: block;
  text-align: center;
  color: #ffffff;
  z-index: 9999999;
  font-size: 0.8rem;
  pointer-events: none;
}
.loginPage {
  position: relative;
  padding: 1.6rem 0.8rem;
  .title {
    position: relative;
    font-size: 1.3rem;
  }
  .inputItemWrap {
    position: relative;
    width: 100%;
    height: 3rem;
    margin-top: 0.8rem;
    input {
      width: calc(100% - 0.8rem - 4rem);
      height: 100%;
      border: none;
      padding: 0 0.8rem 0 4rem;
      background-color: #f3f3f3;
      color: #585858;
    }
  }
  .inputItemWrap::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0.8rem;
    line-height: 3rem;
    font-size: 0.8rem;
  }
  .phoneWrap::before {
    content: '手机号';
  }
  .phoneWrap {
    input {
      width: calc(100% - 3.8rem - 4rem);
      padding: 0 3.8rem 0 4rem;
    }
    .clearIcon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 3rem;
      background-image: url('./../assets/icon_clear.png');
      background-size: 40%;
      background-repeat: no-repeat;
      background-position: center;
      -vendor-animation-duration: 0.2s;
      animation-duration: 0.2s;
    }
  }
  .toLoginBtn {
    position: relative;
    display: block;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    margin-top: 2.2rem;
    text-align: center;
    background-color: #bdbdbd;
    color: #ffffff;
    transition: all 0.2s;
    font-size: 0.8rem;
  }
  .toLoginBtnCanUse {
    background-color: #d67681;
  }
}
</style>
