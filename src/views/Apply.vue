<template>
  <div class="page animated fadeIn">
    <div class="pageTopImgWrap">
      <img class="pageTopImg" :src="$page_top_ic">
      <img class="embellish_icon embellish_1" :src="$embellish_4">
      <img class="embellish_icon embellish_2" :src="$embellish_3">
      <img class="embellish_icon embellish_3" :src="$embellish_1">
      <img class="embellish_icon embellish_4" :src="$embellish_5">
    </div>
    <div class="formWrap">
      <div class="formTitle">{{formTitle}}</div>
      <input class="formInput userName" type="text" :placeholder="formNamePlaceholder" v-model="userName">
      <input class="formInput userPhone" type="text" placeholder="请输入手机号" v-model="userPhone">
      <span class="formSubmitBtn" @click="toSubmit">立即提交</span>
    </div>
    <div class="rulesWrap">
      <div class="rulesTitle">
        <span>活动规则
          <img class="ruleTitleImg before" :src="$rule_ic">
          <img class="ruleTitleImg after" :src="$rule_ic">
        </span>
      </div>
      <div :class="['ruleItemWrap', ruleIndex == getRules.length - 1 ? 'isLastRuleItemWrap' : '']" :itemIndex="ruleIndex + 1" v-for="(rule, ruleIndex) in getRules" :key="ruleIndex">
        <span>{{rule}}</span>
      </div>
    </div>
    <img class="embellish_icon embellish_5" :src="$embellish_6">
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'

export default {
  name: 'apply-page',
  data () {
    return {
      level: null,
      id: null,
      formTitle: '报名预约',
      formNamePlaceholder: '请输入姓名',
      userName: '',
      userPhone: '',
      rules: [ // 子公司
        '活动时间：5月16日~20日',
        '点击报名，即可凭报名信息在大昌主题展区领取感恩礼一份',
        '拍摄活动现场照片发送至朋友圈，可在红包墙抽取感恩红包',
        '现场购车即享一年常规保养、再送太阳膜+脚垫',
        '抢订热线：3188111  3185985',
        '活动地址：煤炭交易中心大昌集团主题展区F5-F8、特价展区F3'
      ],
      rules2: [ // 员工
        '活动时间：5月16日~20日',
        '活动期间内，每有10名好友通过您的专属码报名，奖励大昌出行打车券',
        '通过扫您的专属码报名的好友，凡成功购车，您即可再得300元现金奖励',
        '活动中如果发现通过作弊手段获得奖励的，将取消奖励',
        '活动最终解释权归山西大昌汽车集团所有',
        '咨询热线：3185985或者3188111'
      ],
      rules3: [ // 对应推广人
        '活动时间：5月16日~20日',
        '点击报名，即可凭报名信息在大昌主题展区领取感恩礼一份',
        '拍摄活动现场照片发送至朋友圈，可在红包墙抽取感恩红包',
        '现场购车即享一年常规保养、再送太阳膜+脚垫',
        '抢订热线：3188111  3185985',
        '活动地址：煤炭交易中心大昌集团主题展区F5-F8、特价展区F3'
      ]
    }
  },
  computed: {
    getRules () {
      if (this.level && Number(this.level) === 1) {
        return this.rules
      } else if (this.level && Number(this.level) === 2) {
        return this.rules2
      }
      return this.rules3
    }
  },
  created () {
    this.level = this.$comfun.getRequest('level')
    this.id = this.$comfun.getRequest('id')
    if (this.level && Number(this.level) === 1) {
      this.formTitle = '生成子公司二维码'
      this.formNamePlaceholder = '请输入子公司名'
    } else if (this.level && Number(this.level) === 2) {
      this.formTitle = '生成员工个人二维码'
      this.formNamePlaceholder = '请输入您的姓名'
    }
  },
  methods: {
    toSubmit () {
      if (!this.level || !this.id) return false
      if (this.userName.trim() == '') { this.$comfun.showToast(this, '请先输入您的姓名'); return false }
      if (SOME_RULES.emoji.test(this.userName.trim())) { this.$comfun.showToast(this, '姓名中不能含有特殊字符'); return false }
      if (this.userPhone.trim() == '') { this.$comfun.showToast(this, '请先输入您的手机号'); return false }
      if (!SOME_RULES.phone.test(this.userPhone.trim())) { this.$comfun.showToast(this, '请填入正确的手机号'); return false }

      this.$comfun.http_post(this, this.$api.addInfo, {
        level: Number(this.level) + 1,
        PromotionId: this.id,
        name: this.userName.trim(),
        phone: this.userPhone.trim()
      }).then(data => {
        if (data.status === 'OK') {
          this.userName = ''
          this.userPhone = ''
          this.$comfun.showToast(this, '提交成功')
          if (Number(this.level) < 3 && Number(data.data.level) < 4) {
            this.$router.replace({
              path: '/',
              query: {
                data: JSON.stringify(data.data)
              }
            })
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
@formInputWidth: 86%;
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
  box-shadow: 0 0 10px rgba(50, 50, 50, .2);
  margin-top: -4.2rem;
  padding-bottom: 1.8rem;
  z-index: 1;
  .formTitle {
    position: relative;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
    padding: 2rem 0 1.2rem;
  }
  .formInput {
    position: relative;
    display: block;
    width: @formInputWidth;
    left: calc((100% - @formInputWidth) / 2);
    height: 2.6rem;
    margin-bottom: 0.8rem;
    border: 1px solid #C1000F;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 0.8rem;
    padding: 0 1.2rem;
  }
  .formSubmitBtn {
    position: relative;
    display: block;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background-color: #C1000F;
    border-radius: 20rem;
    color: #ffffff;
    font-size: 1.1rem;
    margin: 0 2rem;
    box-shadow: 0px 0 10px rgba(76, 76, 76, 0.1);
    margin-top: 1.6rem;
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
.rulesWrap {
  position: relative;
  width: 100%;
  .rulesTitle {
    position: relative;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
    padding: 2rem 0 0.4rem;
    color: #FFF8A0;
    span {
      position: relative;
      display: inline-block;
      padding: 0 2.4rem;
      .ruleTitleImg {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 1.4rem;
      }
      .before {
        left: 0;
      }
      .after {
        right: 0;
      }
    }
  }
  .ruleItemWrap {
    position: relative;
    padding: 0.7rem 1.2rem;
    color: #ffffff;
    font-size: 0.9rem;
    z-index: 8;
    span {
      position: relative;
      display: inline-block;
      margin-left: 0.8rem;
      width: calc(100% - 0.8rem - 1.2rem);
      vertical-align: top;
    }
  }
  .ruleItemWrap::before {
    content: attr(itemIndex);
    position: relative;
    display: inline-block;
    width: 1.2rem;
    height: 1.1rem;
    text-align: center;
    line-height: 1.1rem;
    font-weight: bold;
    background-color: #FFF8A0;
    color: #C1000F;
    border-radius: 50%;
    vertical-align: top;
    padding-top: 0.1rem;
  }
  .isLastRuleItemWrap {
    margin-bottom: 3rem;
  }
}
.embellish_icon {
  position: absolute;
  width: 3.8rem;
  bottom: 0;
}
.embellish_1 {
  width: 2.5rem;
  left: 0;
  bottom: 12rem;
}
.embellish_2 {
  right: 0;
  bottom: 6rem;
}
.embellish_3 {
  left: 0;
  bottom: 2rem;
  z-index: 9;
}
.embellish_4 {
  width: 2.8rem;
  right: 0;
  bottom: -19rem;
  z-index: 9;
}
.embellish_5 {
  width: 2.5rem;
  position: fixed;
  left: 50vw;
  z-index: 0;
}
</style>
