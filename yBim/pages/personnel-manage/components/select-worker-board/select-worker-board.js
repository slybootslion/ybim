// pages/attendance-manage/components/select-worker-board/select-worker-board.js
import { formatFloat } from '../../../../tools/utils'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object
    },
    index: {
      type: Number
    }
  },

  observers: {
    detail(value) {
      const data = {
        ticket_money: value.ticket_money ? value.ticket_money : 0,
      }
      if (value.w_day) data.w_day = value.w_day
      if (value.w_pay) data.w_pay = value.w_pay
      if (value.w_award) data.w_award = value.w_award
      if (value.w_cutpay) data.w_cutpay = value.w_cutpay
      this.setData(data)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ticket_money: 0,
    checkIcon: 'http://bjbsite.com/images/xcx/page/personnel/check.png',
    checkedIcon: 'http://bjbsite.com/images/xcx/page/personnel/checked.png',
    w_day: 0,
    w_pay: 0,
    w_award: 0,
    w_cutpay: 0,
    showPopup: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectTap() {
      this.triggerEvent('selectTap', this.data.index)
    },

    handleShow() {
      this.setData({ showPopup: true })
    },

    wDayInput(e) {
      const w_day = +e.detail.value
      this.setData({ w_day })
    },

    wPayInput(e) {
      const w_pay = e.detail.value
      this.setData({ w_pay })
    },

    wAwardInput(e) {
      const w_award = e.detail.value
      this.setData({ w_award })
    },

    wCutpayInput(e) {
      const w_cutpay = e.detail.value
      this.setData({ w_cutpay })
    },

    handleSubmit() {
      let { w_day, w_pay, w_award, w_cutpay } = this.data

      // if (!w_day || !w_pay) {
      //   wx.showToast({
      //     title: '工日、工价必须输入',
      //     icon: 'none'
      //   })
      // }

      w_day = w_day ? parseInt(w_day) : 0
      w_pay = w_pay ? parseFloat(formatFloat(w_pay, 2)) : 0
      w_award = w_award ? parseFloat(formatFloat(w_award, 2)) : 0
      w_cutpay = w_cutpay ? parseFloat(formatFloat(w_cutpay, 2)) : 0

      const ticket_money = w_day * w_pay + w_award - w_cutpay
      const { detail, index } = this.data
      detail.ticket_money = parseFloat(formatFloat(ticket_money, 2))
      detail.w_day = w_day
      detail.w_pay = w_pay
      detail.w_award = w_award
      detail.w_cutpay = w_cutpay

      this.triggerEvent('payInput', { data: detail, index })
      this.setData({ showPopup: false })
    }
  }
})
