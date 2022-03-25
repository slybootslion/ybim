// pages/personnel-manage/search-page/search-page.js
import { debounce } from '../../../tools/utils'
import RosterApi from '../../../api/personnel/roster-model'
import Paging from '../../../api/paging'

let instance = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    value: '',
    pagingApi: null,
    hadMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    instance = this
  },

  async scrollToLower() {
    if (!this.data.hadMore) return
    const { data } = await this.getMore()
    this.setData({ list: data })
    wx.lin.hideToast()
  },

  inputChange: debounce(async e => {
    const { value } = e.detail
    instance.data.search_word = value
    const res = await instance.search()
    if (!res) return
    const { data, hadMore, total } = res
    instance.setData({ list: data, hadMore, total })
    wx.lin.hideToast()
  }, 800),

  async search() {
    this.data.pagingApi = new Paging(RosterApi.getWorkersList, 'employee_list')
    return this.getMore()
  },

  async getMore() {
    const search_word = this.data.search_word
    if (!search_word) return false
    wx.lin.showToast({
      icon: 'loading',
      title: '搜索中',
      duration: 99999,
    })
    return this.data.pagingApi.getMore({ search_word })
  },
})
