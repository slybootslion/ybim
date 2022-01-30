// pages/personnel-manage/components/personnel-collapse/personnel-collapse.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
  },

  observers: {
    list(list) {
      if (!list.length) return
      const roster_list = list.map(detail => {
        detail.groups = detail.groups.map(group => {
          group.arrowIcon = 'down'
          return group
        })
        return detail
      })
      this.setData({ roster_list })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    roster_list: [],
    checkIcon: 'http://bjbsite.com/images/xcx/page/personnel/check.png',
    checkedIcon: 'http://bjbsite.com/images/xcx/page/personnel/checked.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFold(e) {
      this.handleArrowType(e)
    },
    handleExpand(e) {
      this.handleArrowType(e, 'up')
    },
    handleArrowType(e, type='down') {
      const { rosterlistid } = e.currentTarget.dataset
      const { roster_list } = this.data
      roster_list[rosterlistid].groups[e.detail.id].arrowIcon = type
      this.setData({ roster_list })
    },
    handleCheck(e) {
      const { index, groupindex, rosterlistid } = e.currentTarget.dataset
      const { roster_list } = this.data
      const item = roster_list[rosterlistid].groups[groupindex].workers[index]
      if (item.checked) {
        delete item.checked
      } else {
        item.checked = true
      }
      this.setData({ roster_list })
      this.triggerEvent('handleCheck', item)
    }
  }
})
