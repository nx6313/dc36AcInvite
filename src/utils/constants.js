export const APP_CONFIG = {
  isTest: false, // 设置h5是否为测试环境，将忽略内置环境 开启顶部服务器提示调试工具
  openCredentialsDetaction: false, // 是否开启证件检测
  // 172.18.2.32:8080 // 一飞
  // 172.18.2.26:8080 // 玉慧
  // 172.18.2.21:7777 // 璐璐
  // 172.18.2.14:8080 // 泽明
  // https://test.dcchuxing.com
  // localhostServerBaseUrl: 'https://test.dcchuxing.com/' // 默认环境   生产服务器:new 、 预生产服务器:newpre 、 测试服:test   仅影响本地
  localhostServerBaseUrl: 'http://test.ngrok.songyifei.cn/admin/'
  // localhostServerBaseUrl: 'https://test.dcchuxing.com/admin/'
}

export const CONFIG_DATA = {
  PROJECT_WEB_PATH: 'http://172.18.2.13:8080'
}
