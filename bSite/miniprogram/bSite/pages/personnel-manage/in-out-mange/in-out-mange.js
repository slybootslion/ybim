// pages/personnel-manage/in-out-mange/in-out-mange.js
import StorageCache from '../../../tools/storage-cache'
import RosterApi from '../../../api/personnel/roster-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    personDetail: {},
    in_space_log: [],
    in_space: '1',
    btnDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.emp_id = options.emp_id
    this.init()
  },

  async init() {
    const personDetail = await StorageCache.getPersonDetail()
    const { emp_id } = this.data
    const data = {
      emp_id,
      type: 'inoutmg'
    }
    const { in_space_log, in_space } = await RosterApi.getRostersInfo(data)
    this.setData({ personDetail, in_space_log, in_space })
  },

  handleChange() {
    const { in_space } = this.data
    const content = in_space === '1' ? '确定该工人是否退场？' : '确定该工人是否进场？'
    wx.lin.showDialog({
      type: 'confirm',
      title: '注意！',
      content,
      zIndex: 1000,
      success: (e) => {
        const { cancel } = e
        if (cancel) return false
        this.handleEdit()
      }
    })
  },

  async handleEdit() {
    this.setData({ btnDisabled: true })
    let { in_space, emp_id, personDetail } = this.data
    let in_space_name
    if (in_space === '1') {
      in_space = '2'
      in_space_name = '已退场'
    } else {
      in_space = '1'
      in_space_name = '进场'
    }
    try {
      await RosterApi.putRostersEdit({ in_space, emp_id })
      personDetail.in_space = in_space
      personDetail.in_space_name = in_space_name
      await StorageCache.setPersonDetail(personDetail)
      wx.navigateBack()
    } catch (err) {
      this.setData({ btnDisabled: false })
    }
  }
})