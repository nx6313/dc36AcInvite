

import axios from 'axios'
import DialogMsg from '@/plugins/dialogBox/msg.js'

var loadingManagerInstance = new Map() // 管理loading对象

const AxiosInstance = axios.create({
  transformRequest: [function (data) {
    // 将数据转换为表单数据
    let ret = ''
    for (let it in data) {
      if (data[it] !== null) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
    }
    return ret != '' ? ret.substr(0, ret.length - 1) : ret
  }],
  timeout: 20000
})
AxiosInstance.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  console.log(error)
  loadingManagerInstance.forEach((loader) => {
    loader.hide()
  })
  loadingManagerInstance.clear()
  if (error.message.includes('timeout')) {
    DialogMsg.installMsg({
      msg: '请求超时',
      duration: 2000
    })
  } else {
    // eslint-disable-next-line
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      DialogMsg.installMsg({
        msg: `请求出错，错误码：${error.response.status}，请联系客服`,
        duration: 2000
      })
    } else if (error.request) {
      DialogMsg.installMsg({
        msg: '请求未响应，请检查您的网络连接',
        duration: 2000
      })
    } else {
      DialogMsg.installMsg({
        msg: '请求出错',
        duration: 2000
      })
    }
  }
  if (loginDialog != null) {
    loginDialog.destory()
    loginDialog = null
  }
  return Promise.reject(error)
})
const FileAxiosInstance = axios.create({
  timeout: 20000
})
FileAxiosInstance.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  loadingManagerInstance.forEach((loader) => {
    loader.hide()
  })
  loadingManagerInstance.clear()
  if (error.message.includes('timeout')) {
    DialogMsg.installMsg({
      msg: '文件上传超时',
      duration: 2000
    })
  } else {
    DialogMsg.installMsg({
      msg: '文件上传出错',
      duration: 2000
    })
  }
  return Promise.reject(error)
})

export const Axios = AxiosInstance
export const FileAxios = FileAxiosInstance
export const LoadingManager = loadingManagerInstance
