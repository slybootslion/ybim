// pages/personnel-manage/components/top-company-board/top-company-board.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    },
  },

  observers: {
    list(value) {
      const idx = this.data.currentIndex
      if (value && value.length) this.setData({ current: value[idx] })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: {},
    showPopup: false,
    currentIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectCompany() {
      this.setData({ showPopup: true })
    },

    popupItemClick(e) {
      const idx = e.currentTarget.dataset.index
      this.setData({
        currentIndex: idx,
        current: this.data.list[idx],
        showPopup: false
      })
      this.triggerEvent('itemClick', this.data.current)
    },
  },
})
