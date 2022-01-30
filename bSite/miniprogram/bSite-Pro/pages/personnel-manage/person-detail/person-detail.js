// pages/personnel-manage/person-detail/person-detail.js
import StorageCache from '../../../tools/storage-cache'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    personDetail: {},
    companyInfoData: [
      { key: '所属参建单位', keyName: 'company_name' },
      { key: '所属班组', keyName: 'group_name' },
      { key: '工种', keyName: 'work_type_name' },
      { key: '身份证号', keyName: 'card_no' },
    ],
    linkData: [
      { key: '个人信息', url: '/pages/personnel-manage/person-info/person-info' },
      { key: '进退场管理', url: '/pages/personnel-manage/in-out-mange/in-out-mange' },
      { key: '查考勤', url: '/pages/personnel-manage/check-attendance/check-attendance' },
      { key: '查工资', url: '/pages/personnel-manage/check-salary/check-salary' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.init()
  },

  async init() {
    const personDetail = await StorageCache.getPersonDetail()
    this.setData({ personDetail })
  },

  toLink(e) {
    let { url } = e.currentTarget.dataset
    if (!url) return false
    const { emp_id } = this.data.personDetail
    url = `${url}?emp_id=${emp_id}`
    wx.navigateTo({ url })
  },
})
