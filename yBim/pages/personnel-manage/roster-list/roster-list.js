// pages/personnel-manage/roster-list/roster-list.js
import RosterApi from '../../../api/personnel/roster-model'
import Paging from '../../../api/paging'
let lock = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    company_id: '',
    company_list: [],
    list: [],
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getData()
  },

  async getData() {
    this.data.pagingApi = new Paging(RosterApi.getWorkersList, 'employee_list')
    const res = await this.getMore()
    const { company_list, data, hadMore } = res
    this.setData({ company_list, list: data, hadMore, isLoading: false })
  },

  async getMore() {
    let data = {}
    const { company_id } = this.data
    if (company_id) data = { company_id }
    return this.data.pagingApi.getMore(data)
  },

  async scrollToLower() {
    if (lock) return
    if (!this.data.hadMore) return
    lock = true
    const { data, hadMore } = await this.getMore()
    this.setData({ list: data, hadMore })
    lock = false
  },

  companySelected(e) {
    this.data.company_id = e.detail.company_id
    this.getData()
  },

  toSearch () {
    wx.navigateTo({
      url: '/pages/personnel-manage/search-page/search-page',
    })
  }
})
