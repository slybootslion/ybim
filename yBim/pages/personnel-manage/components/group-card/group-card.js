// pages/personnel-manage/components/group-card/group-card.js
import GroupApi from '../../../../api/personnel/group-model'
import StorageCache from '../../../../tools/storage-cache'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object
    },
    hide2: {
      type: Boolean,
      value: false
    },
    hide3: {
      type: Boolean,
      value: false
    },
    hide4: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    async toFormPage() {
      const { detail } = this.data
      await StorageCache.setGroupDetail(detail)
      this.triggerEvent('editItem', detail)
    },

    del() {
      wx.lin.showDialog({
        type: 'confirm',
        title: '注意！',
        content: '是否删除该班组',
        zIndex: 1000,
        success: (e) => {
          const { cancel } = e
          if (cancel) return
          this.delGroup()
        }
      })
    },

    async delGroup() {
      const { group_id, employee_count } = this.data.detail
      if (+employee_count) {
        wx.showToast({
          title: '该小组下有在场人员，无法删除',
          icon: 'none'
        })
        return
      }
      try {
        await GroupApi.postGroupDelete({ group_id })
        this.triggerEvent('isDel', this.data.detail)
      } catch (error) {
        console.log(error)
      }
    },

    groupTap() {
      if (this.data.hide4) return
      const { group_id } = this.data.detail
      wx.navigateTo({
        url: `/pages/personnel-manage/group-detail/group-detail?group_id=${group_id}`,
      })
    }
  }
})
