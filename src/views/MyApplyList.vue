<template>
  <div class="page animated fadeIn">
    <div class="pageTopImgWrap">
      <img class="pageTopImg" :src="$page_top_ic_title">
    </div>
    <div class="formWrap">
      <div class="header">
        <img class="myApplyTitleImg" :src="$my_apply_title">
        <div class="tableHead">
          <span :style="{ width: '25%' }">序号</span>
          <span :style="{ width: '25%' }">姓名</span>
          <span :style="{ width: '50%' }">手机号</span>
        </div>
      </div>
      <div class="mainContentWrap">
        <div class="contentItemWrap" v-for="(content, contentIndex) in datas" :key="contentIndex">
          <span :style="{ width: '25%' }">{{contentIndex + 1}}</span>
          <span :style="{ width: '25%' }">{{content.user_name}}</span>
          <span :style="{ width: '50%' }">{{content.phone | formatUserPhone}}</span>
        </div>
      </div>
    </div>
    <img class="embellish_icon embellish_1" :src="$embellish_1">
    <img class="embellish_icon embellish_2" :src="$embellish_5">
    <img class="embellish_icon embellish_3" :src="$embellish_6">
  </div>
</template>

<script>
export default {
  name: 'index-page',
  data () {
    return {
      userPhone: null,
      memberId: null,
      datas: []
    }
  },
  filters: {
    formatUserPhone (phone) {
      return phone.substr(0, 3) + ' **** ' + phone.substr(7, 4)
    }
  },
  created () {
    if (this.$route.query.data) {
      this.userPhone = JSON.parse(this.$route.query.data).phone
      this.memberId = JSON.parse(this.$route.query.data).memberid
      this.getDatas()
    }
  },
  methods: {
    getDatas () {
      this.datas = []
      this.$comfun.showLoading(this, 'getApplyList')
      this.$comfun.http_post(this, this.$api.getApplyList, {
        memberPromotionId: this.memberId,
        phone: this.userPhone.trim()
      }).then(data => {
        this.$comfun.hideLoading('getApplyList')
        if (data.status === 'OK' && data.data) {
          for (let i = 0; i < data.data.length; i ++) {
            this.datas.push(data.data[i])
          }
        } else {
          this.$comfun.showToast(this, data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@formWidth: 86%;
.pageTopImgWrap {
  position: relative;
  width: 100%;
  .pageTopImg {
    position: relative;
    width: 100%;
  }
}
.formWrap {
  position: relative;
  width: @formWidth;
  left: calc((100% - @formWidth) / 2);
  background-color: #ffffff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 0 20px rgba(97, 97, 97, 0.4);
  margin-top: -6.8rem;
  z-index: 1;
  height: calc(100vh - 6.8rem - 1rem - 100vw * 0.38);
  font-size: 0;
  .header {
    position: relative;
    width: 100%;
    padding-top: 4.6rem;
    .myApplyTitleImg {
      position: absolute;
      width: 50%;
      top: 1rem;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .tableHead {
      position: relative;
      width: 100%;
      height: 2.6rem;
      background-color: #FCE5E8;
      color: #E30019;
      font-size: 0.9rem;
      font-weight: bold;
      display: -webkit-flex; /* Safari */
      display: flex;
      justify-content: space-around;
      align-items: center;
      span {
        display: inline-block;
        text-align: center;
      }
    }
  }
  .mainContentWrap {
    position: relative;
    width: 100%;
    height: calc(100% - 4.6rem - 2.6rem - 0.6rem);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .contentItemWrap {
      position: relative;
      width: 100%;
      height: 2.2rem;
      background-color: #FFFFFF;
      color: rgb(83, 83, 83);
      font-size: 0.8rem;
      display: -webkit-flex; /* Safari */
      display: flex;
      justify-content: space-around;
      align-items: center;
      span {
        display: inline-block;
        text-align: center;
      }
    }
    .contentItemWrap:nth-of-type(n + 2)::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 1px;
      background-color: rgb(248, 248, 248);
    }
  }
}
.formWrap::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 1rem;
  background-image: url('./../assets/form_bottom.png');
  background-repeat: repeat-x;
  background-size: 100% auto;
  background-position: top;
}
.embellish_icon {
  position: absolute;
  width: 3.8rem;
  bottom: 0;
  pointer-events: none;
}
.embellish_1 {
  left: 0;
  bottom: 10rem;
  z-index: 9;
}
.embellish_2 {
  width: 2.8rem;
  right: 0;
  bottom: 4rem;
  z-index: 9;
}
.embellish_3 {
  position: fixed;
  width: 3.4rem;
  left: 46vw;
}
</style>
