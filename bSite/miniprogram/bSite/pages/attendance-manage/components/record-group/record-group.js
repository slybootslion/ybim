// pages/attendance-manage/components/record-group/record-group.js
import RecordApi from '../../../../api/attendance/record-model'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    del() {
      wx.lin.showDialog({
        type: 'confirm',
        title: '注意！',
        content: '是否删除该记工单',
        zIndex: 1000,
        success: (e) => {
          const { cancel } = e
          if (cancel) return
          this.delRecord()
        }
      })
    },

    async delRecord() {
      const { ticket_id } = this.data.detail
      try {
        const res = await RecordApi.postTimeticketsDelete({ ticket_id })
        this.triggerEvent('isDel', this.data.detail)
      } catch (error) {
        console.log(error)
      }
    },

    async toFormPage () {
      this.triggerEvent('toFormPage', this.data.detail)
    }
  }
})
