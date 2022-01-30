// components/page-container/page-container.js
import { setPageContainerScrollHeight } from '../../tools/system-info'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '标题',
    },
    hiddenCapsule: {
      type: Boolean,
      value: false
    },
    disableBack: {
      type: Boolean,
      value: false
    }
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.setDomHeight()
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    capsuleBarHeight: 0,
    scrollHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setDomHeight() {
      setPageContainerScrollHeight(this)
    },

    scrollToLower() {
      this.triggerEvent('scrollToLower')
    },

    leftTap() {
      this.triggerEvent('leftBtnTap')
    }
  },
})
