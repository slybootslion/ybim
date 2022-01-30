import StorageCache from '../../tools/storage-cache'
// pages/application/application.js
import { setScrollHeight } from '../../tools/system-info'

let list = [
  {
    title: '人员管理',
    basePage: 'personnel-manage',
    content: [
      { key: '添加工人', icon: 'tjgr', page: 'add-workers', code: 413 },
      { key: '花名册', icon: 'hmc', page: 'roster-list', code: 399 },
      { key: '人员变动', icon: 'rybd', page: 'personnel-change', code: 414 },
      { key: '班组管理', icon: 'bzgl', page: 'team-manage', code: 406 },
    ],
  },
  {
    title: '考勤工资管理',
    basePage: 'attendance-manage',
    content: [
      { key: '考勤统计', icon: 'kqtj', page: 'attendance-statistics', code: 467 },
      // { key: '扫脸考勤', icon: 'slkq', page: '' },
      { key: '记工单', icon: 'jgd', page: 'record-work-order', code: 454 },
      { key: '工资单', icon: 'gzd', page: 'payroll-page', code: 461 },
    ],
  },
  {
    title: '现场管理',
    basePage: 'site-manage',
    content: [
      { key: '环境监测', icon: 'hjjc', page: 'environ-monitoring', code: 388 },
      { key: '视频监控', icon: 'spjk', page: 'video-surveillance', code: 433 },
    ],
  },
]

function checkHide(list) {
  const hideList = wx.getStorageSync('userInfo').hidden
  const tempList = []
  if (hideList && hideList.length) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const content = item.content.map(c => {
        if (hideList.includes(c.code)) c.hide = true
        return c
      })
      item.content = content
      tempList.push(item)
    }
    return tempList
  } else {
    return list
  }
}
list = checkHide(list)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    contentHeight: 0,
    barColor: 'transparent',
    list
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await setScrollHeight(this)
  },

  handleTap(e) {
    const { page } = e.currentTarget.dataset
    if (!page) return
    const url = this.findUrl(page)
    if (url) wx.navigateTo({ url })
  },
  findUrl(page) {
    const { list } = this.data
    let url
    for (let i = 0; i < list.length; i++) {
      const currentBasePage = list[i].basePage
      const current = list[i]
      for (let j = 0; j < current.content.length; j++) {
        const item = current.content[j]
        if (page === item.page) {
          url = `/pages/${currentBasePage}/${page}/${page}`
          return url
        }
      }
    }
    return url
  },
})
