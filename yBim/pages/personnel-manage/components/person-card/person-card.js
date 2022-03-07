// pages/personnel-manage/components/person-card/person-card.js
import StorageCache from "../../../../tools/storage-cache";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
    },
    disablePersonInfo: {
      type: Boolean,
      value: false,
    },
    showLeaderTag: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    async personnelTap() {
      if (this.data.disablePersonInfo) return
      await StorageCache.setPersonDetail(this.data.detail)
      wx.navigateTo({
        url: '/pages/personnel-manage/person-detail/person-detail',
      })
    },

    iconTap() {
      const { iconColor, emp_id } = this.data.detail
      if (iconColor !== '#9d9d9d') return false
      this.triggerEvent('iconTap', emp_id)
    }
  },
})
