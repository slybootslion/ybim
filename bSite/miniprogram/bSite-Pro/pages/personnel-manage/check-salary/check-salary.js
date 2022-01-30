// pages/personnel-manage/check-salary/check-salary.js
import StorageCache from '../../../tools/storage-cache'
import RosterApi from '../../../api/personnel/roster-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.emp_id = options.emp_id
    this.getData()
  },

  async getData() {
    const personDetail = await StorageCache.getPersonDetail()
    const { emp_id } = this.data
    const data = {
      emp_id, // mock
      type: 'viewgz'
    }
    const list = await RosterApi.getRostersInfo(data)
    this.setData({ personDetail, emp_id, list })
  }
})