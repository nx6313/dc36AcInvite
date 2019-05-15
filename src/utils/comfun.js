import Vue from 'vue'
import CryptoJS from 'crypto-js'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'wheel-picker/dist/wheelpicker.min.css'
import '@/plugins/comm.css'
import '@/plugins/animate.css'
import QRCode from 'qrcode'
import toSjis from 'qrcode/helper/to-sjis'
import Dialogbox from '@/plugins/dialogBox/index.js'
import { Axios, FileAxios, LoadingManager } from '@/utils/axiosConfig'

Vue.use(CryptoJS)
Vue.use(Loading)
Vue.use(Dialogbox)
const dialogAlert = require('react-confirm-alert')
const WheelPicker = require('wheel-picker')

var key = CryptoJS.enc.Utf8.parse("123456789zxcvbnm")
var iv = CryptoJS.enc.Utf8.parse("123456789zxcvbnm")

var dialogPrompt = null // 带有输入框的dialog弹出框
var picker = null // picker选择器
var signPanel = null // 签名板

export default {
  install: function (Vue) {
    var ComFun = {
      http_get: function (context, url, params) {
        let token = null
        let secret = null
        if (this.hasAuthInfoInUrl()) {
          token = this.getRequestAuto('token')
          secret = this.getRequestAuto('secret')
          context.$store.commit('updateAuth', {
            secret: secret,
            token: token
          })
        }
        var headers = {
          'appType': 2, // 请求的类型 1：司机、2：普通会员
          'devicetype': 5
        }
        if (this.hasAuthInfoInUrl() || (context.$store.state.auth.token != null && context.$store.state.auth.secret != null)) {
          headers['token'] = token || context.$store.state.auth.token
          headers['secret'] = secret || context.$store.state.auth.secret
        }
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        var axiosOptions = {
          method: 'GET',
          headers: headers,
          url: context.$BASE_URL + url
        }
        if (params) {
          axiosOptions.params = params
        }
        return Axios(axiosOptions)
      },
      http_get_: function (url, params) {
        var headers = {}
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        var axiosOptions = {
          method: 'GET',
          headers: headers,
          url: url
        }
        if (params) {
          axiosOptions.params = params
        }
        return Axios(axiosOptions)
      },
      http_post: function (context, url, params) {
        let token = null
        let secret = null
        if (this.hasAuthInfoInUrl()) {
          token = this.getRequestAuto('token')
          secret = this.getRequestAuto('secret')
          context.$store.commit('updateAuth', {
            secret: secret,
            token: token
          })
        }
        var headers = {
          'appType': 2, // 请求的类型 1：司机、2：普通会员
          'devicetype': 5
        }
        if (this.hasAuthInfoInUrl() || (context.$store.state.auth.token != null && context.$store.state.auth.secret != null)) {
          headers['token'] = token || context.$store.state.auth.token
          headers['secret'] = secret || context.$store.state.auth.secret
        }
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        var axiosOptions = {
          method: 'POST',
          headers: headers,
          url: context.$BASE_URL + url
        }
        if (params) {
          axiosOptions.data = params
        }
        return Axios(axiosOptions)
      },
      http_post_: function (url, params) {
        var headers = {}
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        var axiosOptions = {
          method: 'POST',
          headers: headers,
          url: url
        }
        if (params) {
          axiosOptions.data = params
        }
        return Axios(axiosOptions)
      },
      http_file: function (context, url, file) {
        let token = null
        let secret = null
        if (this.hasAuthInfoInUrl()) {
          token = this.getRequestAuto('token')
          secret = this.getRequestAuto('secret')
          context.$store.commit('updateAuth', {
            secret: secret,
            token: token
          })
        }
        var headers = {
          'appType': 2, // 请求的类型 1：司机、2：普通会员
          'devicetype': 5
        }
        if (this.hasAuthInfoInUrl() || (context.$store.state.auth.token != null && context.$store.state.auth.secret != null)) {
          headers['token'] = token || context.$store.state.auth.token
          headers['secret'] = secret || context.$store.state.auth.secret
        }
        headers['Content-Type'] = 'multipart/form-data'
        var axiosOptions = {
          method: 'POST',
          headers: headers,
          url: context.$BASE_URL + url,
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            // eslint-disable-next-line
            console.log(`文件【${file.name}】上传进度：${percentCompleted} %`)
          }
        }
        let formData = new FormData()
        formData.append('file', file)
        axiosOptions.data = formData
        return FileAxios(axiosOptions)
      },
      http_file_: function (url, params) {
        var headers = {}
        headers['Content-Type'] = 'multipart/form-data'
        var axiosOptions = {
          method: 'POST',
          headers: headers,
          url: url,
          contentType: false,
          processData: false
        }
        let formData = new FormData()
        for (let key in params) {
          formData.append(key, params[key])
        }
        axiosOptions.data = formData
        return FileAxios(axiosOptions)
      },
      // 判断url中是否包含用户登陆认证信息
      hasAuthInfoInUrl: function () {
        let token = this.getRequestAuto('token')
        let secret = this.getRequestAuto('secret')
        if (token && secret) {
          return true
        }
        return false
      },
      // 判断当前是否有用户登陆认证信息
      hasAuthInfo: function (context) {
        return this.hasAuthInfoInUrl() || (context.$store.state.auth.token && context.$store.state.auth.secret)
      },
      // 显示loading
      showLoading: function (context, tag, canCancelFlag, container, onCancelCallBack) {
        if (canCancelFlag === undefined) canCancelFlag = true
        if (onCancelCallBack === undefined) onCancelCallBack = () => {}
        let loader = context.$loading.show({
          container: container,
          canCancel: canCancelFlag,
          onCancel: onCancelCallBack,
          color: '#C51A20',
          loader: 'bars', // spinner 、 dots 、 bars
          backgroundColor: '#2C2C2C',
          opacity: 0.4
        })
        LoadingManager.set(tag, loader)
      },
      // 隐藏loading
      hideLoading: function (tag) {
        let loader = LoadingManager.get(tag)
        loader.hide()
        LoadingManager.delete(tag)
      },
      // 显示dialog弹出框
      showDialog: function (title, message, okCallBack) {
        if (title === undefined) title = '未定义标题'
        if (message === undefined) message = '未定义内容'
        if (okCallBack === undefined) okCallBack = () => {}
        let btns = [
          {
            label: '取消',
            onClick: () => {}
          },
          {
            label: '确认',
            onClick: () => {
              okCallBack()
            }
          }
        ]
        dialogAlert.confirmAlert({
          title: title,
          message: message,
          buttons: btns
        })
      },
      // 显示带有输入框的dialog弹出框
      showDialogWithPrompt: function (context, title, message, showCancel, hint, rule, ruleOkTip, ruleErrorTip, okCallBack, ruleCallBack, isMultiline, defalutValue) {
        if (title === undefined) title = '未定义标题'
        if (showCancel === undefined) showCancel = true
        if (hint === undefined) hint = ''
        if (okCallBack === undefined) okCallBack = () => {}
        if (isMultiline === undefined) isMultiline = false
        if (defalutValue === undefined) defalutValue = ''
        let btns = [
          {
            label: '取消',
            onClick: () => {}
          },
          {
            label: '确认',
            onClick: (promptInput) => {
              return okCallBack(promptInput)
            }
          }
        ]
        dialogPrompt = context.$dialog_prompt({
          title: title,
          msg: message,
          showCancel: showCancel,
          hint: hint,
          rule: rule,
          ruleOkTip: ruleOkTip,
          ruleErrorTip: ruleErrorTip,
          buttons: btns,
          ruleCallBack: ruleCallBack,
          isMultiline: isMultiline,
          defalutValue: defalutValue
        })
        return dialogPrompt
      },
      // 显示Toast
      showToast: function(context, msg, duration) {
        if (msg === undefined) msg = 'toast 内容未定义'
        if (duration === undefined) duration = 2200
        context.$dialog_msg({
          msg: msg,
          duration: duration
        })
      },
      // 显示签名面板
      showSignPanel: function(context, callBack) {
        if (callBack === undefined) callBack = () => {}
        signPanel = context.$dialog_sign({
          callBack: callBack
        })
      },
      closeSignPanel: function() {
        if (signPanel !== null) {
          signPanel.destorySign()
          signPanel = null
        }
      },
      // 弹出picker选择
      // data 为双层数组结构
      showPicker: function(title, data, onSelect, onChange, value) {
        value = value || []
        picker = new WheelPicker({
          title: title,
          data: data,
          value: value,
          hideOnBackdrop: true,
          onSelect: (result) => {
            onSelect(result)
            setTimeout(() => {
              picker.destory()
              picker = null
            }, 300)
          },
          onCancel: () => {
            setTimeout(() => {
              picker.destory()
              picker = null
            }, 300)
          },
          onChange: onChange
        })
        picker.show()
        return picker
      },
      // 日期格式转字符串，指定格式
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      // (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
      formatDate: function (date, fmt) {
        if (date) {
          var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
          }
          return fmt
        }
        return null
      },
      // 获取指定日期几天前或几天后的日期，未指定日期按照当前日期计算
      getTargetDate (diff, date) {
        var today = new Date()
        if (date !== undefined) {
          today = date
        }
        var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * Number(diff)
        var targetday = new Date()
        targetday.setTime(targetdayMilliseconds)
        return targetday
      },
      // 获取指定周的起止日期
      getWeekStartEnd (addWeekCount) {
        if (!addWeekCount) {
          addWeekCount = 0
        }
        var startEnd = []
        var milliSecond = 1000 * 60 * 60 * 24
        var currentDate = new Date()
        currentDate = new Date(currentDate.getTime() + (milliSecond * 7 * addWeekCount))
        var week = currentDate.getDay()
        var minusDay = week !== 0 ? week - 1 : 6
        var currentWeekFirstDay = new Date(currentDate.getTime() - (milliSecond * minusDay))
        var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (milliSecond * 6))
        startEnd.push(currentWeekFirstDay)
        startEnd.push(currentWeekLastDay)
        return startEnd
      },
      // 获取指定月的起止日期
      getMonthStartEnd (addMonthCount) {
        if (!addMonthCount) {
          addMonthCount = 0
        }
        var startEnd = []
        var currentDate = new Date()
        currentDate.setDate(1)
        currentDate.setMonth(currentDate.getMonth() + addMonthCount)
        var year = currentDate.getFullYear()
        var month = currentDate.getMonth()
        var currentMonthLastDay = null
        if (year === new Date().getFullYear() && month === new Date().getMonth()) {
          currentMonthLastDay = new Date()
        } else {
          currentMonthLastDay = this.getLastDay(year, month + 1)
        }
        startEnd.push(currentDate)
        startEnd.push(currentMonthLastDay)
        return startEnd
      },
      // 获取指定年的起止日期
      getYearStartEnd (addYearCount) {
        if (!addYearCount) {
          addYearCount = 0
        }
        var startEnd = []
        var currentDate = new Date()
        currentDate.setDate(1)
        currentDate.setFullYear(currentDate.getFullYear() + addYearCount)
        var year = currentDate.getFullYear()
        var currentYearLastDay = null
        if (year === new Date().getFullYear()) {
          currentYearLastDay = new Date()
        } else {
          currentYearLastDay = this.getLastDay(year, 12)
        }
        startEnd.push(currentDate)
        startEnd.push(currentYearLastDay)
        return startEnd
      },
      // 获取某月最后一天日期
      getLastDay (year, month) {
        var newYear = year
        var newMonth = month++
        if (newMonth > 12) {
          newMonth -= 12
          newYear++
        }
        var newDate = new Date(newYear, newMonth, 1)
        return new Date(newDate.getTime() - 1000 * 60 * 60 * 24)
      },
      // 将相差的毫秒数转为时间
      formatDiffMilliseconds (diffMilliseconds) {
        let dayMill = 24 * 60 * 60 * 1000
        let hourMill = 60 * 60 * 1000
        let minuteMill = 60 * 1000
        let secondMill = 1000
        let day = Math.floor(diffMilliseconds / dayMill)
        let dayResidue = diffMilliseconds % dayMill
        let hour = Math.floor(dayResidue / hourMill)
        let hourResidue = dayResidue % hourMill
        let minute = Math.floor(hourResidue / minuteMill)
        let minuteResidue = hourResidue % minuteMill
        let second = Math.floor(minuteResidue / secondMill)
        let returnVal = ''
        if (day > 0) {
          returnVal += day + ' 天 '
        }
        if (hour > 0) {
          returnVal += hour + ' 小时 '
        }
        if (minute > 0) {
          returnVal += minute + ' 分钟 '
        }
        if (day === 0 && hour === 0 && minute === 0) {
          returnVal = second + ' 秒 '
        }
        return returnVal
      },
      /**
       * 计算年龄
       * 传入生日，格式：yyyy-MM-dd
       */
      getAge: function (birthday) {
        let birthdayArr = birthday.split('-')
        let d = new Date()
        let yearDiff = d.getFullYear() - birthdayArr[0]
        let monthDiff = d.getMonth() + 1 - birthdayArr[1]
        let dayDiff = d.getDate() - birthdayArr[2]
        let age = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? yearDiff - 1 : yearDiff
        return age = age < 0 ? 0 : age
      },
      // 判断设备类型
      isAndroidIos: function () {
        var p = navigator.platform
        var u = navigator.userAgent
        var app = navigator.appVersion
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        return {
          isAndroid: isAndroid,
          isiOS: isiOS,
          platform: p,
          isMobile: !(p.toLowerCase().indexOf('win') >= 0 || p.toLowerCase().indexOf('mac') >= 0),
          deviceInfo: app
        }
      },
      // 自动判断是以普通方式跳转页面传值还是通过hash值方式，并获取网址中的参数
      getRequestAuto: function (key) {
        let url = location.href
        let search = location.search
        if (search === '') {
          let safe = true
          if (this.decryptedData(decodeURIComponent(url.split('?')[1])) == '') safe = false
          return this.getRequestHash(key, safe)
        } else {
          let safe = true
          if (this.decryptedData(decodeURIComponent(search.substr(1))) == '') safe = false
          return this.getRequest(key, safe)
        }
      },
      // 获取网址中的参数
      getRequest: function (key, safe) {
        let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
        let url = location.search
        let str = decodeURIComponent(url.substr(1))
        if (safe) {
          str = this.decryptedData(str)
        }
        let matchParams = str.match(reg)
        if (matchParams != null) return matchParams[2]
        return null
      },
      // 获取网址中的hash值
      getRequestHash: function (key, safe) {
        var hash = location.hash
        var theRequest = {}
        var str = decodeURIComponent(hash.split('?')[1])
        if (safe) {
          str = this.decryptedData(str)
        }
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
        }
        if (key) {
          return theRequest[key]
        }
        return null
      },
      // aes加密
      encryptedData(data) {
        var encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        return encrypted.toString()
      },
      // aes解密
      decryptedData(data) {
        var decrypt = CryptoJS.AES.decrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        return decrypt.toString(CryptoJS.enc.Utf8)
      },
      // 生成uuid
      guid () {
        return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1))
      },
      // 根据指定键返回json的数组中与所查找的值相同的数据位置
      getIndexInJsonArr (jsonArr, key, search) {
        var index = -1
        for (let i = 0; i < jsonArr.length; i++) {
          if (jsonArr[i][key] === search) {
            index = i
            break
          }
        }
        return index
      },
      // 判断是否为空对象
      isEmptyObject: function(obj) {
        // eslint-disable-next-line
        for (let key in obj) {
          return false
        }
        return true
      },
      // 关闭当前页面可能存在的弹出框
      closeCurDialogPrompt: function() {
        if (picker != null) {
          picker.destory()
          picker = null
        }
        if (dialogPrompt != null) {
          dialogPrompt.destory()
          dialogPrompt = null
        }
      },
      // 生成二维码
      generateQrCode (path, params) {
        let paramStr = this.getUrlParamsByJson(params)
        let text = encodeURI(path + (paramStr === '' ? '' : '?' + paramStr))
        return QRCode.toDataURL(text, {
          errorCorrectionLevel: 'Q',
          toSJISFunc: toSjis,
          margin: 1
        })
      },
      getUrlParamsByJson (params) {
        let paramStr = ''
        if (params) {
          for (let key in params) {
            paramStr += key + '=' + params[key]
            paramStr += '&'
          }
          paramStr = paramStr.substr(0, paramStr.length - 1)
        }
        return paramStr
      },
      // 调用拨号功能
      callPhone (phoneNumber) {
        window.location.href = `tel://${phoneNumber}`
      }
    }

    Object.defineProperty(Vue.prototype, '$comfun', { value: ComFun })
  }
}
