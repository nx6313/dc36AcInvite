import DialogMsg from './msg.js'
import DialogPrompt from './prompt.js'

export default {
    install: function (Vue) {
        Vue.component(DialogMsg.name, DialogMsg)
        Vue.component(DialogPrompt.name, DialogPrompt)

        Vue.prototype.$dialog_msg = DialogMsg.installMsg
        Vue.prototype.$dialog_prompt = DialogPrompt.installPrompt

        Vue.prototype.$page_top_ic_title = require('@/assets/page_top_ic_title.png')
        Vue.prototype.$page_top_ic = require('@/assets/page_top_ic.jpg')
        Vue.prototype.$ma_bg = require('@/assets/ma_bg.png')
        Vue.prototype.$embellish_1 = require('@/assets/embellish_1.png')
        Vue.prototype.$embellish_2 = require('@/assets/embellish_2.png')
        Vue.prototype.$embellish_3 = require('@/assets/embellish_3.png')
        Vue.prototype.$embellish_4 = require('@/assets/embellish_4.png')
        Vue.prototype.$embellish_5 = require('@/assets/embellish_5.png')
        Vue.prototype.$embellish_6 = require('@/assets/embellish_6.png')
        Vue.prototype.$dc_logo = require('@/assets/dc_logo.png')
        Vue.prototype.$form_bottom = require('@/assets/form_bottom.png')
        Vue.prototype.$rule_ic = require('@/assets/rule_ic.png')
        Vue.prototype.$my_apply_title = require('@/assets/my_apply_title.png')
        Vue.prototype.$my_apply_img = require('@/assets/my_apply_img.png')
        Vue.prototype.$icon_phone = require('@/assets/icon_phone.png')
    }
}
