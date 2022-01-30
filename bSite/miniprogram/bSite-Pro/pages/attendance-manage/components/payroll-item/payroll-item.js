// pages/attendance-manage/payroll-page/components/payroll-item/payroll-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object
    },
    hide1: {
      type: Boolean,
      value: false
    },
    hide2: {
      type: Boolean,
      value: false
    },
  },

  observers: {
    detail(value) {
      if (value.h_pay_time) {
        this.setData({ isPaied: true })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPaied: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goInfo() {
      const { ticket_id } = this.data.detail
      wx.navigateTo({
        url: `/pages/attendance-manage/payroll-info/payroll-info?ticket_id=${ticket_id}`,
      })
    },
    goPayInfo() {
      const { ticket_id } = this.data.detail
      wx.navigateTo({
        url: `/pages/attendance-manage/payroll-info/payroll-info?ticket_id=${ticket_id}`,
      })
    }
  }
})
