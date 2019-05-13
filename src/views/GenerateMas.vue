<template>
  <div class="page animated fadeIn">
    <div class="maItemWrap" v-for="(m, mIndex) in masInfo" :key="mIndex">
      <div class="title" :txt="m.key"></div>
      <div class="content">
        <div class="inputWrap">
          <input type="text" placeholder="码内信息" v-model="m.info.value" v-if="m.info" disabled>
          <input type="text" placeholder="访问地址" v-model="m.jumpUrl" disabled>
        </div>
        <img class="maImg" :src="m.imgData" v-if="m.imgData">
      </div>
    </div>
    <div class="maItemWrap">
      <div class="title" :txt="'自定义生成二维码，仅用于测试，请按照后台真实数据填写'"></div>
      <div class="content">
        <div class="inputWrap">
          <div class="inputRangeWrap" :curLevel="customMaLevel">
            <input type="range" class="inputRange" min="2" max="3" v-model="customMaLevel">
          </div>
          <div class="customInputWrap" label="码对应上级id">
            <input type="number" placeholder="码对应上级id" v-model="customMaPId" :disabled="customMaLevel == 2">
          </div>
          <div class="customInputWrap" label="码对应本身id">
            <input type="number" placeholder="码对应本身id" v-model="customMaId">
          </div>
          <div class="customInputWrap" label="码包含的员工名或子公司名">
            <input type="text" placeholder="码包含的员工名或子公司名" v-model="customMaName">
          </div>
          <div class="customInputWrap" label="码包含的员工或子公司手机号">
            <input type="number" placeholder="码包含的员工或子公司手机号" v-model="customMaPhone">
          </div>
          <input type="text" placeholder="访问地址，输入以上信息后自动生成" :value="customMaWebPathGet" disabled>
        </div>
        <div class="customMaImgWrap">
          <img class="customMaImg" :src="customMa">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SOME_RULES } from '@/utils/rules'

const customMaImgDefault = require('@/assets/dc_logo.png')

export default {
  name: 'generate-ma',
  data () {
    return {
      masInfo: [
        {
          key: '空二维码',
          info: null
        },
        {
          key: '总二维码',
          info: {
            level: 1,
            pid: 0,
            id: 0,
            value: '总码'
          }
        }
      ],
      customMaLevel: '2',
      customMaPId: '0',
      customMaId: '',
      customMaName: '',
      customMaPhone: '',
      customMa: customMaImgDefault
    }
  },
  computed: {
    isCustomAllInput () {
      if (this.customMaLevel.trim() !== '' && this.customMaPId.trim() !== '' && this.customMaId.trim() !== '' && this.customMaName.trim() !== '' && this.customMaPhone.trim() !== '' && SOME_RULES.phone.test(this.customMaPhone.trim())) {
        return this.customMaLevel.trim() + '|' +  this.customMaPId.trim() + '|' + this.customMaId.trim() + '|' + this.customMaName.trim() + '|' + this.customMaPhone.trim()
      }
      return ''
    },
    customMaWebPathGet () {
      if (this.isCustomAllInput !== '') {
        let params = {
          level: this.customMaLevel.trim(),
          pid: this.customMaPId.trim(),
          id: this.customMaId.trim(),
          name: this.customMaName.trim(),
          phone: this.customMaPhone.trim()
        }
        return this.$WEB_APP_PATH + (this.$comfun.getUrlParamsByJson(params) ? '?' + this.$comfun.getUrlParamsByJson(params) : '')
      } else {
        return ''
      }
    }
  },
  created () {
    for (let i = 0; i < this.masInfo.length; i++) {
      let params = this.masInfo[i].info || null
      this.$comfun.generateQrCode(this.$WEB_APP_PATH, params).then(res => {
        this.$set(this.masInfo[i], 'jumpUrl', this.$WEB_APP_PATH + (this.$comfun.getUrlParamsByJson(params) ? '?' + this.$comfun.getUrlParamsByJson(params) : ''))
        this.$set(this.masInfo[i], 'imgData', res)
      })
    }
  },
  methods: {
    createQr (params) {
      this.$comfun.generateQrCode(this.$WEB_APP_PATH, params).then(res => {
        this.customMa = res
      })
    }
  },
  watch: {
    customMaLevel (v) {
      if (v == 2) {
        this.customMaPId = '0'
      } else {
        this.customMaPId = ''
      }
    },
    isCustomAllInput (v) {
      if (v !== '') {
        this.createQr({
          level: this.customMaLevel.trim(),
          pid: this.customMaPId.trim(),
          id: this.customMaId.trim(),
          name: this.customMaName.trim(),
          phone: this.customMaPhone.trim()
        })
      } else {
        this.customMa = customMaImgDefault
      }
    }
  }
}
</script>

<style lang="less" scoped>
@curLevelContent: '码所属等级（子公司码：2、员工码：3）   当前：' attr(curLevel);
.maItemWrap {
  position: relative;
  padding-bottom: 1rem;
  margin-top: 0.8rem;
  .title {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  .title::before {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto 0;
    height: 6px;
    background-color: #606872;
  }
  .title::after {
    content: attr(txt);
    position: relative;
    font-size: 0.6rem;
    color: #f3f3f3;
    background-color: #d66464;
    padding: 0.2rem 0.4rem;
    margin-left: 1rem;
    border-radius: 6px;
    box-shadow: 3px 3px 10px #465d5a;
  }
  .content {
    position: relative;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    .inputWrap {
      position: relative;
      display: -webkit-flex; /* Safari */
      display: flex;
      flex-direction: column;
      flex: 1;
      input {
        position: relative;
        border: none;
        padding: 0.6rem 0.4rem;
        border: 1px solid #ac4040;
        box-sizing: border-box;
        border-radius: 6px;
        font-size: 0.8rem;
        margin: 0.2rem 0.8rem 0.2rem 0;
      }
      .customInputWrap {
        position: relative;
        margin: 0.2rem 0.8rem 0.2rem 0;
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: flex-start;
        align-items: center;
        input {
          flex: 1;
        }
      }
      .customInputWrap::before {
        content: attr(label);
        position: relative;
        font-size: 0.8rem;
        width: 13rem;
        font-weight: bold;
      }
      .inputRangeWrap {
        position: relative;
        .inputRange {
          position: relative;
          width: 20rem;
          height: 10px;
          margin-bottom: 1rem;
          margin-left: 2rem;
          box-shadow: inset 0px 0px 3px 0px #23542c;
        }
      }
      .inputRangeWrap::before {
        content: @curLevelContent;
        position: relative;
        font-size: 0.8rem;
      }
    }
    .maImg {
      position: relative;
    }
    .customMaImgWrap {
      position: relative;
      width: 20rem;
      height: 20rem;
      box-sizing: border-box;
      border: 4px dotted #525252;
      border-radius: 20px;
      padding: 1rem;
      .customMaImg {
        position: absolute;
        max-width: 94%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
}
</style>
