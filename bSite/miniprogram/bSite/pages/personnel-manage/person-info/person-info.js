// pages/personnel-manage/person-info/person-info.js
import RosterApi from '../../../api/personnel/roster-model'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewData: [
      { key: '姓名', keyName: 'staff_name' },
      { key: '性别', keyName: 'sex_name' },
      { key: '民族', keyName: 'nation' },
      { key: '出生日期', keyName: 'birthday' },
      { key: '身份证号', keyName: 'card_no' },
      { key: '住址', keyName: 'address' },
      { key: '手机号码', keyName: 'mobile_phone' },
      { key: '工人角色', keyName: 'job_role' },
      { key: '工种', keyName: 'worktype_name' },
      { key: '文化程度', keyName: 'edubackground_name' },
      { key: '发证机关', keyName: 'issuing_authority' },
    ],
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.data.emp_id = +options.emp_id
    const { emp_id, hideNavBtn } = options
    const data = { emp_id: +emp_id }
    if (hideNavBtn) data.hiddenCapsule = true
    // data.hiddenCapsule = true
    this.setData(data)
    this.getData()
  },

  async getData() {
    const { emp_id } = this.data
    const res = await RosterApi.getWorkersInfo({ emp_id })
    this.setData({ info: res })
  },

  back () {
    wx.reLaunch({
      url: '/pages/personnel-manage/add-workers/add-workers',
    })
  }
})